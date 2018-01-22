const { Exchange, Wallet, Coin } = require('../models');

module.exports = {
    list(req, res) {
        return Wallet.findAll({
            include: [Exchange, Coin]
        })
        .then(wallets => res.status(200).send(wallets))
        .catch(error => res.status(400).send(error));
    },
};
