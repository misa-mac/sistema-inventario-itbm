import { useState } from 'react';
import api from '../services/api';
import QRScanner from '../components/QRScanner';

const ScannerPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newAmbiente, setNewAmbiente] = useState('');

  const handleScan = async (decodedText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/inventory/${decodedText}`);
      setData(response.data);
      setNewAmbiente(response.data.ambiente_id || '');
    } catch (err) {
      setError('Activo no encontrado.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async () => {
    try {
      await api.patch(`/inventory/${data.activo_uuid}/status`, {
        ambiente_id: newAmbiente,
        observaciones: 'Traslado vía escáner'
      });
      alert('Movimiento registrado');
      setData(null);
    } catch (err) {
      alert('Error al registrar movimiento');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-6">Escáner de Activos</h1>
      
      {!data ? (
        <QRScanner onScanSuccess={handleScan} />
      ) : (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Ficha Técnica</h2>
          <div className="space-y-2 mb-6">
            <p><strong>UUID:</strong> {data.activo_uuid}</p>
            <p><strong>Nombre:</strong> {data.nombre}</p>
            <p><strong>Tipo:</strong> {data.tipo}</p>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-200">
            <label className="block">
              <span className="text-sm font-medium">Nuevo Ambiente:</span>
              <input 
                type="text" 
                value={newAmbiente} 
                onChange={(e) => setNewAmbiente(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <button 
              onClick={handleMove}
              className="w-full bg-[#003366] text-white py-2 rounded font-semibold"
            >
              Registrar Movimiento
            </button>
            <button 
              onClick={() => setData(null)}
              className="w-full py-2 rounded text-gray-600 underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {error && <div className="mt-4 text-accent text-center">{error}</div>}
    </div>
  );
};

export default ScannerPage;
