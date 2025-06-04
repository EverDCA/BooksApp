const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { requireRole } = require('./roles');

// Registro
router.get('/register', (req, res) => {
  res.render('users/register', { messages: req.flash() });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validar email existente
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      req.flash('error', 'El correo ya está registrado');
      return res.redirect('/users/register');
    }
    // Validar nombre de usuario existente
    const existingName = await User.findOne({ where: { name } });
    if (existingName) {
      req.flash('error', 'El nombre de usuario ya está en uso');
      return res.redirect('/users/register');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash, role: 'usuario' });
    req.flash('success', 'Registro exitoso, ahora puedes iniciar sesión');
    res.redirect('/users/login');
  } catch (err) {
    req.flash('error', 'Error en el registro');
    res.redirect('/users/register');
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('users/login', { messages: req.flash() });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, state: 1 } });
    if (!user) {
      req.flash('error', 'Usuario o contraseña incorrectos');
      return res.redirect('/users/login');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Usuario o contraseña incorrectos');
      return res.redirect('/users/login');
    }
    req.session.user = { id: user.id_user, name: user.name, role: user.role };
    res.redirect('/dashboard'); // Redirige a dashboard.ejs
  } catch (err) {
    req.flash('error', 'Error al iniciar sesión');
    res.redirect('/users/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/users/login');
  });
});

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/users/login');
}

// Vista de gestión de usuarios (solo admin)
router.get('/', isAuthenticated, requireRole('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']]
    });
    const totalPages = Math.ceil(count / limit);
    res.render('users/index', {
      users,
      user: req.session.user,
      messages: req.flash(),
      currentPage: page,
      totalPages
    });
  } catch (error) {
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Cambiar rol de usuario (solo admin)
router.post('/:id/role', isAuthenticated, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['usuario', 'bibliotecario', 'admin'].includes(role)) {
      req.flash('error', 'Rol no válido');
      return res.redirect('/users');
    }
    // No permitir que el admin se cambie a sí mismo el rol
    if (parseInt(req.params.id) === req.session.user.id) {
      req.flash('error', 'No puedes cambiar tu propio rol');
      return res.redirect('/users');
    }
    await User.update({ role }, { where: { id_user: req.params.id } });
    req.flash('success', 'Rol actualizado');
    res.redirect('/users');
  } catch (error) {
    req.flash('error', 'Error al actualizar el rol');
    res.redirect('/users');
  }
});

// Cambiar contraseña de usuario (solo admin)
router.post('/:id/password', isAuthenticated, requireRole('admin'), async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.update({ password: hash }, { where: { id_user: req.params.id } });
    req.flash('success', 'Contraseña actualizada');
    res.redirect('/users');
  } catch (error) {
    req.flash('error', 'Error al actualizar la contraseña');
    res.redirect('/users');
  }
});

// Cambiar estado de usuario (activar/desactivar, solo admin)
router.post('/:id/state', isAuthenticated, requireRole('admin'), async (req, res) => {
  try {
    const { state } = req.body;
    // No permitir que el admin se desactive a sí mismo
    if (parseInt(req.params.id) === req.session.user.id) {
      req.flash('error', 'No puedes desactivar tu propio usuario');
      return res.redirect('/users');
    }
    await User.update({ state }, { where: { id_user: req.params.id } });
    req.flash('success', 'Estado actualizado');
    res.redirect('/users');
  } catch (error) {
    req.flash('error', 'Error al actualizar el estado');
    res.redirect('/users');
  }
});

module.exports = router;
module.exports.isAuthenticated = isAuthenticated;
