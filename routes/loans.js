const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../routes/users');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Publisher = require('../models/Publisher');
const User = require('../models/User');

// Mostrar préstamos activos del usuario
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Préstamos activos (no paginados)
    const loans = await Loan.findAll({
      where: { id_user: req.session.user.id, state: 1 },
      include: [
        { model: Book, include: [Author, Category, Publisher] }
      ],
      order: [['loan_date', 'DESC']]
    });

    // Historial paginado (todos los préstamos)
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const { count, rows: history } = await Loan.findAndCountAll({
      where: { id_user: req.session.user.id },
      include: [
        { model: Book, include: [Author, Category, Publisher] }
      ],
      order: [['loan_date', 'DESC']],
      limit,
      offset
    });
    const totalPages = Math.ceil(count / limit);
    res.render('loans/index', {
      loans,
      history,
      currentPage: page,
      totalPages,
      user: req.session.user,
      messages: req.flash()
    });
  } catch (error) {
    res.status(500).send('Error al cargar los préstamos');
  }
});

// Devolver libro (finalizar préstamo)
router.post('/:id/return', isAuthenticated, async (req, res) => {
  try {
    await Loan.update({ state: 0, return_date: new Date() }, { where: { id_loan: req.params.id, id_user: req.session.user.id } });
    req.flash('success', 'Libro devuelto correctamente');
    res.redirect('/loans');
  } catch (error) {
    req.flash('error', 'Error al devolver el libro');
    res.redirect('/loans');
  }
});

// Prestar libro (formulario y acción)
router.get('/new/:id_book', isAuthenticated, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id_book, { include: [Author, Category, Publisher] });
    if (!book) return res.status(404).send('Libro no encontrado');
    res.render('loans/new', { book, user: req.session.user, messages: req.flash() });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de préstamo');
  }
});

router.post('/new/:id_book', isAuthenticated, async (req, res) => {
  try {
    await Loan.create({
      id_user: req.session.user.id,
      id_book: req.params.id_book,
      loan_date: new Date(),
      state: 1
    });
    req.flash('success', 'Libro prestado correctamente');
    res.redirect('/loans');
  } catch (error) {
    req.flash('error', 'Error al registrar el préstamo');
    res.redirect('/loans');
  }
});

module.exports = router;
