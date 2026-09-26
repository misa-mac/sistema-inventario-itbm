const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database');

const TipoActivo = sequelize.define('TipoActivo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  codigo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'tipos_activos',
  timestamps: false
});

module.exports = TipoActivo;
