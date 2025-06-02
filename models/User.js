const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  state: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  role: {
    type: DataTypes.ENUM('usuario', 'bibliotecario', 'admin'),
    allowNull: false,
    defaultValue: 'usuario',
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
