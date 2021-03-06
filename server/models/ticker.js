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
    last: {
      type: DataTypes.DOUBLE
    },
    change: {
      type: DataTypes.DOUBLE
    },
  });

  Ticker.associate = (models) => {
    Ticker.belongsTo(models.ExchangePair, {
      foreignKey: 'exchangePairId',
      onDelete: 'CASCADE',
    });
  };

  return Ticker;
};