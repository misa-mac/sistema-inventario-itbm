const authorize = (roles = []) => {
  return (req, res, next) => {
    // Usamos el rol que viene en req.user (decodificado del JWT por authMiddleware)
    const userRole = req.user ? req.user.rol : null;
    
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
};
module.exports = authorize;
