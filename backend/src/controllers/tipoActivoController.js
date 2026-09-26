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
