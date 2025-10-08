import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { ApprovalFilters } from '../types/Approval';
import { mockVehicles } from '../data/mockData';

interface FiscalAnalysisFilterPanelProps {
  filters: ApprovalFilters;
  onFiltersChange: (filters: ApprovalFilters) => void;
}

const FiscalAnalysisFilterPanel: React.FC<FiscalAnalysisFilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [crInput, setCrInput] = useState('');
  const [showCrSuggestions, setShowCrSuggestions] = useState(false);
  const crInputRef = useRef<HTMLInputElement>(null);

  const [modeloInput, setModeloInput] = useState(filters.modelo || '');
  const [showModeloSuggestions, setShowModeloSuggestions] = useState(false);

  const uniqueValues = useMemo(() => {
    const modelos = [...new Set(mockVehicles.map(v => v.modelo))].sort();
    const clientes = [...new Set(mockVehicles.map(v => v.cliente))].sort();
    const crs = [...new Set(mockVehicles.map(v => v.cr))].sort();
    const descricoesCR = [...new Set(mockVehicles.map(v => v.descricaoCR))].sort();
    const patiosDestino = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    const ufs = [...new Set(mockVehicles.map(v => v.uf))].sort();
    const municipios = [...new Set(mockVehicles.map(v => v.municipio))].sort();
    return { modelos, clientes, crs, descricoesCR, patiosDestino, ufs, municipios };
  }, []);

  const availableCrs = useMemo(() => {
    if (!filters.diretoria) {
      return uniqueValues.crs;
    }
    return [...new Set(mockVehicles.filter(v => v.diretoria === filters.diretoria).map(v => v.cr))].sort();
  }, [filters.diretoria, uniqueValues.crs]);
  
  const availableMunicipios = useMemo(() => {
    if (!filters.uf) {
      return uniqueValues.municipios;
    }
    return [...new Set(mockVehicles.filter(v => v.uf === filters.uf).map(v => v.municipio))].sort();
  }, [filters.uf, uniqueValues.municipios]);

  useEffect(() => {
    if (filters.diretoria && filters.cr) {
      const newCrs = filters.cr.filter(cr => availableCrs.includes(cr));
      if (newCrs.length !== filters.cr.length) {
        onFiltersChange({ ...filters, cr: newCrs });
      }
    }
    if (filters.uf && filters.municipio && !availableMunicipios.includes(filters.municipio)) {
      onFiltersChange({ ...filters, municipio: '' });
    }
  }, [filters.diretoria, availableCrs, filters.cr, onFiltersChange, filters.uf, filters.municipio, availableMunicipios]);

  const handleFilterChange = (key: keyof ApprovalFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'uf') {
      newFilters.municipio = '';
    }
    onFiltersChange(newFilters);
  };
  
  const handleAddCr = (cr: string) => {
    if (cr && !filters.cr?.includes(cr)) {
      const newCrs = [...(filters.cr || []), cr];
      onFiltersChange({ ...filters, cr: newCrs });
    }
    setCrInput('');
    setShowCrSuggestions(false);
  };
  
  const handleRemoveCr = (crToRemove: string) => {
    const newCrs = filters.cr?.filter(cr => cr !== crToRemove);
    onFiltersChange({ ...filters, cr: newCrs });
  };

  const crSuggestions = useMemo(() => {
    if (!crInput) return [];
    return availableCrs.filter(cr => 
      cr.toLowerCase().includes(crInput.toLowerCase()) && !filters.cr?.includes(cr)
    );
  }, [crInput, availableCrs, filters.cr]);

  const handleCrInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && crInput) {
      e.preventDefault();
      const exactMatch = availableCrs.find(cr => cr.toLowerCase() === crInput.toLowerCase());
      if (exactMatch) {
        handleAddCr(exactMatch);
      }
    }
  };

  const filteredModelos = useMemo(() => {
    return uniqueValues.modelos.filter(modelo => 
      modelo.toLowerCase().includes(modeloInput.toLowerCase())
    );
  }, [uniqueValues.modelos, modeloInput]);

  const handleModeloSelect = (modelo: string) => {
    setModeloInput(modelo);
    handleFilterChange('modelo', modelo);
    setShowModeloSuggestions(false);
  };

  const clearFilters = () => {
    setModeloInput('');
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
            <input
              type="text"
              value={filters.placa || ''}
              onChange={(e) => handleFilterChange('placa', e.target.value)}
              placeholder="Placa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
             <select
              value={filters.situacao || ''}
              onChange={(e) => handleFilterChange('situacao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Situações</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Pendente">Pendente</option>
            </select>
            <div className="lg:col-span-2">
              <div className="relative" onBlur={() => setTimeout(() => setShowCrSuggestions(false), 200)}>
                <div 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2"
                  onClick={() => crInputRef.current?.focus()}
                >
                  {filters.cr?.map(cr => (
                    <span key={cr} className="flex items-center gap-1 bg-gray-200 text-sm rounded-md px-2 py-1">
                      {cr}
                      <button type="button" onClick={() => handleRemoveCr(cr)} className="text-gray-600 hover:text-black">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={crInputRef}
                    type="text"
                    value={crInput}
                    onChange={(e) => setCrInput(e.target.value)}
                    onFocus={() => setShowCrSuggestions(true)}
                    onKeyDown={handleCrInputKeyDown}
                    className="flex-grow bg-transparent outline-none text-sm"
                    placeholder={filters.cr?.length > 0 ? '' : 'Digite o CR...'}
                  />
                </div>
                {showCrSuggestions && crSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {crSuggestions.map(cr => (
                      <button
                        key={cr}
                        type="button"
                        onMouseDown={() => handleAddCr(cr)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        {cr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalAnalysisFilterPanel;