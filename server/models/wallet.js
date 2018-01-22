'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    additionalAddress: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    coinId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exchangeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  // An Wallet can only have one Exchange and once Coin
  Wallet.associate = (models) => {
    Wallet.belongsTo(models.Exchange, {
      foreignKey: 'exchangeId',
      onDelete: 'CASCADE',
    });
    Wallet.belongsTo(models.Coin, {
      foreignKey: 'coinId',
    });
  };

  return Wallet;
};