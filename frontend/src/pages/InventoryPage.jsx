import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Filter, Monitor, RefreshCw, Printer, Image as ImageIcon } from 'lucide-react';
import HardwareFormModal from '../components/HardwareFormModal';
import QRPrintModal from '../components/QRPrintModal';
import AssetDetailsModal from '../components/AssetDetailsModal';

const InventoryPage = () => {
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // QR Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [assetsToPrint, setAssetsToPrint] = useState([]);

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
      case 'dañado':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'baja': 
      case 'inactivo':
        return 'bg-error-container text-on-error-container border-error/20';
      default: 
        return 'bg-surface-container-highest text-on-surface-variant border-outline-variant';
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este equipo?')) {
      try {
        await api.delete(`/inventory/${id}`);
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        fetchInventory();
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el equipo.');
      }
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  // Select logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(hardware.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, id) => {
    e.stopPropagation(); // Evitar abrir el modal al hacer clic en el checkbox
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // QR Logic
  const handlePrintBatch = () => {
    if (selectedIds.length === 0) return;
    const items = hardware.filter(h => selectedIds.includes(h.id));
    setAssetsToPrint(items);
    setIsQRModalOpen(true);
  };

  const handlePrintSingle = (item) => {
    setAssetsToPrint([item]);
    setIsQRModalOpen(true);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <div className="space-y-6 animate-fade-in no-print">
      
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-h2 font-h2 text-on-surface tracking-tight mb-1">Activos Fijos</h1>
          <p className="text-on-surface-variant text-body-sm">Catálogo visual del inventario tecnológico ITBM.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchInventory} className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded shadow-sm text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin text-outline' : 'text-outline'} />
            Sincronizar
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded shadow-sm text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            Añadir Activo
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-container-highest flex justify-between items-center bg-surface-bright flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Buscar por código o tipo..." 
                className="pl-9 pr-4 py-1.5 bg-surface border border-outline-variant rounded text-sm focus:border-secondary focus:ring-1 focus:ring-secondary w-64"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-on-surface">
              <input 
                type="checkbox" 
                className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                checked={hardware.length > 0 && selectedIds.length === hardware.length}
                onChange={handleSelectAll}
              />
              Seleccionar Todos
            </label>

            {selectedIds.length > 0 && (
              <button 
                onClick={handlePrintBatch}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary-container text-on-secondary-container border border-secondary-container hover:bg-secondary/20 rounded text-sm font-medium transition-colors animate-fade-in"
              >
                <Printer size={16} />
                Imprimir {selectedIds.length} QR(s)
              </button>
            )}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Grid View */}
        <div className="p-6 flex-1 bg-surface-container/20">
          {loading ? (
            <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
              Cargando inventario...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-error text-sm font-medium">
              {error}
            </div>
          ) : hardware.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant text-sm py-12">
              <Monitor size={48} className="mb-4 opacity-50" />
              <p>No hay activos registrados en la base de datos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hardware.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const imageUrl = item.imagen ? `${API_URL}${item.imagen}` : null;
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleCardClick(item)}
                    className={`bg-surface-container-lowest rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 group relative ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-surface-container-highest'}`}
                  >
                    {/* Checkbox Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-outline-variant text-primary focus:ring-primary w-5 h-5 cursor-pointer bg-white shadow-sm"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(e, item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {/* Image Area */}
                    <div className="h-48 bg-surface-container flex items-center justify-center overflow-hidden relative">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.codigo_activo} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="text-on-surface-variant/50 flex flex-col items-center">
                          <ImageIcon size={32} className="mb-2" />
                        </div>
                      )}
                      
                      {/* Status Badge overlay */}
                      <div className="absolute bottom-3 right-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${getStatusClasses(item.estado)}`}>
                          {item.estado}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-4 border-t border-surface-container-highest">
                      <div className="text-primary font-technical-data font-bold tracking-tight mb-1">{item.codigo_activo}</div>
                      <div className="font-medium text-on-surface text-sm truncate">{item.tipo?.nombre || 'Desconocido'}</div>
                      <div className="text-xs text-on-surface-variant mt-1 truncate">{item.ambiente?.nombre || 'N/A'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-surface-container-highest bg-surface-bright flex justify-between items-center text-xs text-on-surface-variant">
          <div>Mostrando {hardware.length} activos en total</div>
        </div>

      </div>
      
      {/* Modals */}
      <HardwareFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={fetchInventory}
        editData={selectedItem}
      />

      <AssetDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        asset={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPrintQR={handlePrintSingle}
      />

      <QRPrintModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        assetsToPrint={assetsToPrint}
      />
    </div>
  );
};

export default InventoryPage;
