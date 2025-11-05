import React, { useState } from 'react';
import { X, Download, Upload } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface UpdateTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  onUpdate: (updatedData: { dataEntrega: string; patioDestino: string; }) => void;
}

const UpdateTransportModal: React.FC<UpdateTransportModalProps> = ({ isOpen, onClose, vehicles, onUpdate }) => {
  const [dataEntrega, setDataEntrega] = useState('');
  const [patioDestino, setPatioDestino] = useState('');

  const handleSubmit = () => {
    onUpdate({ dataEntrega, patioDestino });
    setDataEntrega('');
    setPatioDestino('');
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      // Adiciona 'T00:00:00' para garantir que a data seja interpretada como local
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return '-';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal alargada para max-w-7xl */}
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Atualizar Transporte</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados ({vehicles.length})</h3>
            {/* Adicionado overflow-x-auto para a tabela */}
            <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  {/* Colunas da Thead atualizadas */}
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diretoria</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Número CR</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição do CR</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Prevista</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data de Entrega</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pátio de Origem</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Colunas do Tbody atualizadas */}
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.modelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.anoModelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.diretoria}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.cr}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.descricaoCR}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(v.dataPrevista)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(v.dataEntrega)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.patioOrigem || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="data-entrega" className="block text-sm font-medium text-gray-700 mb-2">
                Data Prevista Entrega
              </label>
              <input
                type="date"
                id="data-entrega"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="patio-destino" className="block text-sm font-medium text-gray-700 mb-2">
                Pátio Destino
              </label>
              <input
                type="text"
                id="patio-destino"
                value={patioDestino}
                onChange={(e) => setPatioDestino(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Pátio SP"
              />
            </div>
          </div>

          {/* Botões Importar/Exportar Movidos para cá */}
          <div className="flex items-center justify-end space-x-2 mt-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              <Upload size={16} />
              <span>Importar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
          {/* Fim dos botões */}
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          <button 
            onClick={handleSubmit} 
            disabled={!dataEntrega && !patioDestino}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTransportModal;