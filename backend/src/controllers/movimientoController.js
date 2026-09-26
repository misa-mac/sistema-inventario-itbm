const Movimiento = require('../models/Movimiento');
const Activo = require('../models/Activo');
const Ambiente = require('../models/Ambiente');
const Usuario = require('../models/Usuario');
const notificacionController = require('./notificacionController');

exports.getAll = async (req, res) => {
  try {
    const eventos = await Movimiento.findAll({
      include: [
        { model: Activo, attributes: ['id', 'codigo_activo', 'estado'] },
        { model: Ambiente, as: 'origen', attributes: ['nombre'] },
        { model: Ambiente, as: 'destino', attributes: ['nombre'] },
        { model: Usuario, attributes: ['nombre_completo', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};

exports.getByActivo = async (req, res) => {
  try {
    const { activoId } = req.params;
    const eventos = await Movimiento.findAll({
      where: { activo_id: activoId },
      include: [
        { model: Ambiente, as: 'origen', attributes: ['nombre'] },
        { model: Ambiente, as: 'destino', attributes: ['nombre'] },
        { model: Usuario, attributes: ['nombre_completo'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener eventos del activo' });
  }
};

exports.create = async (req, res) => {
  try {
    const { activo_id, tipo_evento, ambiente_destino_id, estado_nuevo, costo_mantenimiento, observaciones } = req.body;
    const usuario_id = req.user.id;

    // Buscar el activo actual
    const activo = await Activo.findByPk(activo_id);
    if (!activo) return res.status(404).json({ message: 'Activo no encontrado' });

    let ambiente_origen_id = activo.ambiente_id;
    let estado_anterior = activo.estado;
    
    // Corregir estado si es baja
    let estado_final = estado_nuevo;
    if (tipo_evento === 'baja') {
      estado_final = 'Inactivo';
    }

    // Registrar el evento (Usamos ambiente_origen_id como fallback para evitar crashes por constraints heredados NOT NULL)
    const nuevoEvento = await Movimiento.create({
      tipo_evento,
      activo_id,
      usuario_id,
      ambiente_origen_id,
      ambiente_destino_id: ambiente_destino_id || ambiente_origen_id,
      estado_anterior,
      estado_nuevo: estado_final || null,
      costo_mantenimiento: costo_mantenimiento || null,
      observaciones
    });

    // Actualizar el activo según el evento
    const updateData = {};
    if (tipo_evento === 'traslado' && ambiente_destino_id) {
      updateData.ambiente_id = ambiente_destino_id;
    }
    if (estado_final && estado_final !== estado_anterior) {
      updateData.estado = estado_final;
    }

    if (Object.keys(updateData).length > 0) {
      await activo.update(updateData);
    }
    
    // Generar Notificación del sistema
    let titulo_alerta = 'Nuevo Evento Registrado';
    let mensaje_alerta = `Se registró un ${tipo_evento} para el equipo ${activo.codigo_activo}.`;
    let tipo_alerta = 'info';
    
    if (tipo_evento === 'baja') {
      titulo_alerta = 'Equipo Dado de Baja';
      tipo_alerta = 'error';
    } else if (tipo_evento === 'mantenimiento' && estado_final === 'Dañado') {
      titulo_alerta = 'Equipo Dañado Registrado';
      tipo_alerta = 'warning';
    } else if (tipo_evento === 'traslado') {
      titulo_alerta = 'Traslado de Equipo';
    }
    
    await notificacionController.crearNotificacionSistema(titulo_alerta, mensaje_alerta, tipo_alerta, null); // null = para todos

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el evento' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Movimiento.findByPk(id);
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado' });
    
    await evento.destroy();
    res.json({ message: 'Evento eliminado del historial' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar evento' });
  }
};
