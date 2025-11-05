import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { Pendency } from '../types/Pendency';

interface DocumentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  pendencies: Pendency[];
  onApprove: (observation: string) => void;
  onSignalPendency: (pendenciesSelection: string[], observation: string) => void;
}

const DocumentAnalysisModal: React.FC<DocumentAnalysisModalProps> = ({ isOpen, onClose, vehicles, pendencies, onApprove, onSignalPendency }) => {
  const [observation, setObservation] = useState('');
  const [selectedPendencies, setSelectedPendencies] = useState<string[]>([]);
  const [showPendencyList, setShowPendencyList] = useState(false);

  const documentalPendencies = useMemo(() => 
    pendencies.filter(p => p.tipo === 'Documental'), 
  [pendencies]);

  const availablePendencies = useMemo(() => 
    documentalPendencies.filter(p => !selectedPendencies.includes(p.descricao)),
  [documentalPendencies, selectedPendencies]);

  const handleAddPendency = (descricao: string) => {
    setSelectedPendencies(prev => [...prev, descricao]);
    setShowPendencyList(false);
  };

  const handleRemovePendency = (descricao: string) => {
    setSelectedPendencies(prev => prev.filter(p => p !== descricao));
  };

  const handleClose = () => {
    setObservation('');
    setSelectedPendencies([]);
    setShowPendencyList(false);
    onClose();
  };

  const handleApprove = () => {
    onApprove(observation);
    handleClose();
  };

  const handleSignalPendency = () => {
    onSignalPendency(selectedPendencies, observation);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Checklist Análise Documental</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados ({vehicles.length})</h3>
            {/* Adicionado 'overflow-x-auto' ao div abaixo */}
            <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diretoria</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CR</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição do CR</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Desmobilização</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UF Emplacamento</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pátio Atual</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.modelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.anoModelo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.diretoria}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.cr}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.descricaoCR}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.tipoDesmobilizacao}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.cliente}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.ufEmplacamento || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.patioVistoria || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pendência
              </label>
              <div className="relative">
                <div 
                  className="w-full border border-gray-300 rounded-md p-2 min-h-[42px] flex flex-wrap items-center gap-2 cursor-pointer"
                  onClick={() => setShowPendencyList(prev => !prev)}
                >
                  {selectedPendencies.length === 0 && (
                    <span className="text-gray-400">Selecione uma ou mais pendências...</span>
                  )}
                  {selectedPendencies.map(pendencia => (
                    <span key={pendencia} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded-full">
                      {pendencia}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePendency(pendencia);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {showPendencyList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {availablePendencies.length > 0 ? (
                      availablePendencies.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleAddPendency(p.descricao)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm flex items-center justify-between"
                        >
                          {p.descricao}
                          {selectedPendencies.includes(p.descricao) && <Check size={16} className="text-blue-600" />}
                        </button>
                      ))
                    ) : (
                      <span className="block px-3 py-2 text-sm text-gray-500">Nenhuma outra pendência disponível.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="observacoes"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adicione observações (opcional)..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={handleClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          
          <button 
            onClick={handleSignalPendency} 
            disabled={selectedPendencies.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Sinalizar Pendência
          </button>
          <button 
            onClick={handleApprove} 
            disabled={selectedPendencies.length > 0}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysisModal;