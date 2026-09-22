import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Filter, MoreVertical, Monitor, RefreshCw } from 'lucide-react';

const InventoryPage = () => {
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    setLoading(true);
    api.get('/inventory')
      .then(res => {
        setHardware(res.data);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
        setError('No se pudo cargar el inventario.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatusClasses = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo': 
        return 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20';
      case 'en_reparacion': 
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'baja': 
        return 'bg-error-container text-on-error-container border-error/20';
      default: 
        return 'bg-surface-container-highest text-on-surface-variant border-outline-variant';
    }
  };

  const formatStatus = (estado) => {
    if (!estado) return 'Desconocido';
    return estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-h2 font-h2 text-on-surface tracking-tight mb-1">Workstation Hardware</h1>
          <p className="text-on-surface-variant text-body-sm">Manage lab equipment and verify inventory status.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchInventory} className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded shadow-sm text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin text-outline' : 'text-outline'} />
            Sync
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded shadow-sm text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Search by ID, serial..." 
                className="pl-9 pr-4 py-1.5 bg-surface border border-outline-variant rounded text-sm focus:border-secondary focus:ring-1 focus:ring-secondary w-64"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">
            Cargando inventario...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-error text-sm font-medium">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-highest bg-surface-container-low/50">
                  <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider">Identifier</th>
                  <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider">Specifications</th>
                  <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {hardware.length > 0 ? hardware.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-secondary-container/10 group-hover:text-secondary transition-colors">
                          <Monitor size={20} />
                        </div>
                        <div>
                          <div className="font-technical-data text-technical-data text-on-surface">{item.nombre}</div>
                          <div className="text-xs text-outline mt-0.5 font-mono">{item.uuid?.split('-')[0] || item.numero_serie || 'NO-SN'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-on-surface">{item.tipo}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{item.marca || 'N/A'} {item.modelo || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-on-surface">{item.ambiente?.nombre || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClasses(item.estado)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {formatStatus(item.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container-low rounded transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant text-sm">
                      No hay equipos registrados en la base de datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination/Footer */}
        <div className="px-6 py-3 border-t border-surface-container-highest bg-surface-bright flex justify-between items-center text-xs text-on-surface-variant">
          <div>Mostrando {hardware.length} resultados</div>
        </div>

      </div>
    </div>
  );
};

export default InventoryPage;
