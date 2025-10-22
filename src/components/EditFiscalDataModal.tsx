import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { mockCompanies } from '../data/mockCompanies';
import { mockVehicles } from '../data/mockData';

interface EditFiscalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: ApprovalVehicle | null;
  onSave: (vehicleId: string, updates: { empresaProprietaria: string; ufEmplacamento: string; }) => void;
}

const EditFiscalDataModal: React.FC<EditFiscalDataModalProps> = ({ isOpen, onClose, vehicle, onSave }) => {
  const [empresaProprietaria, setEmpresaProprietaria] = useState('');
  const [ufEmplacamento, setUfEmplacamento] = useState('');

  const uniqueUFs = useMemo(() => [...new Set(mockVehicles.map(v => v.ufEmplacamento))], []);

  useEffect(() => {
    if (vehicle) {
      setEmpresaProprietaria(vehicle.empresaProprietaria || '');
      setUfEmplacamento(vehicle.ufEmplacamento || '');
    }
  }, [vehicle]);

  const handleSave = () => {
    if (vehicle) {
      onSave(vehicle.id, { empresaProprietaria, ufEmplacamento });
      onClose();
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Editar Dados Fiscais - {vehicle.placa}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="empresaProprietaria" className="block text-sm font-medium text-gray-700 mb-2">Empresa Proprietária</label>
            <select
              id="empresaProprietaria"
              value={empresaProprietaria}
              onChange={(e) => setEmpresaProprietaria(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Selecione uma empresa</option>
              {mockCompanies.map(company => (
                <option key={company.cnpj} value={company.nome}>{company.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ufEmplacamento" className="block text-sm font-medium text-gray-700 mb-2">UF Emplacamento</label>
            <select
              id="ufEmplacamento"
              value={ufEmplacamento}
              onChange={(e) => setUfEmplacamento(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Selecione uma UF</option>
              {uniqueUFs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default EditFiscalDataModal;