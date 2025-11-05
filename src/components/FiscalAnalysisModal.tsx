import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { Pendency } from '../types/Pendency';
import { mockCompanies } from '../data/mockCompanies';

// Tipo para as atualizações fiscais
interface FiscalUpdates {
  empresaProprietaria?: string;
  ufEmplacamento?: string;
}

interface FiscalAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  pendencies: Pendency[];
  onApprove: (observation: string, updates: FiscalUpdates) => void;
  onSignalPendency: (pendenciesSelection: string[], observation: string, updates: FiscalUpdates) => void;
}

// Lista de UFs (como em EditFiscalDataModal)
const UFs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const FiscalAnalysisModal: React.FC<FiscalAnalysisModalProps> = ({ isOpen, onClose, vehicles, pendencies, onApprove, onSignalPendency }) => {
  const [observation, setObservation] = useState('');
  const [selectedPendencies, setSelectedPendencies] = useState<string[]>([]);
  const [showPendencyList, setShowPendencyList] = useState(false);

  const [empresaProprietaria, setEmpresaProprietaria] = useState('');
  const [ufEmplacamento, setUfEmplacamento] = useState('');

  const fiscalPendencies = useMemo(() => 
    pendencies.filter(p => p.tipo === 'Fiscal'), 
  [pendencies]);

  const availablePendencies = useMemo(() => 
    fiscalPendencies.filter(p => !selectedPendencies.includes(p.descricao)),
  [fiscalPendencies, selectedPendencies]);

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
    setEmpresaProprietaria('');
    setUfEmplacamento('');
    onClose();
  };

  const handleApprove = () => {
    const updates = { empresaProprietaria, ufEmplacamento };
    onApprove(observation, updates);
    handleClose();
  };

  const handleSignalPendency = () => {
    const updates = { empresaProprietaria, ufEmplacamento };
    onSignalPendency(selectedPendencies, observation, updates);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Checklist Análise Fiscal</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados ({vehicles.length})</h3>
            <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{v.modelo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="empresa-proprietaria" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa Proprietária (Opcional)
              </label>
              <select
                id="empresa-proprietaria"
                value={empresaProprietaria}
                onChange={(e) => setEmpresaProprietaria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione (para todos)</option>
                {mockCompanies.map(company => (
                  <option key={company.cnpj} value={company.nome}>{company.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="uf-emplacamento" className="block text-sm font-medium text-gray-700 mb-2">
                UF de Emplacamento (Opcional)
              </label>
              <select
                id="uf-emplacamento"
                value={ufEmplacamento}
                onChange={(e) => setUfEmplacamento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione (para todos)</option>
                {UFs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 -mt-4 mb-6">
            Se preenchidos, os campos acima atualizarão todos os veículos selecionados na confirmação.
          </p>
          
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
                placeholder="Observações (obrigatório para pendência)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={handleClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          
          <button 
            onClick={handleSignalPendency} 
            disabled={selectedPendencies.length === 0 || observation.trim() === ''}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Sinalizar Pendência
          </button>
          {/* Botão "Aprovar" agora tem a condição 'disabled' */}
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

export default FiscalAnalysisModal;