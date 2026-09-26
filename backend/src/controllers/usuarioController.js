const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password_hash'] } // No enviar contraseñas
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno obteniendo usuarios' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre_completo, email, password, rol, activo } = req.body;
    
    // Check if email exists
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre_completo,
      email,
      password_hash,
      rol: rol || 'tecnico',
      activo: activo !== undefined ? activo : true
    });

    const { password_hash: _, ...userWithoutPass } = nuevoUsuario.toJSON();
    res.status(201).json(userWithoutPass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, email, password, rol, activo } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Check if new email is taken by another user
    if (email && email !== usuario.email) {
      const existente = await Usuario.findOne({ where: { email } });
      if (existente) return res.status(400).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
    }

    const updateData = { nombre_completo, email, rol, activo };

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    await usuario.update(updateData);
    
    const { password_hash: _, ...userWithoutPass } = usuario.toJSON();
    res.json(userWithoutPass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevenir auto-eliminación si usamos req.user.id
    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
