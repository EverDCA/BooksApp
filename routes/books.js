const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');

// Mostrar todos los libros activos con paginación
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const { count, rows: books } = await Book.findAndCountAll({
      where: { state: 1 },
      limit,
      offset,
      order: [['name', 'ASC']],
      include: [Author, Category, Publisher]
    });
    const totalPages = Math.ceil(count / limit);
    res.render('books/index', {
      books,
      messages: req.flash(),
      currentPage: page,
      totalPages
    });
  } catch (error) {
    res.status(500).send('Error al obtener los libros');
  }
});

// Ruta para mostrar el formulario de añadir libro
router.get('/add', async (req, res) => {
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
      cover_url: ''
    });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de añadir libro');
  }
});

// Ruta para procesar el formulario de añadir libro
router.post('/add', async (req, res) => {
  try {
    const { name, isbn, year_published, num_pages, id_author, id_category, id_publisher, cover_url } = req.body;
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
    req.flash('error', 'Error al añadir el libro');
    res.redirect('/books/add');
  }
});

// Ruta para mostrar el formulario de edición de libro
router.get('/edit/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    const authors = await Author.findAll({ where: { state: 1 } });
    const categories = await Category.findAll({ where: { state: 1 } });
    const publishers = await Publisher.findAll({ where: { state: 1 } });
    if (!book) return res.status(404).send('Libro no encontrado');
    res.render('books/edit', { book, authors, categories, publishers, messages: req.flash() });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Ruta para procesar la edición de un libro
router.post('/edit/:id', async (req, res) => {
  try {
    const { name, isbn, year_published, num_pages, id_author, id_category, id_publisher, cover_url } = req.body;
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
router.get('/delete/:id', async (req, res) => {
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