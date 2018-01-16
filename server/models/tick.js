'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tick = sequelize.define('Tick', {
    datetime: DataTypes.DATE,
    high: DataTypes.DOUBLE,
    low: DataTypes.DOUBLE,
    bid: DataTypes.DOUBLE,
    ask: DataTypes.DOUBLE
  });

  Tick.associate = (models) => {
    Tick.belongsTo(models.Exchange, {
      foreignKey: 'exchangeId',
      onDelete: 'CASCADE'
    });
    Tick.belongsTo(models.ExchangePair, {
      foreignKey: 'exchangePairId',
      onDelete: 'CASCADE'
    });
  };


  return Tick;
};