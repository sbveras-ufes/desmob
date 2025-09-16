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

  const uniqueValues = useMemo(() => {
    const modelos = [...new Set(mockVehicles.map(v => v.modelo))].sort();
    const clientes = [...new Set(mockVehicles.map(v => v.cliente))].sort();
    const crs = [...new Set(mockVehicles.map(v => v.cr))].sort();
    const tiposDesmobilizacao = [...new Set(mockVehicles.map(v => v.tipoDesmobilizacao))].sort();
    const patiosDestino = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    const locaisDesmobilizacao = [...new Set(mockVehicles.map(v => v.localDesmobilizacao))].sort();
    return { modelos, clientes, crs, tiposDesmobilizacao, patiosDestino, locaisDesmobilizacao };
  }, []);

  const handleFilterChange = (key: keyof ApprovalFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <select
                value={filters.modelo || ''}
                onChange={(e) => handleFilterChange('modelo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o Modelo</option>
                {uniqueValues.modelos.map(modelo => <option key={modelo} value={modelo}>{modelo}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={filters.cliente || ''}
                onChange={(e) => handleFilterChange('cliente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o Cliente</option>
                {uniqueValues.clientes.map(cliente => <option key={cliente} value={cliente}>{cliente}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CR
              </label>
              <select
                value={filters.cr || ''}
                onChange={(e) => handleFilterChange('cr', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o CR</option>
                {uniqueValues.crs.map(cr => <option key={cr} value={cr}>{cr}</option>)}
              </select>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Desmobilização</label>
              <select value={filters.tipoDesmobilizacao || ''} onChange={(e) => handleFilterChange('tipoDesmobilizacao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione o Tipo</option>
                  {uniqueValues.tiposDesmobilizacao.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pátio Destino</label>
                <select value={filters.patioDestino || ''} onChange={(e) => handleFilterChange('patioDestino', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione o Pátio</option>
                    {uniqueValues.patiosDestino.map(patio => <option key={patio} value={patio}>{patio}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Local Desmobilização</label>
                <select value={filters.localDesmobilizacao || ''} onChange={(e) => handleFilterChange('localDesmobilizacao', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione o Local</option>
                    {uniqueValues.locaisDesmobilizacao.map(local => <option key={local} value={local}>{local}</option>)}
                </select>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalFilterPanel;