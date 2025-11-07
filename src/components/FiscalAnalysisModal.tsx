import React, { useState, useMemo, useEffect } from 'react';
import { X, ChevronDown, Check, CheckCircle, Trash2, Lock, Download, Unlock } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { Pendency } from '../types/Pendency';
import { mockCompanies } from '../data/mockCompanies';
import { VehiclePendency } from '../types/VehiclePendency';
import { mockUsers } from '../data/mockUsers';

// Helper
const formatDateTime = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '-';
  }
};

// Componente da Nova Grid
const PendencyHistoryGrid: React.FC<{
  pendencies: VehiclePendency[];
  onResolve: (pendencyId: string) => void;
  onRemove: (pendencyId: string) => void;
  onReleaseLock: (pendencyId: string) => void;
}> = ({ pendencies, onResolve, onRemove, onReleaseLock }) => {
  return (
    <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Pendência</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data de Cadastro</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Resolver</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remover</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Liberar Bloqueio</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Baixar Anexo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pendencies.map(p => (
            <tr key={p.id}>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{p.descricao}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDateTime(p.dataCadastro)}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === 'Resolvido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <button 
                  onClick={() => onResolve(p.id)} 
                  disabled={p.status === 'Resolvido'}
                  className="text-green-600 hover:text-green-900 disabled:text-gray-300"
                >
                  <CheckCircle size={18} />
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <button 
                  onClick={() => onRemove(p.id)} 
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {p.isBlocking && p.status === 'Pendente' && (
                  <button 
                    onClick={() => onReleaseLock(p.id)} 
                    className="text-blue-600 hover:text-blue-900"
                    title="Liberar Bloqueio (Simulação)"
                  >
                    <Unlock size={18} />
                  </button>
                )}
                {p.isBlocking && p.status === 'Resolvido' && (
                  <span title="Bloqueio Resolvido"><Lock size={18} className="text-gray-400" /></span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                {p.anexoUrl && (
                  <button className="text-gray-500 hover:text-gray-900" title="Baixar Anexo (Simulação)">
                    <Download size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


interface FiscalUpdates {
  empresaProprietaria?: string;
  ufEmplacamento?: string;
}

interface FiscalAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicles: ApprovalVehicle[]; // Prop renomeada
  allVehicles: ApprovalVehicle[]; // Prop adicionada
  onUpdateVehicles: (vehicles: ApprovalVehicle[]) => void; // Prop adicionada
  pendencies: Pendency[];
  onApprove: (observation: string, updates: FiscalUpdates) => void;
  onSignalPendency: (pendenciesSelection: string[], observation: string, updates: FiscalUpdates) => void;
}

const UFs = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const FiscalAnalysisModal: React.FC<FiscalAnalysisModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedVehicles, 
  allVehicles, 
  onUpdateVehicles, 
  pendencies, 
  onApprove, 
  onSignalPendency 
}) => {
  const [observation, setObservation] = useState('');
  const [selectedPendencies, setSelectedPendencies] = useState<string[]>([]);
  const [showPendencyList, setShowPendencyList] = useState(false);

  const [empresaProprietaria, setEmpresaProprietaria] = useState('');
  const [ufEmplacamento, setUfEmplacamento] = useState('');
  
  const singleVehicle = useMemo(() => {
    return selectedVehicles.length === 1 ? allVehicles.find(v => v.id === selectedVehicles[0].id) : null;
  }, [selectedVehicles, allVehicles]);
  
  const [vehiclePendencies, setVehiclePendencies] = useState(singleVehicle?.pendenciasFiscais || []);

  useEffect(() => {
    if (singleVehicle) {
      setVehiclePendencies(singleVehicle.pendenciasFiscais || []);
    }
  }, [singleVehicle, isOpen]);


  const fiscalPendencies = useMemo(() => 
    pendencies.filter(p => p.tipo === 'Fiscal'), 
  [pendencies]);

  const availablePendencies = useMemo(() => 
    fiscalPendencies.filter(p => !selectedPendencies.includes(p.descricao)),
  [fiscalPendencies, selectedPendencies]);

  const hasUnresolvedPendencies = useMemo(() => {
    if (!singleVehicle) return selectedPendencies.length > 0;
    return vehiclePendencies.some(p => p.status === 'Pendente');
  }, [selectedPendencies, vehiclePendencies, singleVehicle]);


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

  const handleApproveClick = () => {
    const updates = { empresaProprietaria, ufEmplacamento };
    onApprove(observation, updates);
    handleClose();
  };

  const handleSignalPendencyClick = () => {
    const updates = { empresaProprietaria, ufEmplacamento };
    onSignalPendency(selectedPendencies, observation, updates);
    handleClose();
  };

  // --- Handlers da Nova Grid ---
  const updateVehiclePendencies = (vehicleId: string, newPendencies: VehiclePendency[]) => {
    const randomUserName = getRandomUser();
    const updatedAllVehicles = allVehicles.map(v => {
      if (v.id === vehicleId) {
        const hasBlocking = newPendencies.some(p => p.isBlocking && p.status === 'Pendente');
        const newStatus = hasBlocking 
          ? 'Análise Pendente com Bloqueio' 
          : newPendencies.length > 0 ? 'Pendente' : 'Aprovada'; // Auto-aprova se zerar pendências

        return {
          ...v,
          pendenciasFiscais: newPendencies,
          situacaoAnaliseFiscal: newStatus,
          lastUpdated: new Date().toISOString(),
          responsavelAtualizacao: randomUserName,
        };
      }
      return v;
    });
    onUpdateVehicles(updatedAllVehicles);
    setVehiclePendencies(newPendencies); // Atualiza estado local
  };

  const handleResolve = (pendencyId: string) => {
    if (!singleVehicle) return;
    const newPendencies = vehiclePendencies.map(p => 
      p.id === pendencyId ? { ...p, status: 'Resolvido' as const } : p
    );
    updateVehiclePendencies(singleVehicle.id, newPendencies);
  };

  const handleRemove = (pendencyId: string) => {
    if (!singleVehicle) return;
    const newPendencies = vehiclePendencies.filter(p => p.id !== pendencyId);
    updateVehiclePendencies(singleVehicle.id, newPendencies);
  };
  
  const handleReleaseLock = (pendencyId: string) => {
    if (!singleVehicle) return;
    alert("Simulação: Anexo PDF/Email anexado. Bloqueio liberado.");
    const newPendencies = vehiclePendencies.map(p => 
      p.id === pendencyId ? { ...p, status: 'Resolvido' as const, isBlocking: false, anexoUrl: 'simulado/anexo.pdf' } : p
    );
    updateVehiclePendencies(singleVehicle.id, newPendencies);
  };
  // --- Fim dos Handlers da Nova Grid ---


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
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados ({selectedVehicles.length})</h3>
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
                  {selectedVehicles.map(v => (
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
            {/* Seção de ADICIONAR pendência (só aparece para > 1 veículo) */}
            {selectedVehicles.length > 1 && (
              <div className="mb-4 p-4 border border-dashed rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Adicionar Pendências (em Lote)</h3>
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
                          onClick={(e) => { e.stopPropagation(); handleRemovePendency(pendencia); }}
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
            )}
            
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
                placeholder="Observações (opcional)"
              />
            </div>
            
            {/* Nova Grid de Histórico (só para 1 veículo) */}
            {singleVehicle && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Histórico de Pendências do Veículo</h3>
                <PendencyHistoryGrid
                  pendencies={vehiclePendencies}
                  onResolve={handleResolve}
                  onRemove={handleRemove}
                  onReleaseLock={handleReleaseLock}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={handleClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          
          <button 
            onClick={handleSignalPendencyClick} 
            disabled={selectedPendencies.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            Sinalizar Pendência
          </button>
          <button 
            onClick={handleApproveClick} 
            disabled={hasUnresolvedPendencies} // Atualizado
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