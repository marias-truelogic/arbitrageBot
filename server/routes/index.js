const exchangesController = require('../controllers').exchanges;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Todos API!',
    }));

    app.post('/api/exchanges', exchangesController.create);
    app.get('/api/exchanges', exchangesController.list);
};