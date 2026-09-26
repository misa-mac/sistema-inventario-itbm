import React from 'react';
import { X, QrCode, Edit2, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AssetDetailsModal = ({ isOpen, onClose, asset, onEdit, onDelete, onPrintQR }) => {
  if (!isOpen || !asset) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const imageUrl = asset.imagen ? `${API_URL}${asset.imagen}` : null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-surface-container-highest">
          <h2 className="text-xl font-medium text-on-surface">Detalles del Activo</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-surface-container/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Foto Col */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-full aspect-square bg-surface-container-high rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/30 mb-6 shadow-sm">
                {imageUrl ? (
                  <img src={imageUrl} alt={asset.codigo_activo} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-on-surface-variant/50 text-center flex flex-col items-center gap-2">
                    <QrCode size={48} />
                    <span className="text-sm font-medium">Sin fotografía</span>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20 inline-block">
                <QRCodeSVG value={asset.codigo_activo} size={150} level="M" />
                <p className="text-center font-mono font-bold mt-2 text-black text-sm">{asset.codigo_activo}</p>
              </div>
            </div>

            {/* Info Col */}
            <div className="md:col-span-2 space-y-6">
              
              <div>
                <h3 className="text-3xl font-bold text-primary font-technical-data tracking-tight mb-1">{asset.codigo_activo}</h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-sm font-medium">
                    {asset.tipo?.nombre}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    asset.estado === 'Activo' ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20' : 
                    asset.estado === 'Dañado' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                    'bg-error-container text-on-error-container border-error/20'
                  }`}>
                    {asset.estado}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-1">Ambiente Asignado</p>
                  <p className="text-on-surface font-medium text-base">{asset.ambiente?.nombre}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-1">Responsable</p>
                  <p className="text-on-surface font-medium text-base">{asset.responsable || 'No asignado'}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-1">Origen</p>
                  <p className="text-on-surface">{asset.origen}</p>
                  {asset.especificacion_origen && <p className="text-on-surface-variant italic mt-0.5">{asset.especificacion_origen}</p>}
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-1">Fecha de Ingreso</p>
                  <p className="text-on-surface">{new Date(asset.fecha_ingreso).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-1">Valor Estimado</p>
                  <p className="text-on-surface font-mono">{asset.valor ? `Bs. ${asset.valor}` : 'N/A'}</p>
                </div>
              </div>

              {asset.descripcion && (
                <div>
                  <p className="text-on-surface-variant font-medium text-xs uppercase tracking-wider mb-2">Descripción / Características</p>
                  <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant text-on-surface">
                    {asset.descripcion}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-container-highest flex justify-between gap-3 bg-surface-bright rounded-b-xl">
          <div className="flex gap-2">
            <button 
              onClick={() => { onClose(); onPrintQR(asset); }}
              className="px-4 py-2 bg-secondary-container text-on-secondary-container border border-secondary-container/50 rounded shadow-sm text-sm font-medium hover:bg-secondary/20 transition-colors flex items-center gap-2"
            >
              <QrCode size={16} /> Imprimir Etiqueta
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { onClose(); onEdit(asset); }}
              className="px-4 py-2 border border-outline rounded text-sm font-medium text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              <Edit2 size={16} /> Editar
            </button>
            <button 
              onClick={() => { onClose(); onDelete(asset.id); }}
              className="px-4 py-2 bg-error text-on-error rounded shadow-sm text-sm font-medium hover:bg-error/90 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
