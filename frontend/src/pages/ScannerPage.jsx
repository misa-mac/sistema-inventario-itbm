import { useState } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

const ScannerPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (decodedText) => {
    setLoading(true);
    setError(null);
    try {
      // Petición real al backend usando el UUID del QR
      const response = await axios.get(`http://localhost:3000/api/inventory/${decodedText}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Activo no encontrado en la base de datos.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Escáner de Activos</h1>
      
      {!data && !loading ? (
        <QRScanner onScanSuccess={handleScan} />
      ) : loading ? (
        <div className="p-8 text-center text-blue-600 font-bold">Buscando activo...</div>
      ) : (
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Ficha Técnica</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>UUID:</strong> <span className="font-mono text-xs">{data.activo_uuid}</span></p>
            <p><strong>Nombre:</strong> {data.nombre}</p>
            <p><strong>Tipo:</strong> {data.tipo}</p>
            <p><strong>Estado:</strong> <span className="capitalize font-semibold">{data.estado}</span></p>
            <p><strong>Ambiente ID:</strong> {data.ambiente_id}</p>
          </div>
          <button 
            className="mt-6 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            onClick={() => setData(null)}
          >
            Escanear nuevo
          </button>
        </div>
      )}
      
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">{error}</div>}
    </div>
  );
};

export default ScannerPage;
