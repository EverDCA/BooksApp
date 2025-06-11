const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const { isAuthenticated } = require('./users');
const { forbidUsuarioYBibliotecario } = require('./roles');
const { Op } = require('sequelize');

// Vista principal de recuperación con paginación y búsqueda
router.get('/', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    const pageBooks = parseInt(req.query.pageBooks) || 1;
    const pageAuthors = parseInt(req.query.pageAuthors) || 1;
    const pageCategories = parseInt(req.query.pageCategories) || 1;
    const pagePublishers = parseInt(req.query.pagePublishers) || 1;
    const limit = 5;

    // Parámetros de búsqueda para cada sección
    const searchBooks = req.query.searchBooks ? req.query.searchBooks.trim() : '';
    const searchAuthors = req.query.searchAuthors ? req.query.searchAuthors.trim() : '';
    const searchCategories = req.query.searchCategories ? req.query.searchCategories.trim() : '';
    const searchPublishers = req.query.searchPublishers ? req.query.searchPublishers.trim() : '';

    // Construir filtros para cada modelo
    const booksWhere = { state: 0 };
    if (searchBooks) {
      booksWhere.name = { [Op.like]: `%${searchBooks}%` };
    }

    const authorsWhere = { state: 0 };
    if (searchAuthors) {
      authorsWhere.name = { [Op.like]: `%${searchAuthors}%` };
    }

    const categoriesWhere = { state: 0 };
    if (searchCategories) {
      categoriesWhere.name = { [Op.like]: `%${searchCategories}%` };
    }

    const publishersWhere = { state: 0 };
    if (searchPublishers) {
      publishersWhere.name = { [Op.like]: `%${searchPublishers}%` };
    }

    const [booksData, authorsData, categoriesData, publishersData] = await Promise.all([
      Book.findAndCountAll({ where: booksWhere, limit, offset: (pageBooks - 1) * limit, order: [['name', 'ASC']] }),
      Author.findAndCountAll({ where: authorsWhere, limit, offset: (pageAuthors - 1) * limit, order: [['name', 'ASC']] }),
      Category.findAndCountAll({ where: categoriesWhere, limit, offset: (pageCategories - 1) * limit, order: [['name', 'ASC']] }),
      Publisher.findAndCountAll({ where: publishersWhere, limit, offset: (pagePublishers - 1) * limit, order: [['name', 'ASC']] })
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
      searchBooks,
      searchAuthors,
      searchCategories,
      searchPublishers,
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

// Eliminar permanentemente libro
router.post('/books/:id/delete', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Book.destroy({ where: { id_book: req.params.id } });
    req.flash('success', 'Libro eliminado permanentemente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al eliminar el libro permanentemente');
    res.redirect('/recovery');
  }
});

// Eliminar permanentemente autor
router.post('/authors/:id/delete', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Author.destroy({ where: { id_author: req.params.id } });
    req.flash('success', 'Autor eliminado permanentemente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al eliminar el autor permanentemente');
    res.redirect('/recovery');
  }
});

// Eliminar permanentemente categoría
router.post('/categories/:id/delete', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Category.destroy({ where: { id_category: req.params.id } });
    req.flash('success', 'Categoría eliminada permanentemente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al eliminar la categoría permanentemente');
    res.redirect('/recovery');
  }
});

// Eliminar permanentemente editorial
router.post('/publishers/:id/delete', isAuthenticated, forbidUsuarioYBibliotecario, async (req, res) => {
  try {
    await Publisher.destroy({ where: { id_publisher: req.params.id } });
    req.flash('success', 'Editorial eliminada permanentemente');
    res.redirect('/recovery');
  } catch (error) {
    req.flash('error', 'Error al eliminar la editorial permanentemente');
    res.redirect('/recovery');
  }
});

module.exports = router;
