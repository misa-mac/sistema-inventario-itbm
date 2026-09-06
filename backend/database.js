const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configurar los parámetros de conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Probar que la conexión funcione
pool.connect()
    .then(() => console.log('Conexión a la base de datos PostgreSQL exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos', err.stack));

module.exports = pool;