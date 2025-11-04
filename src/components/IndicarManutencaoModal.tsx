import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { Pendency } from '../types/Pendency';

interface IndicarManutencaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  pendencies: Pendency[];
  onConfirm: (tiposPendencia: string[], observacao: string) => void;
  onConcluirManutencao: () => void;
}

const IndicarManutencaoModal: React.FC<IndicarManutencaoModalProps> = ({ 
  isOpen, 
  onClose, 
  vehicles, 
  pendencies, 
  onConfirm, 
  onConcluirManutencao 
}) => {
  const [selectedPendencies, setSelectedPendencies] = useState<string[]>([]);
  const [dataPendencia, setDataPendencia] = useState('');
  const [observacao, setObservacao] = useState(''); // Novo estado
  const [showPendencyList, setShowPendencyList] = useState(false);

  const canConcluir = useMemo(() => vehicles.length > 0 && vehicles.every(v => v.situacao === 'Em Manutenção'), [vehicles]);
  const canIndicar = useMemo(() => vehicles.length > 0 && vehicles.every(v => v.situacao !== 'Em Manutenção'), [vehicles]);

  const otherPendencies = useMemo(() => // Renomeado
    pendencies.filter(p => p.tipo === 'Outras Pendências'), // Filtro atualizado
  [pendencies]);

  const availablePendencies = useMemo(() => 
    otherPendencies.filter(p => !selectedPendencies.includes(p.descricao)),
  [otherPendencies, selectedPendencies]);

  const handleAddPendency = (descricao: string) => {
    setSelectedPendencies(prev => [...prev, descricao]);
    setShowPendencyList(false);
  };

  const handleRemovePendency = (descricao: string) => {
    setSelectedPendencies(prev => prev.filter(p => p !== descricao));
  };
  
  const handleConfirm = () => {
    onConfirm(selectedPendencies, observacao); // Passando observação
    resetAndClose();
  };

  const handleConcluir = () => {
    onConcluirManutencao();
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedPendencies([]);
    setDataPendencia('');
    setObservacao(''); // Limpar observação
    setShowPendencyList(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Tratativa de Pendências</h2>
          <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {canIndicar && (
            <>
              <div>
                <label htmlFor="data-pendencia" className="block text-sm font-medium text-gray-700 mb-2">
                  Data Outras Pendências
                </label>
                <input
                  type="date"
                  id="data-pendencia"
                  value={dataPendencia}
                  onChange={(e) => setDataPendencia(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo da Pendência
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

              {/* Novo campo Observações */}
              <div>
                <label htmlFor="observacoes-pendencia" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  id="observacoes-pendencia"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adicione observações (opcional)..."
                />
              </div>
            </>
          )}

          {canConcluir && (
            <p className="text-sm text-gray-700">
              Veículos selecionados estão "Em Manutenção". Deseja concluir a manutenção e liberar os veículos?
            </p>
          )}

          {!canIndicar && !canConcluir && (
            <p className="text-sm text-red-600">
              A seleção de veículos é inválida. Selecione apenas veículos com status "Liberado" (ou similar) para indicar pendência, ou apenas veículos com status "Em Manutenção" para concluir.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={resetAndClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          
          {canIndicar && (
            <button 
              onClick={handleConfirm} 
              disabled={selectedPendencies.length === 0}
              className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
            >
              Confirmar
            </button>
          )}
          
          {canConcluir && (
            <button onClick={handleConcluir} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Concluir Manutenção
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndicarManutencaoModal;