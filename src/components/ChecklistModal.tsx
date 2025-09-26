import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

type PendenciaType = 'Recall' | 'RENAVAN' | 'Multa';
const PENDENCIA_OPTIONS: PendenciaType[] = ['Recall', 'RENAVAN', 'Multa'];

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  onSubmit: (data: {
    action: 'approve' | 'flag';
    pendingTypes: PendenciaType[];
    observations: string;
  }) => void;
}

const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, vehicles, onSubmit }) => {
  const [pendingTypes, setPendingTypes] = useState<PendenciaType[]>([]);
  const [observations, setObservations] = useState('');

  const handleTogglePendencia = (type: PendenciaType) => {
    setPendingTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleAction = (action: 'approve' | 'flag') => {
    onSubmit({
      action,
      pendingTypes,
      observations,
    });
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Checklist Análise Documental</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Tabela de Veículos */}
          <div className="mb-6">
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Pendência</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.modelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.anoModelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.tipoPendencia?.join(', ') || 'Nenhum'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campos de Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pendência</label>
              <div className="border rounded-md p-2 space-y-2">
                {PENDENCIA_OPTIONS.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={pendingTypes.includes(type)}
                      onChange={() => handleTogglePendencia(type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t mt-auto">
          <button onClick={() => handleAction('approve')} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Aprovar
          </button>
          <button 
            onClick={() => handleAction('flag')} 
            disabled={pendingTypes.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Sinalizar Pendência
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;