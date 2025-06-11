const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const Loan = require('../models/Loan');
const { isAuthenticated } = require('./users');
const { forbidUsuario } = require('./roles');
const { Op } = require('sequelize');

// Mostrar todos los libros activos con paginación, búsqueda y filtrado
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';
    const categoryFilter = req.query.category;
    const authorFilter = req.query.author;
    const publisherFilter = req.query.publisher;

    // Construcción de filtros
    const where = { state: 1 };
    const include = [Author, Category, Publisher];

    // Búsqueda por nombre de libro
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    // Filtrado por categoría
    if (categoryFilter && categoryFilter !== '') {
      where.id_category = categoryFilter;
    }

    // Filtrado por autor
    if (authorFilter && authorFilter !== '') {
      where.id_author = authorFilter;
    }

    // Filtrado por editorial
    if (publisherFilter && publisherFilter !== '') {
      where.id_publisher = publisherFilter;
    }

    const { count, rows: books } = await Book.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
      include
    });
    const totalPages = Math.ceil(count / limit);

    // Obtener todas las categorías, autores y editoriales para los filtros
    const categories = await Category.findAll({ where: { state: 1 }, order: [['name', 'ASC']] });
    const authors = await Author.findAll({ where: { state: 1 }, order: [['name', 'ASC']] });
    const publishers = await Publisher.findAll({ where: { state: 1 }, order: [['name', 'ASC']] });

    // --- INICIO: Lógica de préstamos activos por usuario ---
    let userLoans = {};
    if (req.session.user) {
      const loans = await Loan.findAll({
        where: { id_user: req.session.user.id, state: 1 },
        attributes: ['id_book'],
      });
      userLoans = loans.reduce((acc, loan) => {
        acc[loan.id_book] = true;
        return acc;
      }, {});
    }
    // --- FIN: Lógica de préstamos activos por usuario ---

    res.render('books/index', {
      books,
      messages: req.flash(),
      currentPage: page,
      totalPages,
      user: req.session.user,
      userLoans,
      search,
      categoryFilter,
      authorFilter,
      publisherFilter,
      categories,
      authors,
      publishers
    });
  } catch (error) {
    res.status(500).send('Error al obtener los libros: ' + error.message);
  }
});

// Ruta para mostrar el formulario de añadir libro
router.get('/add', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const authors = await Author.findAll({ where: { state: 1 } });
    const categories = await Category.findAll({ where: { state: 1 } });
    const publishers = await Publisher.findAll({ where: { state: 1 } });
    // Enviar valores vacíos para los campos del formulario
    res.render('books/add', {
      authors,
      categories,
      publishers,
      messages: req.flash(),
      name: '',
      isbn: '',
      year_published: '',
      num_pages: '',
      id_author: '',
      id_category: '',
      id_publisher: '',
      cover_url: '',
      user: req.session.user // <-- Añadido para el navbar
    });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de añadir libro');
  }
});

// Ruta para procesar el formulario de añadir libro
router.post('/add', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const { name, isbn, year_published, num_pages, id_author, id_category, id_publisher, cover_url } = req.body;
    if (cover_url && cover_url.length > 255) {
      req.flash('error', 'La URL de la portada no puede superar los 255 caracteres.');
      return res.redirect('/books/add');
    }
    // Validar nombre de libro existente
    const existing = await Book.findOne({ where: { name } });
    if (existing) {
      req.flash('error', 'El nombre del libro ya está en uso');
      return res.redirect('/books/add');
    }
    await Book.create({
      name,
      isbn,
      year_published,
      num_pages,
      id_author,
      id_category,
      id_publisher,
      cover_url,
      state: 1
    });
    req.flash('success', 'Libro añadido correctamente');
    res.redirect('/books');
  } catch (error) {
    req.flash('error', error.message || 'Error al añadir el libro');
    res.redirect('/books/add');
  }
});

// Ruta para mostrar el formulario de edición de libro
router.get('/edit/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    const authors = await Author.findAll({ where: { state: 1 } });
    const categories = await Category.findAll({ where: { state: 1 } });
    const publishers = await Publisher.findAll({ where: { state: 1 } });
    if (!book) return res.status(404).send('Libro no encontrado');
    res.render('books/edit', { book, authors, categories, publishers, messages: req.flash(), user: req.session.user });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Ruta para procesar la edición de un libro
router.post('/edit/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const { name, isbn, year_published, num_pages, id_author, id_category, id_publisher, cover_url } = req.body;
    // Validar nombre de libro existente en otro registro
    const existing = await Book.findOne({ where: { name, id_book: { [Op.ne]: req.params.id } } });
    if (existing) {
      req.flash('error', 'El nombre del libro ya está en uso');
      return res.redirect(`/books/edit/${req.params.id}`);
    }
    await Book.update({
      name,
      isbn,
      year_published,
      num_pages,
      id_author,
      id_category,
      id_publisher,
      cover_url
    }, {
      where: { id_book: req.params.id }
    });
    req.flash('success', 'Libro editado correctamente');
    res.redirect('/books');
  } catch (error) {
    req.flash('error', 'Error al editar el libro');
    res.redirect(`/books/edit/${req.params.id}`);
  }
});

// Ruta para eliminar (desactivar) un libro
router.get('/delete/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    await Book.update({ state: 0 }, { where: { id_book: req.params.id } });
    req.flash('success', 'Libro eliminado correctamente');
    res.redirect('/books');
  } catch (error) {
    req.flash('error', 'Error al eliminar el libro');
    res.redirect('/books');
  }
});

module.exports = router;