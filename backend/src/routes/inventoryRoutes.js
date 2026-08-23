const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');
const authorize = require('../middlewares/rbacMiddleware');

router.get('/', authorize(['Administrador', 'Técnico', 'Auditor']), controller.getAll);
router.get('/:uuid', authorize(['Administrador', 'Técnico', 'Auditor']), controller.getById);
router.post('/', authorize(['Administrador', 'Técnico']), controller.create);
router.patch('/:uuid/status', authorize(['Administrador', 'Técnico']), controller.updateStatus);

module.exports = router;
