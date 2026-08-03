const express = require('express');
const dotenv = require('dotenv');
const pool = require('./database');

// Configurar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Middleware para procesar datos en formato JSON
app.use(express.json());

// Puerto de ejecución
const PORT = process.env.PORT || 3000;

// Ruta de prueba básica
app.get('/', (req, res) => {
    res.send('¡Servidor del Sistema de Inventario ITBM funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});