const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const { isAuthenticated } = require('./users');
const { forbidUsuario } = require('./roles');
const { Op } = require('sequelize');

// Mostrar todos los autores activos con paginación
router.get('/', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Cambia este valor si quieres más/menos por página
    const offset = (page - 1) * limit;

    // Obtener autores activos con paginación
    const { count, rows: authors } = await Author.findAndCountAll({
      where: { state: 1 },
      limit,
      offset,
      order: [['name', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);
    res.render('authors/index', {
      authors,
      messages: req.flash(),
      currentPage: page,
      totalPages,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).send('Error al obtener los autores');
  }
});

// Mostrar formulario para añadir autor
router.get('/add', isAuthenticated, forbidUsuario, (req, res) => {
  res.render('authors/add', { name: '', messages: req.flash(), user: req.session.user });
});

// Procesar formulario para añadir autor
router.post('/add', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const { name } = req.body;
    // Validar nombre de autor existente
    const existing = await Author.findOne({ where: { name } });
    if (existing) {
      req.flash('error', 'El nombre de autor ya está en uso');
      return res.redirect('/authors/add');
    }
    await Author.create({ name, state: 1 });
    req.flash('success', 'Autor añadido correctamente');
    res.redirect('/authors');
  } catch (error) {
    req.flash('error', 'Error al añadir el autor');
    res.redirect('/authors/add');
  }
});

// Mostrar formulario para editar autor
router.get('/edit/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).send('Autor no encontrado');
    res.render('authors/edit', { author, messages: req.flash(), user: req.session.user });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Procesar edición de autor
router.post('/edit/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const { name } = req.body;
    // Validar nombre de autor existente en otro registro
    const existing = await Author.findOne({ where: { name, id_author: { [Op.ne]: req.params.id } } });
    if (existing) {
      req.flash('error', 'El nombre de autor ya está en uso');
      return res.redirect(`/authors/edit/${req.params.id}`);
    }
    await Author.update({ name }, { where: { id_author: req.params.id } });
    req.flash('success', 'Autor editado correctamente');
    res.redirect('/authors');
  } catch (error) {
    req.flash('error', 'Error al editar el autor');
    res.redirect(`/authors/edit/${req.params.id}`);
  }
});

// Eliminar (desactivar) autor
router.get('/delete/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    await Author.update({ state: 0 }, { where: { id_author: req.params.id } });
    req.flash('success', 'Autor eliminado correctamente');
    res.redirect('/authors');
  } catch (error) {
    req.flash('error', 'Error al eliminar el autor');
    res.redirect('/authors');
  }
});

module.exports = router;
