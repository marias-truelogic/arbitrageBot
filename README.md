# Dependencies:
- Node 8+, Yarn
- Redis
- Postgres
- PM2: http://pm2.keymetrics.io/
- Sequelize CLI: https://github.com/sequelize/cli

# Bot Set up:
- Install Dependencies: `yarn install`
- Create databases: `sequelize db:create`
- Run Migrations: `yarn migrate`

# Bot Usage:
- Sync Exchanges and Market Pairs. Run: `bot.js -m`
- Initialize worker with PM2: `pm2 start worker/worker.js`
- Manual usage:
    - Retrieve Market Pairs: `worker/bot.js -m`
    - Retrieve Market Pair Tickers: `worker/bot.js -t`

The Exchanges will be updated every 24hs.
The worker will retrieve the exchange pair tickers every second for every enabled Exchange.
On every new ticker, the bot will check if it should perform an action:
- Buy
- Sell
- Move to another account (TBD)

# Frontend Usage:
- Run development server: `yarn start:be`
- Run development frontend web server: `yarn start:fe `

# TODO:
- Better error handling
- Retries
- Proxies