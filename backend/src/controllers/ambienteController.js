const Ambiente = require('../models/Ambiente');

exports.getAll = async (req, res) => {
  try {
    const ambientes = await Ambiente.findAll();
    res.json(ambientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  try {
    const { codigo, nombre, descripcion } = req.body;
    const nuevo = await Ambiente.create({ codigo, nombre, descripcion });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear ambiente' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion } = req.body;
    const ambiente = await Ambiente.findByPk(id);
    if (!ambiente) return res.status(404).json({ message: 'No encontrado' });
    
    await ambiente.update({ codigo, nombre, descripcion });
    res.json(ambiente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar ambiente' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const ambiente = await Ambiente.findByPk(id);
    if (!ambiente) return res.status(404).json({ message: 'No encontrado' });
    
    await ambiente.destroy();
    res.json({ message: 'Ambiente eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar ambiente. Puede que tenga activos asociados.' });
  }
};
