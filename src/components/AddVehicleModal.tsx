import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Vehicle } from '../types/Vehicle';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: Partial<Vehicle>) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onAddVehicle }) => {
  const [chassi, setChassi] = useState('');
  const [placa, setPlaca] = useState('');
  const [errors, setErrors] = useState<{ chassi?: string; placa?: string }>({});

  const validate = () => {
    const newErrors: { chassi?: string; placa?: string } = {};
    if (!chassi.trim()) {
      newErrors.chassi = 'Chassi é obrigatório';
    }
    if (!placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddVehicle({
        id: `manual-${Date.now()}`, 
        chassi,
        placa,
        // Default values for other fields
        modelo: 'Não Listado',
        anoModelo: '-',
        km: 0,
        diretoria: '-',
        cr: '-',
        descricaoCR: '-',
        tipoDesmobilizacao: 'Não Aplicável' as any,
        patioDestino: '-',
        uf: '-',
        municipio: '-',
        localDesmobilizacao: '-',
        dataPrevista: '-',
        dataEntrega: '-',
        gerente: '-',
        cliente: '-',
        residual: 0,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Veículo Não Listado</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chassi <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={chassi}
                onChange={(e) => setChassi(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.chassi ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Digite o chassi do veículo"
              />
              {errors.chassi && <p className="mt-1 text-sm text-red-600">{errors.chassi}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placa <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.placa ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Digite a placa do veículo"
              />
              {errors.placa && <p className="mt-1 text-sm text-red-600">{errors.placa}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;