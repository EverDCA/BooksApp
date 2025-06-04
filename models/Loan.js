const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Book = require('./Book');

const Loan = sequelize.define('Loan', {
  id_loan: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id_user',
    },
  },
  id_book: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id_book',
    },
  },
  loan_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  state: {
    type: DataTypes.TINYINT,
    defaultValue: 1, // 1 = activo, 0 = devuelto/cancelado
  },
}, {
  tableName: 'loans',
  timestamps: false,
});

module.exports = Loan;
