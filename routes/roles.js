// Middleware para verificar el rol del usuario
function requireRole(role) {
  return function (req, res, next) {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    return res.status(403).render('error', { message: 'Acceso denegado', error: { status: 403 }, user: req.session.user });
  };
}

// Middleware para permitir solo roles distintos a 'usuario'
function forbidUsuario(req, res, next) {
  if (req.session.user && req.session.user.role === 'usuario') {
    return res.status(403).render('errors/forbidden', { user: req.session.user });
  }
  next();
}

// Middleware para permitir solo roles distintos a 'usuario' y 'bibliotecario'
function forbidUsuarioYBibliotecario(req, res, next) {
  if (req.session.user && (req.session.user.role === 'usuario' || req.session.user.role === 'bibliotecario')) {
    return res.status(403).render('errors/forbidden', { user: req.session.user });
  }
  next();
}

module.exports = { requireRole, forbidUsuario, forbidUsuarioYBibliotecario };
