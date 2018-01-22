'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coin = sequelize.define('Coin', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exchangeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  // Coins belong to an exchange
  // TODO: Two coins should belong to a pair
  Coin.associate = (models) => {
    Coin.belongsTo(models.Exchange, {
      foreignKey: 'exchangeId'
    });
  };

  return Coin;
};