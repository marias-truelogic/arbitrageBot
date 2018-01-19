#!/usr/bin/env node

require('dotenv').config();

const ccxt = require('ccxt');
const _ = require('lodash');
const kue = require('kue');
const colors = require('colors');
const program = require('commander');

program
    .version('0.0.1')
    .option('-m, --only-retrieve-markets', 'Only retrieve Markets')
    .option('-t, --only-retrieve-tickers', 'Only retrieve Tickers')
    .option('-c, --clean-up-old-jobs', 'Clean up old jobs')
    .parse(process.argv);

const queue = kue.createQueue();
const { Exchange, ExchangePair, Ticker } = require('../server/models/index');

// TODO: Error handling

// ---
const ENABLED_EXCHANGES = [
    'bittrex', // US
    'binance', // Japan
    'kucoin', // Hong Kong
    'yobit' //Russia (TIMING OUT. FIX THIS)
];

// Init enabled exchanges
const exchanges = {};
ENABLED_EXCHANGES.forEach(id => {
    exchanges[id] = new (ccxt)[id]({ enableRateLimit: true })
});

// TODO: Make this prettier ^
if (process.env.BITTREX_WITHDRAW_KEY && process.env.BITTREX_WITHDRAW_SECRET && exchanges.bittrex) {
    exchanges.bittrex.apiKey = process.env.BITTREX_WITHDRAW_KEY; 
    exchanges.bittrex.secret = process.env.BITTREX_WITHDRAW_SECRET; 
}

if (process.env.BINANCE_WITHDRAW_KEY && process.env.BINANCE_WITHDRAW_SECRET && exchanges.binance) {
    exchanges.binance.apiKey = process.env.BINANCE_WITHDRAW_KEY;
    exchanges.binance.secret = process.env.BINANCE_WITHDRAW_SECRET;
}

// Retrieve exchange-market pairs
// Do this every 24 hours or more?
const retrieveExchangeMarkets = () => {

    ENABLED_EXCHANGES.forEach(async (exchangeName) => {
        const loadedMarkets = await exchanges[exchangeName].load_markets();
        
        Exchange.findOrCreate({
            where: {
                name: exchangeName
            }
        }).then((exchangeResult) => {
            const [exchangeInstance, exchangeWasCreated] = exchangeResult;
            _.forOwn(loadedMarkets, (value, key) => {
                ExchangePair.findOrCreate({
                    where: {
                        name: key,
                        exchangeId: exchangeInstance.id
                    }
                }).then((exchangePairResult) => {
                    const [exchangePairInstance, exchangePairWasCreated] = exchangePairResult;
                    console.log(`Created pair: ${exchangeName} - ${key}`.green);
                });
            });
        });
    });
};

// Retrieve enabled market tickers
// Do this every second?
// TODO: Simplify, too complex
const retrieveTickers = async () => {
    const exchangePairs = await ExchangePair.findAll({include: [Exchange]});
    const processedExchangePairs = exchangePairs.map((exchangePair) => {
        return {
            name: exchangePair.name,
            pairId: exchangePair.id,
            exchangeId: exchangePair.Exchange.id,
            exchangeName: exchangePair.Exchange.name,
        }
    });

    const groupedExchangePairs = _.groupBy(processedExchangePairs, 'name');
    const groupedExchangePairsWithAtLeastTwoExchanges = _.pickBy(groupedExchangePairs, (value, key) => {
        return value.length > 1;
    });

    _.forOwn(groupedExchangePairsWithAtLeastTwoExchanges, (value, key) => {
        const exchangeNames = _.map(value, 'exchangeName');
        const exchangeIds = _.map(value, 'exchangeId');

        const job = queue.create('fetchMarketPairTicker', {
            exchangeData: value,
            pairName: key
        }).removeOnComplete(true).save(function (err) {
            if (!err) console.log(`New Job; ${colors.green(job.id)} for exchanges: [${colors.green(exchangeNames)}], pair: ${colors.green(key)}`);
        });
    });

    queue.process('fetchMarketPairTicker', function (job, done) {
        retrieveTicker(job.data, done);
    });
};

// We use the names to fetch from the exchanges
// and the ids to store locally
const retrieveTicker = async (jobData, done) => {
    try {
        console.time("Exchange Pair Tickers");

        // Order is preserved, we can use tickerData index to access exchangeData
        const tickerData = await Promise.all(jobData.exchangeData.map(async (exchangeData) => {
            return await exchanges[exchangeData.exchangeName].fetchTicker(exchangeData.name);
        }));

        const highest = _.maxBy(tickerData, t => t.last);
        const highestIndex = tickerData.indexOf(highest);
        const highestExchange = jobData.exchangeData[highestIndex];

        const lowest = _.minBy(tickerData, t => t.last);
        const lowestIndex = tickerData.indexOf(lowest);
        const lowestExchange = jobData.exchangeData[lowestIndex];

        console.log(`${colors.bgWhite(colors.cyan(highestExchange.name))} - Lowest: ${colors.green(lowestExchange.exchangeName + ' ' + lowest.last)} | Highest: ${colors.red(highestExchange.exchangeName + ' ' + highest.last)}`);
        console.timeEnd("Exchange Pair Tickers");

        // processPrice(exchangeId, exchangeName, pairId, pairName, ticker);
        storeTickers(jobData.exchangeData, tickerData);
        done();
    } catch (e) {
        console.error(e.message);
        done(e);
    }
};

const storeTickers = (exchangeData, tickerData) => {
    try {
        tickerData.map(async (tickerItem, index) => {
            if (exchangeData[index]) {
                const exchange = exchangeData[index];
                const newTicker = await Ticker.create({
                    datetime: tickerItem.datetime,
                    high: tickerItem.high,
                    low: tickerItem.low,
                    bid: tickerItem.bid,
                    ask: tickerItem.ask,
                    last: tickerItem.last,
                    change: tickerItem.change,
                    exchangePairId: exchange.pairId,
                });

                console.log(`Created Ticker: ${exchange.exchangeName} - ${exchange.name}`.green);
            }
        });        
    } catch(e) {
        console.error(colors.red(e.message));
    }
};

const processPrice = async (exchangeId, exchangeName, pairId, pairName, data) => {
    /* TODO:
        - When all of the pairs for all exchanges are done
        - Determine which pair on which exchange is higher / lower

        Getting addresses of the exchanges:
        // fetchDepositAddress (code, params={})
        // createDepositAddress (code, params={})
        // Code is the currency code in the exchange you want an address for
        // Maybe set these values manually for extra safety

        Deposit: (https://github.com/ccxt/ccxt/wiki/Manual#deposit)

        Withdraw: (https://github.com/ccxt/ccxt/wiki/Manual#withdraw)
        exchange.withdraw (currency, amount, address, tag = undefined, params = {})


        Placing Orders: (https://github.com/ccxt/ccxt/wiki/Manual#placing-orders)
        Market orders: (https://github.com/ccxt/ccxt/wiki/Manual#market-orders)

        Market price orders are also known as spot price orders, 
        instant orders or simply market orders. A market order gets executed immediately. 
        The matching engine of the exchange closes the order (fulfills it) with one or 
        more transactions from the top of the order book stack.
        --
        exchange.createMarketBuyOrder (symbol, amount[, params])
        exchange.createMarketSellOrder (symbol, amount[, params])

        Limit price orders are also known as limit orders. Some exchanges accept limit orders only. 
        Limit orders require a price (rate per unit) to be submitted with the order. 
        The exchange will close limit orders if and only if market price reaches the desired level.
        --
        exchange.createLimitBuyOrder (symbol, amount, price[, params])
        exchange.createLimitSellOrder (symbol, amount, price[, params])

    */
};

const cleanUpOldJobs = () => {
    kue.Job.rangeByState('complete', 0, n, 'asc', function (err, jobs) {
        jobs.forEach(function (job) {
            job.remove(function () {
                console.log('removed ', job.id);
            });
        });
    });
};

if (program.onlyRetrieveMarkets) { // -m
    retrieveExchangeMarkets();
} else if(program.onlyRetrieveTickers) { // -t
    retrieveTickers();
} else if(program.cleanUpOldJobs) { // -c
    cleanUpOldJobs();
} else {
    retrieveExchangeMarkets();
    retrieveTickers();
}

module.exports = {
    retrieveExchangeMarkets,
    cleanUpOldJobs,
    retrieveTickers
}
