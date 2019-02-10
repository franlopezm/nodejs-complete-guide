const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'nodeComplete', 'nodeComplete', {
  dialect: 'mysql',
  host: 'localhost',
  operatorsAliases: Sequelize.Op,
  logging: false
});

module.exports = sequelize;