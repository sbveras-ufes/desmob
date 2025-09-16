import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { DemobilizationFilters } from '../types/Vehicle';
import { mockVehicles } from '../data/mockData';

interface FilterPanelProps {
  filters: DemobilizationFilters;
  onFiltersChange: (filters: DemobilizationFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCrDropdownOpen, setIsCrDropdownOpen] = useState(false);
  const [crSearchTerm, setCrSearchTerm] = useState('');

  const uniqueValues = useMemo(() => {
    const modelos = [...new Set(mockVehicles.map(v => v.modelo))].sort();
    const clientes = [...new Set(mockVehicles.map(v => v.cliente))].sort();
    const crs = [...new Set(mockVehicles.map(v => v.cr))].sort();
    const tiposDesmobilizacao = [...new Set(mockVehicles.map(v => v.tipoDesmobilizacao))].sort();
    const patiosDestino = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    const locaisDesmobilizacao = [...new Set(mockVehicles.map(v => v.localDesmobilizacao))].sort();
    return { modelos, clientes, crs, tiposDesmobilizacao, patiosDestino, locaisDesmobilizacao };
  }, []);

  const handleFilterChange = (key: keyof DemobilizationFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleCrChange = (cr: string) => {
    const currentCrs = filters.cr || [];
    const newCrs = currentCrs.includes(cr)
      ? currentCrs.filter(c => c !== cr)
      : [...currentCrs, cr];
    onFiltersChange({ ...filters, cr: newCrs });
  };

  const filteredCrs = useMemo(() => {
    return uniqueValues.crs.filter(cr =>
      cr.toLowerCase().includes(crSearchTerm.toLowerCase())
    );
  }, [uniqueValues.crs, crSearchTerm]);

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
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Período Inicial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período - Data Inicial</label>
              <input type="date" value={filters.periodoInicio || ''} onChange={(e) => handleFilterChange('periodoInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            {/* Período Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período - Data Final</label>
              <input type="date" value={filters.periodoFim || ''} onChange={(e) => handleFilterChange('periodoFim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            {/* Mês */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
              <select value={filters.mes || ''} onChange={(e) => handleFilterChange('mes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os meses</option>
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>
            
            {/* Tipo de Veículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Veículo</label>
              <select value={filters.tipo || ''} onChange={(e) => handleFilterChange('tipo', e.target.value as 'leve' | 'pesado' | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os tipos</option>
                <option value="leve">Leve</option>
                <option value="pesado">Pesado</option>
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <select value={filters.modelo || ''} onChange={(e) => handleFilterChange('modelo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione o Modelo</option>
                {uniqueValues.modelos.map(modelo => <option key={modelo} value={modelo}>{modelo}</option>)}
              </select>
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <select value={filters.cliente || ''} onChange={(e) => handleFilterChange('cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione o Cliente</option>
                {uniqueValues.clientes.map(cliente => <option key={cliente} value={cliente}>{cliente}</option>)}
              </select>
            </div>

            {/* CR (Custom Multi-select) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">CR</label>
              <button
                type="button"
                onClick={() => setIsCrDropdownOpen(!isCrDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
              >
                <span className="truncate">
                  {filters.cr?.length > 0 ? `${filters.cr.length} selecionado(s)` : 'Selecione o(s) CR(s)'}
                </span>
                <ChevronDown className={`h-5 w-5 transform transition-transform ${isCrDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCrDropdownOpen && (
                <div 
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  onMouseLeave={() => setIsCrDropdownOpen(false)}
                >
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Buscar CR..."
                      value={crSearchTerm}
                      onChange={(e) => setCrSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <ul>
                    {filteredCrs.map(cr => (
                      <li key={cr} className="px-2 py-1 hover:bg-gray-100">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.cr?.includes(cr) || false}
                            onChange={() => handleCrChange(cr)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span>{cr}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Diretoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diretoria</label>
              <select value={filters.diretoria || ''} onChange={(e) => handleFilterChange('diretoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas as diretorias</option>
                <option value="LETS">LETS</option>
                <option value="COMERCIAL">COMERCIAL</option>
                <option value="OPERAÇÕES">OPERAÇÕES</option>
                <option value="FINANCEIRA">FINANCEIRA</option>
              </select>
            </div>

            {/* Tipo Desmobilização */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Desmobilização</label>
                <select value={filters.tipoDesmobilizacao || ''} onChange={(e) => handleFilterChange('tipoDesmobilizacao', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione o Tipo</option>
                    {uniqueValues.tiposDesmobilizacao.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
            </div>

            {/* Pátio Destino */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pátio Destino</label>
                <select value={filters.patioDestino || ''} onChange={(e) => handleFilterChange('patioDestino', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione o Pátio</option>
                    {uniqueValues.patiosDestino.map(patio => <option key={patio} value={patio}>{patio}</option>)}
                </select>
            </div>

            {/* Local Desmobilização */}
            <div>
                <label className="block text-sm