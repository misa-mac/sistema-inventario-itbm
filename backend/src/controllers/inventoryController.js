const pool = require('../../database');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM activos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM activos WHERE activo_uuid = $1', [req.params.uuid]);
    rows.length ? res.json(rows[0]) : res.status(404).json({ message: 'Activo no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const { nombre, tipo, ambiente_id } = req.body;
  try {
    const query = `
      INSERT INTO activos (nombre, tipo, ambiente_id) 
      VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await pool.query(query, [nombre, tipo, ambiente_id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar activo' });
  }
};

exports.updateStatus = async (req, res) => {
  const { uuid } = req.params;
  const { ambiente_id, accion, observaciones } = req.body;
  const usuario_id = req.user.uuid; // ID extraído del token JWT
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Actualizar activo
    const updateQuery = 'UPDATE activos SET ambiente_id = $1 WHERE activo_uuid = $2';
    await client.query(updateQuery, [ambiente_id, uuid]);
    
    // 2. Registrar trazabilidad
    const traceQuery = `
      INSERT INTO trazabilidad (activo_uuid, usuario_id, ambiente_id, accion, observaciones)
      VALUES ($1, $2, $3, $4, $5)`;
    await client.query(traceQuery, [uuid, usuario_id, ambiente_id, accion || 'TRASLADO', observaciones]);
    
    await client.query('COMMIT');
    res.json({ message: 'Traslado registrado correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Error en la transacción de traslado' });
  } finally {
    client.release();
  }
};
