const schedule = require('node-schedule');
const { retrieveExchangeMarkets, cleanUpOldJobs, retrieveTickers } = require('./bot');

// Every 24 hours, update exchange markets and pairs
schedule.scheduleJob('0 0 * * *', () => {
    console.log('every 24 hours');
    retrieveExchangeMarkets();
});

// Every 5 minutes, clean up old jobs
schedule.scheduleJob('*/5 * * * *', () => {
    console.log('every 5 minutes')
    cleanUpOldJobs();
});

// Every 10 seconds, retrieve tickers
schedule.scheduleJob('*/10 * * * * *', () => {
    console.log('every 10 seconds')
    retrieveTickers();
});
