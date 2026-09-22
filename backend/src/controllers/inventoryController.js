const Activo = require('../models/Activo');
const Ambiente = require('../models/Ambiente');
const Movimiento = require('../models/Movimiento');
const { sequelize } = require('../../database');
const Joi = require('joi');

const createSchema = Joi.object({
  nombre: Joi.string().required(),
  tipo: Joi.string().required(),
  ambiente_id: Joi.string().uuid().required(),
  marca: Joi.string().allow('', null).optional(),
  modelo: Joi.string().allow('', null).optional(),
  numero_serie: Joi.string().allow('', null).optional(),
  qr_codigo: Joi.string().allow('', null).optional(),
});

const updateStatusSchema = Joi.object({
  ambiente_id: Joi.string().uuid().required(),
  observaciones: Joi.string().allow('', null).optional(),
});

exports.getAll = async (req, res) => {
  try {
    const activos = await Activo.findAll({
      include: [{ model: Ambiente, as: 'ambiente', attributes: ['nombre'] }]
    });
    res.json(activos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getById = async (req, res) => {
  try {
    const activo = await Activo.findByPk(req.params.id, {
      include: [{ model: Ambiente, as: 'ambiente' }]
    });
    activo ? res.json(activo) : res.status(404).json({ message: 'Activo no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  try {
    const crypto = require('crypto');
    value.uuid = crypto.randomUUID();
    
    const activo = await Activo.create(value);
    res.status(201).json(activo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar activo' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateStatusSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const { ambiente_id, observaciones } = value;
  const usuario_id = req.user.id;
  
  const t = await sequelize.transaction();
  
  try {
    const activo = await Activo.findByPk(id, { transaction: t });
    if (!activo) {
      await t.rollback();
      return res.status(404).json({ message: 'Activo no encontrado' });
    }
    
    const ambiente_origen_id = activo.ambiente_id;

    // 1. Update active
    activo.ambiente_id = ambiente_id;
    await activo.save({ transaction: t });
    
    // 2. Register movement
    await Movimiento.create({
      activo_id: id,
      ambiente_origen_id,
      ambiente_destino_id: ambiente_id,
      usuario_id,
      observaciones
    }, { transaction: t });
    
    await t.commit();
    res.json({ message: 'Traslado registrado correctamente' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message || 'Error en la transacción de traslado' });
  }
};
