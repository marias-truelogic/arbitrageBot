
const { Exchange, ExchangePair } = require('../models');

module.exports = {
    list(req, res) {
        return ExchangePair.findAll({
            include: [Exchange],
        })
        .then(exchangePairs => res.status(200).send(exchangePairs))
        .catch(error => res.status(400).send(error));
    },
};
