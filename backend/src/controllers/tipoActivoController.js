const TipoActivo = require('../models/TipoActivo');

exports.getAll = async (req, res) => {
  try {
    const tipos = await TipoActivo.findAll({ order: [['codigo', 'ASC']] });
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  try {
    const { codigo, nombre, descripcion } = req.body;
    const nuevo = await TipoActivo.create({ codigo, nombre, descripcion });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear tipo de activo' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion } = req.body;
    const tipo = await TipoActivo.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'No encontrado' });
    
    await tipo.update({ codigo, nombre, descripcion });
    res.json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar tipo de activo' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoActivo.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'No encontrado' });
    
    await tipo.destroy();
    res.json({ message: 'Tipo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar. Puede que tenga activos asociados.' });
  }
};
