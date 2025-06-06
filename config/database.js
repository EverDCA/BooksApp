const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_libros', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connect };