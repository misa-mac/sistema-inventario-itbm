const express = require('express');
const inventoryController = require('../controllers/inventoryController');
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

const upload = require('../middleware/upload');

router.use(verifyToken);

router.get('/', inventoryController.getAll);
router.get('/next-sequence', inventoryController.getNextSequence);
router.get('/:id', inventoryController.getById);
router.post('/', upload.single('imagen'), inventoryController.create);
router.put('/:id', upload.single('imagen'), inventoryController.update);
router.delete('/:id', inventoryController.delete);

module.exports = router;
