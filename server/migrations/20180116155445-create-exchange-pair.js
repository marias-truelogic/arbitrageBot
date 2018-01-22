'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('ExchangePairs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      txFee: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      minTradeSize: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      change: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      exchangeId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Exchanges',
          key: 'id',
          as: 'exchangeId',
        },
      }
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('ExchangePairs'),
};
