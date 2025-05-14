const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Publisher = sequelize.define('Publisher', {
  id_publisher: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'publishers',
  timestamps: false,
});

module.exports = Publisher;