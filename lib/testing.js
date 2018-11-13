const Sequelize = require('sequelize');
const sequelize = require('../connection');

const Testing = sequelize.define('testing', {
  column_a: Sequelize.TEXT,
}, {
  tableName: 'testing',
  timestamps: false,
});

module.exports = Testing;
