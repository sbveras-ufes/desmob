import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { ApprovalFilters } from '../types/Approval';
import { mockVehicles } from '../data/mockData';

interface AssetDemobilizationFilterPanelProps {
  filters: ApprovalFilters;
  onFiltersChange: (filters: ApprovalFilters) => void;
}

const AssetDemobilizationFilterPanel: React.FC<AssetDemobilizationFilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [crInput, setCrInput] = useState('');
  const [showCrSuggestions, setShowCrSuggestions] = useState(false);
  const crInputRef = useRef<HTMLInputElement>(null);

  const [chassiInput, setChassiInput] = useState('');
  const [showChassiSuggestions, setShowChassiSuggestions] = useState(false);
  const chassiInputRef = useRef<HTMLInputElement>(null);

  const [placaInput, setPlacaInput] = useState('');
  const [showPlacaSuggestions, setShowPlacaSuggestions] = useState(false);
  const placaInputRef = useRef<HTMLInputElement>(null);
  
  const [modeloInput, setModeloInput] = useState(filters.modelo || '');
  const [showModeloSuggestions, setShowModeloSuggestions] = useState(false);

  const uniqueValues = useMemo(() => {
    const modelos = [...new Set(mockVehicles.map(v => v.modelo))].sort();
    const clientes = [...new Set(mockVehicles.map(v => v.cliente))].sort();
    const crs = [...new Set(mockVehicles.map(v => v.cr))].sort();
    const chassis = [...new Set(mockVehicles.map(v => v.chassi))].sort();
    const placas = [...new Set(mockVehicles.map(v => v.placa))].sort();
    const descricoesCR = [...new Set(mockVehicles.map(v => v.descricaoCR))].sort();
    const tiposDesmobilizacao = [...new Set(mockVehicles.map(v => v.tipoDesmobilizacao))].sort();
    const patiosDestino = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    const ufs = [...new Set(mockVehicles.map(v => v.uf))].sort();
    const municipios = [...new Set(mockVehicles.map(v => v.municipio))].sort();
    return { modelos, clientes, crs, chassis, placas, descricoesCR, tiposDesmobilizacao, patiosDestino, ufs, municipios };
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
  
  const handleAddChassi = (chassi: string) => {
    if (chassi && !filters.chassi?.includes(chassi)) {
      const newChassis = [...(filters.chassi || []), chassi];
      onFiltersChange({ ...filters, chassi: newChassis });
    }
    setChassiInput('');
    setShowChassiSuggestions(false);
  };
  
  const handleRemoveChassi = (chassiToRemove: string) => {
    const newChassis = filters.chassi?.filter(chassi => chassi !== chassiToRemove);
    onFiltersChange({ ...filters, chassi: newChassis });
  };

  const handleAddPlaca = (placa: string) => {
    if (placa && !filters.placa?.includes(placa)) {
      const newPlacas = [...(filters.placa || []), placa];
      onFiltersChange({ ...filters, placa: newPlacas });
    }
    setPlacaInput('');
    setShowPlacaSuggestions(false);
  };

  const handleRemovePlaca = (placaToRemove: string) => {
    const newPlacas = filters.placa?.filter(placa => placa !== placaToRemove);
    onFiltersChange({ ...filters, placa: newPlacas });
  };

  const crSuggestions = useMemo(() => {
    if (!crInput) return [];
    return availableCrs.filter(cr => 
      cr.toLowerCase().includes(crInput.toLowerCase()) && !filters.cr?.includes(cr)
    );
  }, [crInput, availableCrs, filters.cr]);

  const chassiSuggestions = useMemo(() => {
    if (!chassiInput) return [];
    return uniqueValues.chassis.filter(c => 
      c.toLowerCase().includes(chassiInput.toLowerCase()) && !filters.chassi?.includes(c)
    );
  }, [chassiInput, uniqueValues.chassis, filters.chassi]);

  const placaSuggestions = useMemo(() => {
    if (!placaInput) return [];
    return uniqueValues.placas.filter(p => 
      p.toLowerCase().includes(placaInput.toLowerCase()) && !filters.placa?.includes(p)
    );
  }, [placaInput, uniqueValues.placas, filters.placa]);

  const handleCrInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && crInput) {
      e.preventDefault();
      const exactMatch = availableCrs.find(cr => cr.toLowerCase() === crInput.toLowerCase());
      if (exactMatch) handleAddCr(exactMatch);
    }
  };

  const handleChassiInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chassiInput) {
      e.preventDefault();
      const exactMatch = uniqueValues.chassis.find(c => c.toLowerCase() === chassiInput.toLowerCase());
      if (exactMatch) handleAddChassi(exactMatch);
      else handleAddChassi(chassiInput);
    }
  };

  const handlePlacaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && placaInput) {
      e.preventDefault();
      const exactMatch = uniqueValues.placas.find(p => p.toLowerCase() === placaInput.toLowerCase());
      if (exactMatch) handleAddPlaca(exactMatch);
      else handleAddPlaca(placaInput);
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
    setChassiInput('');
    setPlacaInput('');
    setCrInput('');
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
              <input
                type="date"
                value={filters.periodoInicio || ''}
                onChange={(e) => handleFilterChange('periodoInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.periodoFim || ''}
                onChange={(e) => handleFilterChange('periodoFim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </fieldset>

            <fieldset className="md:col-span-2 border border-gray-300 rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="text-sm font-medium text-gray-700 px-1">Data de Entrega</legend>
              <input type="date" value={filters.entregaInicio || ''} onChange={(e) => handleFilterChange('entregaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="date" value={filters.entregaFim || ''} onChange={(e) => handleFilterChange('entregaFim', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </fieldset>
            
            <div className="relative" onBlur={() => setTimeout(() => setShowChassiSuggestions(false), 200)}>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2" onClick={() => chassiInputRef.current?.focus()}>
                {filters.chassi?.map(c => (
                  <span key={c} className="flex items-center gap-1 bg-gray-200 text-sm rounded-md px-2 py-1">
                    {c} <button type="button" onClick={() => handleRemoveChassi(c)} className="text-gray-600 hover:text-black"><X size={14} /></button>
                  </span>
                ))}
                <input ref={chassiInputRef} type="text" value={chassiInput} onChange={(e) => setChassiInput(e.target.value)} onFocus={() => setShowChassiSuggestions(true)} onKeyDown={handleChassiInputKeyDown} className="flex-grow bg-transparent outline-none text-sm" placeholder={filters.chassi?.length > 0 ? '' : 'Chassi...'}/>
              </div>
              {showChassiSuggestions && chassiSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {chassiSuggestions.map(c => (
                    <button key={c} type="button" onMouseDown={() => handleAddChassi(c)} className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">{c}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" onBlur={() => setTimeout(() => setShowPlacaSuggestions(false), 200)}>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2" onClick={() => placaInputRef.current?.focus()}>
                {filters.placa?.map(p => (
                  <span key={p} className="flex items-center gap-1 bg-gray-200 text-sm rounded-md px-2 py-1">
                    {p} <button type="button" onClick={() => handleRemovePlaca(p)} className="text-gray-600 hover:text-black"><X size={14} /></button>
                  </span>
                ))}
                <input ref={placaInputRef} type="text" value={placaInput} onChange={(e) => setPlacaInput(e.target.value)} onFocus={() => setShowPlacaSuggestions(true)} onKeyDown={handlePlacaInputKeyDown} className="flex-grow bg-transparent outline-none text-sm" placeholder={filters.placa?.length > 0 ? '' : 'Placa...'}/>
              </div>
              {showPlacaSuggestions && placaSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {placaSuggestions.map(p => (
                    <button key={p} type="button" onMouseDown={() => handleAddPlaca(p)} className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm">{p}</button>
                  ))}
                </div>
              )}
            </div>
            
            <input
              type="text"
              value={filters.anoModelo || ''}
              onChange={(e) => handleFilterChange('anoModelo', e.target.value)}
              placeholder="Ano"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
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
                placeholder="Digite o código ou modelo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showModeloSuggestions && filteredModelos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredModelos.map((modelo, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={() => handleModeloSelect(modelo)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                    >
                      {modelo}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={filters.cliente || ''}
              onChange={(e) => handleFilterChange('cliente', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o Cliente</option>
              {uniqueValues.clientes.map(cliente => <option key={cliente} value={cliente}>{cliente}</option>)}
            </select>
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
            <select value={filters.descricaoCR || ''} onChange={(e) => handleFilterChange('descricaoCR', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione a Descrição</option>
                {uniqueValues.descricoesCR.map(desc => <option key={desc} value={desc}>{desc}</option>)}
            </select>
            <select value={filters.tipoDesmobilizacao || ''} onChange={(e) => handleFilterChange('tipoDesmobilizacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione o Tipo</option>
                {uniqueValues.tiposDesmobilizacao.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
              <select value={filters.patioDestino || ''} onChange={(e) => handleFilterChange('patioDestino', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione o Pátio</option>
                  {uniqueValues.patiosDestino.map(patio => <option key={patio} value={patio}>{patio}</option>)}
              </select>
            <fieldset className="md:col-span-3 border border-gray-300 rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <legend className="text-sm font-medium text-gray-700 px-1">Local Desmobilização</legend>

              <select value={filters.uf || ''} onChange={(e) => handleFilterChange('uf', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas as UFs</option>
                  {uniqueValues.ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              <select value={filters.municipio || ''} onChange={(e) => handleFilterChange('municipio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!filters.uf}>
                  <option value="">Todos os Municípios</option>
                  {availableMunicipios.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </fieldset>
            
            <div className="flex items-center pt-6">
              <input
                id="com-pendencias"
                type="checkbox"
                checked={filters.comPendencias || false}
                onChange={(e) => handleFilterChange('comPendencias', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="com-pendencias" className="ml-2 block text-sm font-medium text-gray-900">
                Com Pendências
              </label>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origem da Pendência</label>
              <select 
                value={filters.origemPendencia || ''} 
                onChange={(e) => handleFilterChange('origemPendencia', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Documental">Documental</option>
                <option value="Fiscal">Fiscal</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDemobilizationFilterPanel;