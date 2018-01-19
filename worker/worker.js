const schedule = require('node-schedule');
const { retrieveExchangeMarkets, retrieveTickers } = require('./bot');

// Every 24 hours, update exchange markets and pairs
schedule.scheduleJob('0 0 * * *', function (fireDate) {
    retrieveExchangeMarkets();
    cleanUpOldJobs();
});

// Every second, get tickers
setInterval(retrieveTickers, 1000);
