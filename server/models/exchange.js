'use strict';
module.exports = (sequelize, DataTypes) => {
  const Exchange = sequelize.define('Exchange', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  // The Exchange can have many Exchange Pairs
  Exchange.associate = (models) => {
    Exchange.hasMany(models.ExchangePair, {
      foreignKey: 'exchangeId',
      as: 'exchangePairs',
    });
    Exchange.hasMany(models.Tick, {
      foreignKey: 'tickId',
      as: 'ticks',
    });
  };

  return Exchange;
};