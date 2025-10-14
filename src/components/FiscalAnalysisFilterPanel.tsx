import React, { useState, useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { ApprovalFilters } from '../types/Approval';
import { mockVehicles } from '../data/mockData';
import { mockCompanies } from '../data/mockCompanies';

interface FiscalAnalysisFilterPanelProps {
  filters: ApprovalFilters;
  onFiltersChange: (filters: ApprovalFilters) => void;
}

const FiscalAnalysisFilterPanel: React.FC<FiscalAnalysisFilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cnpjInput, setCnpjInput] = useState('');
  const [showCnpjSuggestions, setShowCnpjSuggestions] = useState(false);
  const cnpjInputRef = useRef<HTMLInputElement>(null);

  const uniqueValues = useMemo(() => {
    const modelos = [...new Set(mockVehicles.map(v => v.modelo))].sort();
    const diretorias = [...new Set(mockVehicles.map(v => v.diretoria))].sort();
    const ufsEmplacamento = [...new Set(mockVehicles.map(v => v.ufEmplacamento))].sort();
    const ufsOrigem = [...new Set(mockVehicles.map(v => v.uf))].sort();
    const empresas = [...new Set(mockCompanies.map(c => c.nome))].sort();
    const cnpjs = [...new Set(mockCompanies.map(c => c.cnpj))].sort();
    return { modelos, diretorias, ufsEmplacamento, ufsOrigem, empresas, cnpjs };
  }, []);

  const handleFilterChange = (key: keyof ApprovalFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMultiSelectChange = (key: keyof ApprovalFilters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFiltersChange({ ...filters, [key]: newValues });
  };
  
  const handleAddCnpj = (cnpj: string) => {
    if (cnpj && !filters.cnpjProprietario?.includes(cnpj)) {
      const newCnpjs = [...(filters.cnpjProprietario || []), cnpj];
      onFiltersChange({ ...filters, cnpjProprietario: newCnpjs });
    }
    setCnpjInput('');
    setShowCnpjSuggestions(false);
  };

  const handleRemoveCnpj = (cnpjToRemove: string) => {
    const newCnpjs = filters.cnpjProprietario?.filter(cnpj => cnpj !== cnpjToRemove);
    onFiltersChange({ ...filters, cnpjProprietario: newCnpjs });
  };

  const cnpjSuggestions = useMemo(() => {
    if (!cnpjInput) return [];
    return uniqueValues.cnpjs.filter(c => 
      c.toLowerCase().includes(cnpjInput.toLowerCase()) && !filters.cnpjProprietario?.includes(c)
    );
  }, [cnpjInput, uniqueValues.cnpjs, filters.cnpjProprietario]);

  const handleCnpjInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cnpjInput) {
      e.preventDefault();
      handleAddCnpj(cnpjInput);
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value && (Array.isArray(value) ? value.length > 0 : value !== ''));

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                Ativo
              </span>
            )}
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <fieldset className="md:col-span-2 border border-gray-300 rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="text-sm font-medium text-gray-700 px-1">Data Prevista</legend>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                <input type="date" value={filters.periodoInicio || ''} onChange={(e) => handleFilterChange('periodoInicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Até</label>
                <input type="date" value={filters.periodoFim || ''} onChange={(e) => handleFilterChange('periodoFim', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </fieldset>
            
            <input
              type="text"
              value={filters.demobilizationCode || ''}
              onChange={(e) => handleFilterChange('demobilizationCode', e.target.value)}
              placeholder="Código Desmobilização"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={filters.chassi || ''}
              onChange={(e) => handleFilterChange('chassi', e.target.value)}
              placeholder="Chassi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={filters.anoModelo || ''}
              onChange={(e) => handleFilterChange('anoModelo', e.target.value)}
              placeholder="Ano"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={filters.modelo || ''}
              onChange={(e) => handleFilterChange('modelo', e.target.value)}
              placeholder="Modelo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Diretoria multi-select */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diretorias</label>
              <select multiple value={filters.diretoria || []} onChange={(e) => handleFilterChange('diretoria', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {uniqueValues.diretorias.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <select value={filters.ufEmplacamento || ''} onChange={(e) => handleFilterChange('ufEmplacamento', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">UF de Emplacamento</option>
              {uniqueValues.ufsEmplacamento.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
            <select value={filters.uf || ''} onChange={(e) => handleFilterChange('uf', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">UF de Origem</option>
              {uniqueValues.ufsOrigem.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </select>
            
            <div className="relative lg:col-span-2" onBlur={() => setTimeout(() => setShowCnpjSuggestions(false), 200)}>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2" onClick={() => cnpjInputRef.current?.focus()}>
                {filters.cnpjProprietario?.map(c => (
                  <span key={c} className="flex items-center gap-1 bg-gray-200 text-sm rounded-md px-2 py-1">
                    {c} <button type="button" onClick={() => handleRemoveCnpj(c)} className="text-gray-600 hover:text-black"><X size={14} /></button>
                  </span>
                ))}
                <input ref={cnpjInputRef} type="text" value={cnpjInput} onChange={(e) => setCnpjInput(e.target.value)} onFocus={() => setShowCnpjSuggestions(true)} onKeyDown={handleCnpjInputKeyDown} className="flex-grow bg-transparent outline-none text-sm" placeholder={filters.cnpjProprietario?.length > 0 ? '' : 'CNPJ Proprietário...'}/>
              </div>
              {showCnpjSuggestions && cnpjSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {cnpjSuggestions.map(c => (
                    <button key={c} type="button" onMouseDown={() => handleAddCnpj(c)} className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">{c}</button>
                  ))}
                </div>
              )}
            </div>
            
            <select value={filters.empresaProprietaria || ''} onChange={(e) => handleFilterChange('empresaProprietaria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Empresa Proprietária</option>
              {uniqueValues.empresas.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select value={filters.situacao || ''} onChange={(e) => handleFilterChange('situacao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Situação Desmobilização</option>
              <option value="Liberado para Desmobilização">Liberado para Desmobilização</option>
              <option value="Desmobilização Bloqueada">Desmobilização Bloqueada</option>
            </select>
            
            <select value={filters.situacaoAnaliseFiscal || ''} onChange={(e) => handleFilterChange('situacaoAnaliseFiscal', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Situação Análise Fiscal</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalAnalysisFilterPanel;