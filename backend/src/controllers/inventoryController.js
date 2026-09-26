const Activo = require('../models/Activo');
const Ambiente = require('../models/Ambiente');
const TipoActivo = require('../models/TipoActivo');
const Movimiento = require('../models/Movimiento');
const { sequelize } = require('../../database');
const Joi = require('joi');

const createSchema = Joi.object({
  tipo_activo_id: Joi.string().uuid().required(),
  ambiente_id: Joi.string().uuid().required(),
  origen: Joi.string().required(),
  especificacion_origen: Joi.string().allow('', null).optional(),
  descripcion: Joi.string().allow('', null).optional(),
  responsable: Joi.string().allow('', null).optional(),
  fecha_ingreso: Joi.date().optional(),
  valor: Joi.number().allow(null).optional(),
  estado: Joi.string().valid('Activo', 'Inactivo', 'Dañado').optional(),
});

const updateSchema = Joi.object({
  tipo_activo_id: Joi.string().uuid().optional(),
  ambiente_id: Joi.string().uuid().optional(),
  origen: Joi.string().optional(),
  especificacion_origen: Joi.string().allow('', null).optional(),
  descripcion: Joi.string().allow('', null).optional(),
  responsable: Joi.string().allow('', null).optional(),
  fecha_ingreso: Joi.date().optional(),
  valor: Joi.number().allow(null).optional(),
  estado: Joi.string().valid('Activo', 'Inactivo', 'Dañado').optional(),
});

exports.getAll = async (req, res) => {
  try {
    const activos = await Activo.findAll({
      include: [
        { model: Ambiente, as: 'ambiente', attributes: ['nombre', 'codigo'] },
        { model: TipoActivo, as: 'tipo', attributes: ['nombre', 'codigo'] }
      ],
      order: [['numero_correlativo', 'DESC']]
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
      include: [
        { model: Ambiente, as: 'ambiente' },
        { model: TipoActivo, as: 'tipo' }
      ]
    });
    activo ? res.json(activo) : res.status(404).json({ message: 'Activo no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getNextSequence = async (req, res) => {
  try {
    const maxCorrelativo = await Activo.max('numero_correlativo') || 0;
    res.json({ next: maxCorrelativo + 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo secuencia' });
  }
};

exports.create = async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const t = await sequelize.transaction();
  
  try {
    const tipo = await TipoActivo.findByPk(value.tipo_activo_id);
    const ambiente = await Ambiente.findByPk(value.ambiente_id);
    
    if (!tipo || !ambiente) {
      await t.rollback();
      return res.status(400).json({ message: 'Tipo de activo o ambiente inválido' });
    }
    
    // Calcular numero correlativo
    const maxCorrelativo = await Activo.max('numero_correlativo', { transaction: t }) || 0;
    const numero_correlativo = maxCorrelativo + 1;
    
    // Generar código: XYZAACC-GG
    // X = 1, YZ = 50
    const AA = tipo.codigo.toString().padStart(2, '0');
    const CC = ambiente.codigo.toString().padStart(2, '0');
    const NN = numero_correlativo; // Número sin padding en el ejemplo, o se puede agregar padding
    
    const fechaIngreso = value.fecha_ingreso ? new Date(value.fecha_ingreso) : new Date();
    const GG = (fechaIngreso.getFullYear().toString()).slice(-2);
    
    const codigo_activo = `150${AA}${CC}${NN}-${GG}`;
    
    value.numero_correlativo = numero_correlativo;
    value.codigo_activo = codigo_activo;
    
    if (req.file) {
      value.imagen = `/uploads/activos/${req.file.filename}`;
    }
    
    const activo = await Activo.create(value, { transaction: t });
    await t.commit();
    
    res.status(201).json(activo);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al registrar activo' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  try {
    const activo = await Activo.findByPk(id);
    if (!activo) return res.status(404).json({ message: 'Activo no encontrado' });
    
    if (req.file) {
      value.imagen = `/uploads/activos/${req.file.filename}`;
    }
    
    await activo.update(value);
    res.json(activo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar activo' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const activo = await Activo.findByPk(id);
    if (!activo) return res.status(404).json({ message: 'Activo no encontrado' });
    
    await activo.destroy();
    res.json({ message: 'Activo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar activo' });
  }
};
