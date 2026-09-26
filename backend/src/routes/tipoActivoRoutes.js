const express = require('express');
const tipoActivoController = require('../controllers/tipoActivoController');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Token requerido');
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret_itbm_inventario_v2', (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');
    req.user = decoded;
    next();
  });
};

router.use(verifyToken);

router.get('/', tipoActivoController.getAll);
router.post('/', tipoActivoController.create);
router.put('/:id', tipoActivoController.update);
router.delete('/:id', tipoActivoController.delete);

module.exports = router;
