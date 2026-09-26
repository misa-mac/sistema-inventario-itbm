const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const Ambiente = require('./Ambiente');
const TipoActivo = require('./TipoActivo');

const Activo = sequelize.define('Activo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  codigo_activo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  numero_correlativo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_activo_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: TipoActivo,
      key: 'id'
    }
  },
  ambiente_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Ambiente,
      key: 'id'
    }
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  especificacion_origen: {
    type: DataTypes.STRING,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  responsable: {
    type: DataTypes.STRING,
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Dañado'),
    defaultValue: 'Activo',
  },
}, {
  tableName: 'activos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Activo.belongsTo(Ambiente, { foreignKey: 'ambiente_id', as: 'ambiente' });
Ambiente.hasMany(Activo, { foreignKey: 'ambiente_id', as: 'activos' });

Activo.belongsTo(TipoActivo, { foreignKey: 'tipo_activo_id', as: 'tipo' });
TipoActivo.hasMany(Activo, { foreignKey: 'tipo_activo_id', as: 'activos' });

module.exports = Activo;
