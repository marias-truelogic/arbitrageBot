'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Tickers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      datetime: {
        type: Sequelize.DATE
      },
      high: {
        type: Sequelize.DOUBLE
      },
      low: {
        type: Sequelize.DOUBLE
      },
      bid: {
        type: Sequelize.DOUBLE
      },
      ask: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      exchangeId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Exchanges',
          key: 'id',
          as: 'exchangeId',
        },
      },
      exchangePairId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'ExchangePairs',
          key: 'id',
          as: 'exchangePairId',
        },
      },
    });
  },
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Tickers'),
};