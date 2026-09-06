const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbacMiddleware');

// Aplicamos los roles ajustados a los valores exactos en BD: 'admin', 'tecnico', 'auditor'
router.get('/', authMiddleware, authorize(['admin', 'tecnico', 'auditor']), controller.getAll);
router.get('/:uuid', authMiddleware, authorize(['admin', 'tecnico', 'auditor']), controller.getById);
router.post('/', authMiddleware, authorize(['admin', 'tecnico']), controller.create);
router.patch('/:uuid/status', authMiddleware, authorize(['admin', 'tecnico']), controller.updateStatus);

module.exports = router;