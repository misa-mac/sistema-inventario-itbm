import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Building, X } from 'lucide-react';

const AmbienteFormModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          codigo: editData.codigo,
          nombre: editData.nombre,
          descripcion: editData.descripcion || ''
        });
      } else {
        setFormData({ codigo: '', nombre: '', descripcion: '' });
      }
      setError(null);
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (editData) {
        await api.put(`/ambientes/${editData.id}`, formData);
      } else {
        await api.post('/ambientes', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el ambiente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-surface-container-highest">
          <h2 className="text-xl font-medium text-on-surface flex items-center gap-2">
            <Building size={20} className="text-primary" />
            {editData ? 'Editar Ambiente' : 'Nuevo Ambiente'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-error-container text-on-error-container p-3 rounded text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Código (CC) *</label>
            <input 
              type="number" 
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              required
              min="20"
              max="99"
              placeholder="Ej: 20"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <p className="text-xs text-on-surface-variant mt-1">Debe ser un número entre 20 y 99 según la estructura de codificación.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Nombre *</label>
            <input 
              type="text" 
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              placeholder="Ej: Laboratorio 1"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Descripción</label>
            <textarea 
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-outline rounded text-sm font-medium">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary/90">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AmbientesPage = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchAmbientes();
  }, []);

  const fetchAmbientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/ambientes');
      setAmbientes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este ambiente? Si contiene activos, no podrá ser eliminado.')) {
      try {
        await api.delete(`/ambientes/${id}`);
        fetchAmbientes();
      } catch (err) {
        alert(err.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-h2 font-h2 text-on-surface tracking-tight mb-1">Gestión de Ambientes</h1>
          <p className="text-on-surface-variant text-body-sm">Administración de laboratorios, talleres y oficinas.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded shadow-sm text-sm font-medium hover:bg-primary/90">
          <Plus size={16} />
          Añadir Ambiente
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-bright border-b border-surface-container-highest text-sm text-on-surface-variant">
                  <th className="p-4 font-medium">Código (CC)</th>
                  <th className="p-4 font-medium">Nombre</th>
                  <th className="p-4 font-medium">Descripción</th>
                  <th className="p-4 font-medium w-24 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {ambientes.map(amb => (
                  <tr key={amb.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-mono font-medium text-primary">{amb.codigo}</td>
                    <td className="p-4 font-medium text-on-surface">{amb.nombre}</td>
                    <td className="p-4 text-on-surface-variant text-sm">{amb.descripcion || '-'}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => handleEdit(amb)} className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(amb.id)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {ambientes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">No hay ambientes registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AmbienteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAmbientes}
        editData={editItem}
      />
    </div>
  );
};

export default AmbientesPage;
