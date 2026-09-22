const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const Ambiente = require('./Ambiente');

const Activo = sequelize.define('Activo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.STRING,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
  },
  modelo: {
    type: DataTypes.STRING,
  },
  numero_serie: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'en_reparacion', 'baja', 'extraviado'),
    defaultValue: 'activo',
  },
  ambiente_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Ambiente,
      key: 'id'
    }
  },
  qr_codigo: {
    type: DataTypes.STRING,
    unique: true,
  },
  imagen_url: {
    type: DataTypes.STRING,
  },
  observaciones: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'activos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Activo.belongsTo(Ambiente, { foreignKey: 'ambiente_id', as: 'ambiente' });
Ambiente.hasMany(Activo, { foreignKey: 'ambiente_id', as: 'activos' });

module.exports = Activo;
