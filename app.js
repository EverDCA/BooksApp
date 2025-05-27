const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const { connect } = require('./config/database'); // Updated to use Sequelize

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const categoriesRouter = require('./routes/categories');
const authorsRouter = require('./routes/authors'); 
const publishersRouter = require('./routes/publishers');
const recoveryRouter = require('./routes/recovery'); // Import recovery router

const Author = require('./models/Author');
const Category = require('./models/Category');
const Publisher = require('./models/Publisher');
const Book = require('./models/Book');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore(),
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
    console.log('Database connection established and all models synchronized.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/categories', categoriesRouter);
app.use('/authors', authorsRouter); 
app.use('/publishers', publishersRouter);
app.use('/recovery', recoveryRouter); // Use recovery router

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
