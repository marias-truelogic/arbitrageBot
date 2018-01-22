'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExchangePair = sequelize.define('ExchangePair', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minTradeSize: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    change: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    txFee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  });

  // An Exchange Pair can only have one Exchange
  // An Exchange Pair has many Tickers
  ExchangePair.associate = (models) => {
    ExchangePair.belongsTo(models.Exchange, {
      foreignKey: 'exchangeId',
      onDelete: 'CASCADE',
    });
  };

  return ExchangePair;
};