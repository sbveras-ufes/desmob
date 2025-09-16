import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface ReprovationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicles: ApprovalVehicle[];
  onSubmit: (justificativa: string) => void;
}

const ReprovationModal: React.FC<ReprovationModalProps> = ({
  isOpen,
  onClose,
  selectedVehicles,
  onSubmit
}) => {
  const [justificativa, setJustificativa] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!justificativa.trim()) {
      setError('Justificativa é obrigatória para reprovação');
      return;
    }

    if (justificativa.trim().length < 10) {
      setError('Justificativa deve ter pelo menos 10 caracteres');
      return;
    }

    onSubmit(justificativa.trim());
    setJustificativa('');
    setError('');
  };

  const handleClose = () => {
    setJustificativa('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Reprovar Desmobilização - {selectedVehicles.length} veículo(s)
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Selected Vehicles Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Veículos a serem reprovados:</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{vehicle.placa}</span>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-600">{vehicle.modelo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Justification Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Justificativa da Reprovação <span className="text-red-500">*</span>
            </label>
            <textarea
              value={justificativa}
              onChange={(e) => {
                setJustificativa(e.target.value);
                if (error) setError('');
              }}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite a justificativa detalhada para a reprovação da desmobilização..."
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Mínimo de 10 caracteres. Esta justificativa será registrada no sistema.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reprovar Desmobilização
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReprovationModal;