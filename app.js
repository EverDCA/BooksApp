const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const { connect } = require('./config/database'); // Updated to use Sequelize

const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const categoriesRouter = require('./routes/categories');
const authorsRouter = require('./routes/authors'); 
const publishersRouter = require('./routes/publishers');
const recoveryRouter = require('./routes/recovery'); // Import recovery router
const loansRouter = require('./routes/loans'); // Import loans router

const Author = require('./models/Author');
const Category = require('./models/Category');
const Publisher = require('./models/Publisher');
const Book = require('./models/Book');
const Loan = require('./models/Loan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const isProduction = process.env.NODE_ENV === 'production';
let sessionStore;
if (isProduction) {
  // Ejemplo: usar connect-session-sequelize en producción
  // const SequelizeStore = require('connect-session-sequelize')(session.Store);
  // const { sequelize } = require('./config/database');
  // sessionStore = new SequelizeStore({ db: sequelize });
  // sessionStore.sync();
  // Descomenta y configura lo anterior si tienes Sequelize conectado
  sessionStore = new session.MemoryStore(); // Temporal, reemplaza en producción
} else {
  sessionStore = new session.MemoryStore();
}

app.use(
  session({
    cookie: { maxAge: 3600000 }, // 1 hora
    store: sessionStore,
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
  })
);

app.use(flash());

// Connect to the database
(async () => {
  try {
    await connect();
    await Author.sync();
    await Category.sync();
    await Publisher.sync();
    await Book.sync();
    const User = require('./models/User');
    await User.sync();
    await Loan.sync();
    console.log('Database connection established and all models synchronized.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

const { isAuthenticated } = require('./routes/users');

// Mantén protegidas las rutas de gestión
app.use('/books', isAuthenticated, booksRouter);
app.use('/categories', isAuthenticated, categoriesRouter);
app.use('/authors', isAuthenticated, authorsRouter);
app.use('/publishers', isAuthenticated, publishersRouter);
app.use('/loans', isAuthenticated, loansRouter); // <-- Agregar esta línea para préstamos
app.use('/recovery', recoveryRouter); // Use recovery router

// Usa dashboardRouter para las rutas principales
app.use('/', dashboardRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  res.render('errors/notfound', { user: req.session ? req.session.user : null });
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('errors/error', { error: err, message: err.message });
});

// Definir asociaciones después de importar todos los modelos para evitar dependencias circulares
Author.hasMany(Book, { foreignKey: 'id_author' });
Book.belongsTo(Author, { foreignKey: 'id_author' });
Category.hasMany(Book, { foreignKey: 'id_category' });
Book.belongsTo(Category, { foreignKey: 'id_category' });
Publisher.hasMany(Book, { foreignKey: 'id_publisher' });
Book.belongsTo(Publisher, { foreignKey: 'id_publisher' });
const User = require('./models/User');
Book.hasMany(Loan, { foreignKey: 'id_book' });
Loan.belongsTo(Book, { foreignKey: 'id_book' });
User.hasMany(Loan, { foreignKey: 'id_user' });
Loan.belongsTo(User, { foreignKey: 'id_user' });

module.exports = app;
