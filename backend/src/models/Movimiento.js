const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const Activo = require('./Activo');
const Ambiente = require('./Ambiente');
const Usuario = require('./Usuario');

const Movimiento = sequelize.define('Movimiento', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  activo_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Activo, key: 'id' }
  },
  ambiente_origen_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Ambiente, key: 'id' }
  },
  ambiente_destino_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Ambiente, key: 'id' }
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Usuario, key: 'id' }
  },
  observaciones: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'movimientos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Movimiento.belongsTo(Activo, { foreignKey: 'activo_id' });
Movimiento.belongsTo(Ambiente, { as: 'origen', foreignKey: 'ambiente_origen_id' });
Movimiento.belongsTo(Ambiente, { as: 'destino', foreignKey: 'ambiente_destino_id' });
Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Movimiento;
