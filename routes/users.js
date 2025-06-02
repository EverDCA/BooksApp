const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// Registro
router.get('/register', (req, res) => {
  res.render('users/register', { messages: req.flash() });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash('error', 'El correo ya está registrado');
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

module.exports = router;
module.exports.isAuthenticated = isAuthenticated;
