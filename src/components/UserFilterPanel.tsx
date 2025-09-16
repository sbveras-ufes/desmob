import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { UserFilters } from '../types/User';
import { mockVehicles } from '../data/mockData';

interface UserFilterPanelProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const UserFilterPanel: React.FC<UserFilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const uniqueCrs = useMemo(() => {
    return [...new Set(mockVehicles.map(v => v.cr))].sort();
  }, []);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
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
                Nome
              </label>
              <input
                type="text"
                value={filters.nome || ''}
                onChange={(e) => handleFilterChange('nome', e.target.value)}
                placeholder="Digite o nome..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={filters.email || ''}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                placeholder="Digite o e-mail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo
              </label>
              <select
                value={filters.cargo || ''}
                onChange={(e) => handleFilterChange('cargo', e.target.value as 'Gestor Contrato' | 'Supervisor' | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os cargos</option>
                <option value="Gestor Contrato">Gestor Contrato</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CR (Centro de Custo)
              </label>
              <select
                value={filters.cr || ''}
                onChange={(e) => handleFilterChange('cr', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os CRs</option>
                {uniqueCrs.map(cr => (
                  <option key={cr} value={cr}>{cr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilterPanel;