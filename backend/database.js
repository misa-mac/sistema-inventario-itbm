const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configurar los parámetros de conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Probar que la conexión funcione
pool.connect()
    .then(() => console.log('Conexión a la base de datos PostgreSQL exitosa'))
    .catch(err => console.error('Error al conectar a la base de datos', err.stack));

module.exports = pool;