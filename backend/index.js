const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Configurar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);

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
