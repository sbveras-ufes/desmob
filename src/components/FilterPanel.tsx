import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { DemobilizationFilters } from '../types/Vehicle';
import { mockVehicles } from '../data/mockData';

interface FilterPanelProps {
  filters: DemobilizationFilters;
  onFiltersChange: (filters: DemobilizationFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
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
    const tiposDesmobilizacao = [...new Set(mockVehicles.map(v => v.tipoDesmobilizacao))].sort();
    const patiosDestino = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    const ufs = [...new Set(mockVehicles.map(v => v.uf))].sort();
    const municipios = [...new Set(mockVehicles.map(v => v.municipio))].sort();
    return { modelos, clientes, crs, tiposDesmobilizacao, patiosDestino, ufs, municipios };
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

  const handleFilterChange = (key: keyof DemobilizationFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'uf') {
      newFilters.munic