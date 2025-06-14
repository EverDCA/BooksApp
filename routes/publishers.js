const express = require('express');
const router = express.Router();
const Publisher = require('../models/Publisher');
const { isAuthenticated } = require('./users');
const { forbidUsuario } = require('./roles');
const { Op } = require('sequelize');

// Mostrar todas las editoriales activas con paginación y búsqueda
router.get('/', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';

    // Construcción de filtros
    const where = { state: 1 };

    // Búsqueda por nombre de editorial
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows: publishers } = await Publisher.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']]
    });    const totalPages = Math.ceil(count / limit);
    res.render('publishers/index', {
      publishers,
      messages: req.flash(),
      currentPage: page,
      totalPages,
      search,
      user: req.session.user
    });
  } catch (error) {
    res.status(500).send('Error al obtener las editoriales');
  }
});

// Mostrar formulario para añadir publisher
router.get('/add', isAuthenticated, forbidUsuario, (req, res) => {
  res.render('publishers/add', { name: '', messages: req.flash(), user: req.session.user });
});

// Procesar formulario para añadir publisher
router.post('/add', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const { name } = req.body;
    // Validar nombre de editorial existente
    const existing = await Publisher.findOne({ where: { name } });
    if (existing) {
      req.flash('error', 'El nombre de la editorial ya está en uso');
      return res.redirect('/publishers/add');
    }
    await Publisher.create({ name, state: 1 });
    req.flash('success', 'Editorial añadida correctamente');
    res.redirect('/publishers');
  } catch (error) {
    req.flash('error', 'Error al añadir la editorial');
    res.redirect('/publishers/add');
  }
});

// Mostrar formulario para editar publisher
router.get('/edit/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const publisher = await Publisher.findByPk(req.params.id);
    if (!publisher) return res.status(404).send('Editorial no encontrada');
    res.render('publishers/edit', { publisher, messages: req.flash(), user: req.session.user });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Procesar edición de publisher
router.post('/edit/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    const { name } = req.body;
    // Validar nombre de editorial existente en otro registro
    const existing = await Publisher.findOne({ where: { name, id_publisher: { [Op.ne]: req.params.id } } });
    if (existing) {
      req.flash('error', 'El nombre de la editorial ya está en uso');
      return res.redirect(`/publishers/edit/${req.params.id}`);
    }
    await Publisher.update({ name }, { where: { id_publisher: req.params.id } });
    req.flash('success', 'Editorial editada correctamente');
    res.redirect('/publishers');
  } catch (error) {
    req.flash('error', 'Error al editar la editorial');
    res.redirect(`/publishers/edit/${req.params.id}`);
  }
});

// Eliminar (desactivar) publisher
router.get('/delete/:id', isAuthenticated, forbidUsuario, async (req, res) => {
  try {
    await Publisher.update({ state: 0 }, { where: { id_publisher: req.params.id } });
    req.flash('success', 'Editorial eliminada correctamente');
    res.redirect('/publishers');
  } catch (error) {
    req.flash('error', 'Error al eliminar la editorial');
    res.redirect('/publishers');
  }
});

module.exports = router;