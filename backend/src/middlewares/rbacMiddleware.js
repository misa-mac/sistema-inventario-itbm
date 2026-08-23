const authorize = (roles = []) => {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role']; 
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
};
module.exports = authorize;
