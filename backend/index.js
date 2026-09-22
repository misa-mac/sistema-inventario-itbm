const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./database');

// Importar Modelos para registrarlos antes del sync
require('./src/models/Usuario');
require('./src/models/Ambiente');
require('./src/models/Activo');
require('./src/models/Movimiento');

// Importar Rutas
const authRoutes = require('./src/routes/authRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

// Configuración Servidor
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API v2 Sistema de Inventario Funcionando 🚀');
});

const startServer = async () => {
  await connectDB();
  
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos de BD sincronizados exitosamente.');
  } catch (err) {
    console.error('❌ Error sincronizando modelos:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  });
};

startServer();
