'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExchangePair = sequelize.define('ExchangePair', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  // An Exchange Pair can only have one Exchange
  // An Exchange Pair has many Ticks
  ExchangePair.associate = (models) => {
    ExchangePair.belongsTo(models.Exchange, {
      foreignKey: 'exchangeId',
      onDelete: 'CASCADE',
    });
  };

  return ExchangePair;
};