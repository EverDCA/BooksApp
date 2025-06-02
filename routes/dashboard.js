const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const { isAuthenticated } = require('./users');

// Página principal (dashboard)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // Libros destacados: los 5 más recientes
    const featuredBooks = await Book.findAll({
      where: { state: 1 },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [Author, Category, Publisher]
    });
    // Libro recomendado: uno random
    const countBooks = await Book.count({ where: { state: 1 } });
    let recommendedBook = null;
    if (countBooks > 0) {
      const randomOffset = Math.floor(Math.random() * countBooks);
      const books = await Book.findAll({
        where: { state: 1 },
        include: [Author, Category, Publisher],
        offset: randomOffset,
        limit: 1
      });
      recommendedBook = books[0];
    }
    // Estadísticas
    const stats = {
      books: countBooks,
      authors: await Author.count({ where: { state: 1 } }),
      categories: await Category.count({ where: { state: 1 } }),
      publishers: await Publisher.count({ where: { state: 1 } })
    };
    res.render('dashboard', {
      featuredBooks,
      recommendedBook,
      stats,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).send('Error al cargar el dashboard');
  }
});

// Redirige / a welcome.ejs
router.get('/', async (req, res) => {
  try {
    // Libros destacados: los 30 más recientes
    const featuredBooks = await Book.findAll({
      where: { state: 1 },
      order: [['createdAt', 'DESC']],
      limit: 30,
      include: [Author, Category, Publisher]
    });
    // Estadísticas
    const stats = {
      books: await Book.count({ where: { state: 1 } }),
      authors: await Author.count({ where: { state: 1 } }),
      categories: await Category.count({ where: { state: 1 } }),
      publishers: await Publisher.count({ where: { state: 1 } })
    };
    res.render('welcome', {
      featuredBooks,
      stats,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).send('Error al cargar la página principal');
  }
});

module.exports = router;
