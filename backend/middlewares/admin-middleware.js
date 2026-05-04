const authMiddleware = require("./auth-middleware");

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    next();
  } else {
    res.status(403).json({
      message: "Acceso denegado: Se requieren permisos de administrador",
    });
  }
};

module.exports = adminMiddleware;
