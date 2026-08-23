import { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryPage = () => {
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Petición real al backend
    axios.get('http://localhost:3000/api/inventory') // Ajusta según tu ruta real definida en index.js
      .then(res => {
        setHardware(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
        setError('No se pudo cargar el inventario desde la base de datos.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando inventario...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventario de Hardware</h1>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">UUID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {hardware.map((item) => (
              <tr key={item.activo_uuid} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{item.activo_uuid}</td>
                <td className="p-4">{item.nombre}</td>
                <td className="p-4">{item.tipo}</td>
                <td className="p-4">{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
