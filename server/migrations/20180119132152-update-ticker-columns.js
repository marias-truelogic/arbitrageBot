'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tickers', 'last', Sequelize.DOUBLE).then(() => {
      return queryInterface.addColumn('Tickers', 'change', Sequelize.DOUBLE);
    });
  },
  down: (queryInterface /* , Sequelize */) => {
    return queryInterface.removeColumn('Tickers', 'last').then(() => {
      return queryInterface.removeColumn('Tickers', 'change');
    });
  }
};
