import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { ApprovalFilters } from '../types/Approval';
import { mockVehicles } from '../data/mockData';

interface ApprovalFilterPanelProps {
  filters: ApprovalFilters;
  onFiltersChange: (filters: ApprovalFilters) => void;
}

const ApprovalFilterPanel: React.FC<ApprovalFilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clienteInput, setClienteInput] = useState(filters.cliente || '');
  const [modeloInput, setModeloInput] = useState(filters.modelo || '');
  const [crInput, setCrInput] = useState(filters.cr || '');
  const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);
  const [showModeloSuggestions, setShowModeloSuggestions] = useState(false);
  const [showCrSuggestions, setShowCrSuggestions] = useState(false);

  // Get unique values for autocomplete
  const uniqueClientes = useMemo(() => {
    return [...new Set(mockVehicles.map(v => v.cliente))].sort();
  }, []);

  const uniqueModelos = useMemo(() => {
    return [...new Set(mockVehicles.map(v => v.modelo))].sort();
  }, []);

  const uniqueCrs = useMemo(() => {
    return [...new Set(mockVehicles.map(v => v.cr))].sort();
  }, []);

  // Filter suggestions based on input
  const filteredClientes = useMemo(() => {
    return uniqueClientes.filter(cliente => 
      cliente.toLowerCase().includes(clienteInput.toLowerCase())
    );
  }, [uniqueClientes, clienteInput]);

  const filteredModelos = useMemo(() => {
    return uniqueModelos.filter(modelo => 
      modelo.toLowerCase().includes(modeloInput.toLowerCase())
    );
  }, [uniqueModelos, modeloInput]);

  const filteredCrs = useMemo(() => {
    return uniqueCrs.filter(cr => 
      cr.includes(crInput)
    );
  }, [uniqueCrs, crInput]);

  const handleFilterChange = (key: keyof ApprovalFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClienteSelect = (cliente: string) => {
    setClienteInput(cliente);
    handleFilterChange('cliente', cliente);
    setShowClienteSuggestions(false);
  };

  const handleModeloSelect = (modelo: string) => {
    setModeloInput(modelo);
    handleFilterChange('modelo', modelo);
    setShowModeloSuggestions(false);
  };

  const handleCrSelect = (cr: string) => {
    setCrInput(cr);
    handleFilterChange('cr', cr);
    setShowCrSuggestions(false);
  };

  const clearFilters = () => {
    setClienteInput('');
    setModeloInput('');
    setCrInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

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
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período - Data Inicial
              </label>
              <input
                type="date"
                value={filters.periodoInicio || ''}
                onChange={(e) => handleFilterChange('periodoInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período - Data Final
              </label>
              <input
                type="date"
                value={filters.periodoFim || ''}
                onChange={(e) => handleFilterChange('periodoFim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select
                value={filters.mes || ''}
                onChange={(e) => handleFilterChange('mes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os meses</option>
                <option value="01">Janeiro</option>
                <option value="02">Fevereiro</option>
                <option value="03">Março</option>
                <option value="04">Abril</option>
                <option value="05">Maio</option>
                <option value="06">Junho</option>
                <option value="07">Julho</option>
                <option value="08">Agosto</option>
                <option value="09">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa
              </label>
              <input
                type="text"
                value={filters.placa || ''}
                onChange={(e) => handleFilterChange('placa', e.target.value)}
                placeholder="Ex: ABC1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filters.tipo || ''}
                onChange={(e) => handleFilterChange('tipo', e.target.value as 'leve' | 'pesado' | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os tipos</option>
                <option value="leve">Leve</option>
                <option value="pesado">Pesado</option>
              </select>
            </div>

            {/* Modelo Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={modeloInput}
                onChange={(e) => {
                  setModeloInput(e.target.value);
                  handleFilterChange('modelo', e.target.value);
                  setShowModeloSuggestions(true);
                }}
                onFocus={() => setShowModeloSuggestions(true)}
                onBlur={() => setTimeout(() => setShowModeloSuggestions(false), 200)}
                placeholder="Digite o modelo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showModeloSuggestions && filteredModelos.length > 0 && modeloInput && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredModelos.slice(0, 10).map((modelo, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleModeloSelect(modelo)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {modelo}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cliente Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <input
                type="text"
                value={clienteInput}
                onChange={(e) => {
                  setClienteInput(e.target.value);
                  handleFilterChange('cliente', e.target.value);
                  setShowClienteSuggestions(true);
                }}
                onFocus={() => setShowClienteSuggestions(true)}
                onBlur={() => setTimeout(() => setShowClienteSuggestions(false), 200)}
                placeholder="Digite o nome do cliente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showClienteSuggestions && filteredClientes.length > 0 && clienteInput && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredClientes.slice(0, 10).map((cliente, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleClienteSelect(cliente)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {cliente}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CR Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CR
              </label>
              <input
                type="text"
                value={crInput}
                onChange={(e) => {
                  setCrInput(e.target.value);
                  handleFilterChange('cr', e.target.value);
                  setShowCrSuggestions(true);
                }}
                onFocus={() => setShowCrSuggestions(true)}
                onBlur={() => setTimeout(() => setShowCrSuggestions(false), 200)}
                placeholder="Digite o código CR..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showCrSuggestions && filteredCrs.length > 0 && crInput && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCrs.slice(0, 10).map((cr, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCrSelect(cr)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {cr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diretoria
              </label>
              <select
                value={filters.diretoria || ''}
                onChange={(e) => handleFilterChange('diretoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as diretorias</option>
                <option value="LETS">LETS</option>
                <option value="COMERCIAL">COMERCIAL</option>
                <option value="OPERAÇÕES">OPERAÇÕES</option>
                <option value="FINANCEIRA">FINANCEIRA</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalFilterPanel;