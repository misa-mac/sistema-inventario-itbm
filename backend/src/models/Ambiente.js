const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database');

const Ambiente = sequelize.define('Ambiente', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  tiene_internet: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
  },
  radio_geofence: {
    type: DataTypes.DECIMAL,
    defaultValue: 50,
  }
}, {
  tableName: 'ambientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Ambiente;
