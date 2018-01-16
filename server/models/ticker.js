'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticker = sequelize.define('Ticker', {
    datetime: {
      type: DataTypes.DATE
    },
    high: {
      type: DataTypes.DOUBLE 
    },
    low: {
      type: DataTypes.DOUBLE
    },
    bid: {
      type: DataTypes.DOUBLE
    },
    ask: {
      type: DataTypes.DOUBLE
    },
  });

  Ticker.associate = (models) => {
    Ticker.belongsTo(models.Exchange, {
      foreignKey: 'exchangeId',
      onDelete: 'CASCADE'
    });
    Ticker.belongsTo(models.ExchangePair, {
      foreignKey: 'exchangePairId',
      onDelete: 'CASCADE'
    });
  };

  return Ticker;
};