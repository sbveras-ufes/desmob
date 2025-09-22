import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { UserFilters } from '../types/User';
import { mockVehicles } from '../data/mockData';

interface UserFilterPanelProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const UserFilterPanel: React.FC<UserFilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCrDropdownOpen, setIsCrDropdownOpen] = useState(false);
  const [crSearchTerm, setCrSearchTerm] = useState('');

  const { uniqueCrs, uniqueDiretorias } = useMemo(() => {
    const uniqueCrs = [...new Set(mockVehicles.map(v => v.cr))].sort();
    const uniqueDiretorias = [...new Set(mockVehicles.map(v => v.diretoria))].sort();
    return { uniqueCrs, uniqueDiretorias };
  }, []);

  const availableCrs = useMemo(() => {
    if (!filters.diretoria) {
      return uniqueCrs;
    }
    return [...new Set(mockVehicles.filter(v => v.diretoria === filters.diretoria).map(v => v.cr))].sort();
  }, [filters.diretoria, uniqueCrs]);

  useEffect(() => {
    if (filters.diretoria && filters.cr) {
      const newCrs = filters.cr.filter(cr => availableCrs.includes(cr));
      if (newCrs.length !== filters.cr.length) {
        onFiltersChange({ ...filters, cr: newCrs });
      }
    }
  }, [filters.diretoria, availableCrs, filters.cr, onFiltersChange]);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleCrChange = (cr: string) => {
    const currentCrs = filters.cr || [];
    const newCrs = currentCrs.includes(cr)
      ? currentCrs.filter(c => c !== cr)
      : [...currentCrs, cr];
    onFiltersChange({ ...filters, cr: newCrs });
  };
  
  const filteredCrs = useMemo(() => {
    return availableCrs.filter(cr =>
      cr.toLowerCase().includes(crSearchTerm.toLowerCase())
    );
  }, [availableCrs, crSearchTerm]);

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
                onChange={(e) => handleFilterChange('cargo', e.target.value as 'Gestor Contrato' | 'Supervisor' | 'Diretor' | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os cargos</option>
                <option value="Gestor Contrato">Gestor Contrato</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Diretor">Diretor</option>
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
                {uniqueDiretorias.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">CR (Centro de Custo)</label>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilterPanel;