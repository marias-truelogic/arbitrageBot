const exchangesController = require('../controllers').exchanges;
const tickersController = require('../controllers').tickers;
const exchangePairsController = require('../controllers').exchangePairs;
const walletsController = require('../controllers').wallets;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Todos API!',
    }));

    app.post('/api/exchanges', exchangesController.create);
    app.get('/api/exchanges', exchangesController.list);

    app.get('/api/tickers', tickersController.list);

    app.get('/api/exchangePairs', exchangePairsController.list);

    app.get('/api/wallets', exchangePairsController.list);
};