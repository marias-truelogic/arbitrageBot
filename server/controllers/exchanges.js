const { Exchange, ExchangePair } = require('../models');

module.exports = {
    create(req, res) {
        return Exchange.create({
            name: req.body.title,
        })
        .then(exchange => res.status(201).send(exchange))
        .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Exchange.findAll({
            include: [{
                model: ExchangePair,
                as: 'exchangePairs',
            }],
        })
        .then(exchanges => res.status(200).send(exchanges))
        .catch(error => res.status(400).send(error));
    },
};
