import React from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  onConfirm: () => void;
}

const CreateLotModal: React.FC<CreateLotModalProps> = ({ isOpen, onClose, vehicles, onConfirm }) => {
  if (!isOpen) return null;

  // Função getSituacaoColor removida pois não é mais utilizada

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Liberar para Criar Lote</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4">
              Tem certeza que deseja liberar {vehicles.length} veículo(s) para a criação de lote? A situação será alterada para "Liberado para Transferência".
            </p>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Registros Selecionados</h3>
            <div className="overflow-x-auto border rounded-lg max-h-60">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    {/* Coluna Situação Atual removida */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.modelo}</td>
                      {/* Coluna Situação Atual removida */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-green-600 text-white rounded-md">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateLotModal;