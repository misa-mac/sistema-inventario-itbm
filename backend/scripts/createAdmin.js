const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 1. Modificamos la función para recibir el parámetro 'nombre'
async function createAdminUser(nombre, email, password) {
  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 2. Agregamos 'nombre' a la consulta SQL y su variable $1
    const query = `
      INSERT INTO usuarios (email, password_hash, rol)
      VALUES ($1, $2, 'admin')
      RETURNING uuid, email, rol;
    `;
    
    // 3. Pasamos el arreglo de variables completo
    const result = await pool.query(query, [nombre, email, password_hash]);
    console.log('✅ Usuario administrador creado con éxito:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error al crear el administrador:', error);
  } finally {
    await pool.end();
  }
}

// 4. Ejecutamos la función enviando el Nombre, el Correo y la Contraseña
createAdminUser('Admin ITBM', 'admin@itbm.com', 'Admin123!');