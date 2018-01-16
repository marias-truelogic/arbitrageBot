const { Exchange, ExchangePair, Ticker } = require('../models');

module.exports = {
    // create(req, res) {
    //     return Exchange.create({
    //         name: req.body.title,
    //     })
    //         .then(exchange => res.status(201).send(exchange))
    //         .catch(error => res.status(400).send(error));
    // },
    list(req, res) {
        return Ticker.findAll()
            .then(tickers => res.status(200).send(tickers))
            .catch(error => res.status(400).send(error));
    },
};
