const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const { isAuthenticated } = require('./users');
const { forbidUsuarioYBibliotecario } = require('./roles');

// Vista principal de recuperación con paginación
router.get('/', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    const pageBooks = parseInt(req.query.pageBooks) || 1;
    const pageAuthors = parseInt(req.query.pageAuthors) || 1;
    const pageCategories = parseInt(req.query.pageCategories) || 1;
    const pagePublishers = parseInt(req.query.pagePublishers) || 1;
    const limit = 5;

    const [booksData, authorsData, categoriesData, publishersData] = await Promise.all([
      Book.findAndCountAll({ where: { state: 0 }, limit, offset: (pageBooks - 1) * limit }),
      Author.findAndCountAll({ where: { state: 0 }, limit, offset: (pageAuthors - 1) * limit }),
      Category.findAndCountAll({ where: { state: 0 }, limit, offset: (pageCategories - 1) * limit }),
      Publisher.findAndCountAll({ where: { state: 0 }, limit, offset: (pagePublishers - 1) * limit })
    ]);

    res.render('recovery/index', {
      books: booksData.rows,
      booksCount: booksData.count,
      booksPage: pageBooks,
      booksTotalPages: Math.ceil(booksData.count / limit),
      authors: authorsData.rows,
      authorsCount: authorsData.count,
      authorsPage: pageAuthors,
      authorsTotalPages: Math.ceil(authorsData.count / limit),
      categories: categoriesData.rows,
      categoriesCount: categoriesData.count,
      categoriesPage: pageCategories,
      categoriesTotalPages: Math.ceil(categoriesData.count / limit),
      publishers: publishersData.rows,
      publishersCount: publishersData.count,
      publishersPage: pagePublishers,
      publishersTotalPages: Math.ceil(publishersData.count / limit),
      messages: req.flash(),
      user: req.session.user // <-- para el navbar
    });
  } catch (error) {
    res.status(500).send('Error al cargar la vista de recuperación');
  }
});

// Restaurar libro
router.post('/books/:id/restore', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Book.update({ state: 1 }, { where: { id_book: req.params.id } });
    req.flash('success', 'Libro reestablecido correctamente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al reestablecer el libro');
    res.redirect('/recovery');
  }
});

// Restaurar autor
router.post('/authors/:id/restore', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Author.update({ state: 1 }, { where: { id_author: req.params.id } });
    req.flash('success', 'Autor reestablecido correctamente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al reestablecer el autor');
    res.redirect('/recovery');
  }
});

// Restaurar categoría
router.post('/categories/:id/restore', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Category.update({ state: 1 }, { where: { id_category: req.params.id } });
    req.flash('success', 'Categoría reestablecida correctamente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al reestablecer la categoría');
    res.redirect('/recovery');
  }
});

// Restaurar editorial
router.post('/publishers/:id/restore', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Publisher.update({ state: 1 }, { where: { id_publisher: req.params.id } });
    req.flash('success', 'Editorial reestablecida correctamente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al reestablecer la editorial');
    res.redirect('/recovery');
  }
});

module.exports = router;
