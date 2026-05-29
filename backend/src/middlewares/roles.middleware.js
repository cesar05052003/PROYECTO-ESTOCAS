const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ error: "No tienes permisos para esta acción" });
  }
  next();
};

module.exports = { checkRole };
