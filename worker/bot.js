#!/usr/bin/env node

const ccxt = require('ccxt');
const _ = require('lodash');
const kue = require('kue');
const colors = require('colors');
const program = require('commander');

program
    .version('0.0.1')
    .option('-m, --only-retrieve-markers', 'Only retrieve Markets')
    .option('-t, --only-retrieve-tickers', 'Only retrieve Tickers')
    .parse(process.argv);

const queue = kue.createQueue();
const { Exchange, ExchangePair, Ticker } = require('../server/models/index');

// TODO: Error handling

// ---
const ENABLED_EXCHANGES = [
    'bittrex',
    'binance'
]

// Init enabled exchanges
const exchanges = {};
ENABLED_EXCHANGES.forEach(id => {
    exchanges[id] = new (ccxt)[id]({ enableRateLimit: true })
});

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


    // Get exchange from db
    // Get all pairs
    // Iterate all pairs, create new job for each pair
    
    ENABLED_EXCHANGES.forEach(async (exchangeName) => {
        const exchange = await Exchange.findOne({
            where: { name: exchangeName },
            include: [{
                model: ExchangePair,
                as: 'exchangePairs',
            }],
        });

        if(exchange.exchangePairs) {
            exchange.exchangePairs.forEach((exchangePair) => {
                const job = queue.create('fetchTicker', {
                    exchangeId: exchange.id,
                    exchangeName: exchangeName,
                    pairId: exchangePair.id,
                    pairName: exchangePair.name
                }).ttl(1500).removeOnComplete(true).save(function (err) {
                    if (!err) console.log(`New Job; ${job.id} for exchange: ${exchangeName}, pair: ${exchangePair.name}`.green);
                });
            });
        }

    });

    queue.process('fetchTicker', 20, function (job, done) {
        console.log(`Retrieving ticker for exchange: ${job.data.exchangeName}, pair: ${job.data.pairName}`.yellow);
        retrieveTicker(job.data.exchangeId, job.data.exchangeName, job.data.pairId, job.data.pairName, done);
    });

    // Gracefully shutdown
    process.once('SIGTERM', function (sig) {
        queue.shutdown(5000, function (err) {
            console.log('Kue shutdown: ', err || '');
            process.exit(0);
        });
    });
};

// We use the names to fetch from the exchanges
// and the ids to store locally
const retrieveTicker = async (exchangeId, exchangeName, pairId, pairName, done) => {
    try {
        const ticker = await exchanges[exchangeName].fetchTicker(pairName);
        storeTicker(exchangeId, exchangeName, pairId, pairName, ticker);
        done();
    } catch (e) {
        done(e);
    }
};

// Example output:
    // { symbol: 'BTC/USDT',
    //     timestamp: 1516128253653,
    //     datetime: '2018-01-16T18:44:13.653Z',
    //     high: 13936.99,
    //     low: 10700.00000001,
    //     bid: 10951.095,
    //     ask: 10993,
    //     vwap: undefined,
    //     open: undefined,
    //     close: undefined,
    //     first: undefined,
    //     last: 10950.00000001,
    //     change: undefined,
    //     percentage: undefined,
    //     average: undefined,
    //     baseVolume: 13034.17570477,
    //     quoteVolume: 156189210.2309952,
    //     info: {
    //         MarketName: 'USDT-BTC',
    //         High: 13936.99,
    //         Low: 10700.00000001,
    //         Volume: 13034.17570477,
    //         Last: 10950.00000001,
    //         BaseVolume: 156189210.2309952,
    //         TimeStamp: '2018-01-16T18:44:13.653',
    //         Bid: 10951.095,
    //         Ask: 10993,
    //         OpenBuyOrders: 3622,
    //         OpenSellOrders: 6584,
    //         PrevDay: 13873.17000002,
    //         Created: '2015-12-11T06:31:40.633'
    //     }
    // }


const storeTicker = async(exchangeId, exchangeName, pairId, pairName, data) => {
    try {
        const ticker = await Ticker.create({
            datetime: data.datetime,
            high: data.high,
            low: data.low,
            bid: data.bid,
            ask: data.ask,
            exchangePairId: pairId,
        });
        
        console.log(`Created Ticker: ${exchangeName} - ${pairName}`.green);
    } catch(e) {
        console.log(colors.red(e.message));
    }
};

if (program.onlyRetrieveMarkers) {
    retrieveExchangeMarkets();
} else if(program.onlyRetrieveTickers) {
    retrieveTickers();
} else {
    retrieveExchangeMarkets();
    retrieveTickers();
}

module.exports = {
    retrieveExchangeMarkets,
    retrieveTickers
}
