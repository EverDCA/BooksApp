const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Author = require('./Author');
const Category = require('./Category');
const Publisher = require('./Publisher');

const Book = sequelize.define('Book', {
  id_book: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  year_published: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  num_pages: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_author: {
    type: DataTypes.INTEGER,
    references: {
      model: Author,
      key: 'id_author',
    },
  },
  id_category: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id_category',
    },
  },
  id_publisher: {
    type: DataTypes.INTEGER,
    references: {
      model: Publisher,
      key: 'id_publisher',
    },
  },
  state: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  cover_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'URL de la imagen de portada del libro',
  },
}, {
  tableName: 'books',
  timestamps: true,
});

// Define relationships
Book.belongsTo(Author, { foreignKey: 'id_author' });
Book.belongsTo(Category, { foreignKey: 'id_category' });
Book.belongsTo(Publisher, { foreignKey: 'id_publisher' });

module.exports = Book;