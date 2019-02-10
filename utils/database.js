const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'nodeComplete', 'nodeComplete', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;