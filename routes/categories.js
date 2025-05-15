const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Mostrar todas las categorías activas con paginación
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Cambia este valor si quieres más/menos por página
    const offset = (page - 1) * limit;

    // Obtener categorías activas con paginación
    const { count, rows: categories } = await Category.findAndCountAll({
      where: { state: 1 },
      limit,
      offset,
      order: [['name', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);
    res.render('categories/index', {
      categories,
      messages: req.flash(),
      currentPage: page,
      totalPages
    });
  } catch (error) {
    res.status(500).send('Error al obtener las categorías');
  }
});

// Mostrar formulario para añadir categoría
router.get('/add', (req, res) => {
  res.render('categories/add', { name: '', messages: req.flash() });
});

// Procesar formulario para añadir categoría
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;
    await Category.create({ name, state: 1 });
    req.flash('success', 'Categoría añadida correctamente');
    res.redirect('/categories');
  } catch (error) {
    req.flash('error', 'Error al añadir la categoría');
    res.redirect('/categories/add');
  }
});

// Mostrar formulario para editar categoría
router.get('/edit/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Categoría no encontrada');
    res.render('categories/edit', { category, messages: req.flash() });
  } catch (error) {
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Procesar edición de categoría
router.post('/edit/:id', async (req, res) => {
  try {
    const { name } = req.body;
    await Category.update({ name }, { where: { id_category: req.params.id } });
    req.flash('success', 'Categoría editada correctamente');
    res.redirect('/categories');
  } catch (error) {
    req.flash('error', 'Error al editar la categoría');
    res.redirect(`/categories/edit/${req.params.id}`);
  }
});

// Eliminar (desactivar) categoría
router.get('/delete/:id', async (req, res) => {
  try {
    await Category.update({ state: 0 }, { where: { id_category: req.params.id } });
    req.flash('success', 'Categoría eliminada correctamente');
    res.redirect('/categories');
  } catch (error) {
    req.flash('error', 'Error al eliminar la categoría');
    res.redirect('/categories');
  }
});

module.exports = router;