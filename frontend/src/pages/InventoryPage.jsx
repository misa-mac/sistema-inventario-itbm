import { useState, useEffect } from 'react';
import api from '../services/api';

const InventoryPage = () => {
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/inventory')
      .then(res => {
        setHardware(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
        setError('No se pudo cargar el inventario.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-center p-8 text-accent">{error}</div>;

  return (
    <div className="inventory-container">
      <h1 className="text-xl font-bold mb-6">Inventario de Hardware</h1>
      
      {/* Vista de Tabla (Escritorio) */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>UUID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {hardware.map((item) => (
            <tr key={item.activo_uuid}>
              <td className="font-mono">{item.activo_uuid}</td>
              <td>{item.nombre}</td>
              <td>{item.tipo}</td>
              <td>{item.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Vista de Tarjetas (Móvil) */}
      <div className="inventory-cards">
        {hardware.map((item) => (
          <div key={item.activo_uuid} className="card">
            <div><strong>Nombre:</strong> {item.nombre}</div>
            <div><strong>Tipo:</strong> {item.tipo}</div>
            <div><strong>Estado:</strong> {item.estado}</div>
            <div className="font-mono text-sm mt-2">{item.activo_uuid}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;