import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { mockVehicles } from '../data/mockData';

interface UpdateTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  onUpdate: (updatedData: { dataEntrega: string; patioDestino: string; patioVistoria: string }) => void;
}

const UpdateTransportModal: React.FC<UpdateTransportModalProps> = ({ isOpen, onClose, vehicles, onUpdate }) => {
  const [dataEntrega, setDataEntrega] = useState('');
  const [patioDestino, setPatioDestino] = useState('');
  const [patioVistoria, setPatioVistoria] = useState('');

  const uniquePatios = useMemo(() => {
    return [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
  }, []);

  const handleSubmit = () => {
    onUpdate({ dataEntrega, patioDestino, patioVistoria });
    onClose();
  };
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Atualizar Transporte</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Tabela de Veículos Selecionados */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Registros Selecionados</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diretoria</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CR</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição CR</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Prevista</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Entrega</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pátio Origem</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.modelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.anoModelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.diretoria}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.cr}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.descricaoCR}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(v.dataPrevista)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(v.dataEntrega)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.patioDestino}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campos de Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrega</label>
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pátio de Destino</label>
              <select
                value={patioDestino}
                onChange={(e) => setPatioDestino(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um pátio</option>
                {uniquePatios.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pátio Vistoria</label>
              <select
                value={patioVistoria}
                onChange={(e) => setPatioVistoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um pátio</option>
                {uniquePatios.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTransportModal;