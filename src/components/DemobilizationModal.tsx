import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { Vehicle, DemobilizationRequest } from '../types/Vehicle';
import { mockVehicles } from '../data/mockData';

interface DemobilizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicles: Vehicle[];
  onSubmit: (request: Omit<DemobilizationRequest, 'tipoDesmobilizacao'>) => void;
}

const DemobilizationModal: React.FC<DemobilizationModalProps> = ({
  isOpen,
  onClose,
  selectedVehicles,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Omit<DemobilizationRequest, 'veiculos' | 'tipoDesmobilizacao'>>({
    localDesmobilizacao: '',
    dataEntrega: '',
    patioDestino: '',
  });

  const [localInput, setLocalInput] = useState('');
  const [patioInput, setPatioInput] = useState('');
  const [showLocalSuggestions, setShowLocalSuggestions] = useState(false);
  const [showPatioSuggestions, setShowPatioSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { uniqueLocais, uniquePatios } = useMemo(() => {
    const uniqueLocais = [...new Set(mockVehicles.map(v => v.localDesmobilizacao))].sort();
    const uniquePatios = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    return { uniqueLocais, uniquePatios };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ localDesmobilizacao: '', dataEntrega: '', patioDestino: '' });
      setLocalInput('');
      setPatioInput('');
      setErrors({});
    }
  }, [isOpen]);

  const filteredLocais = useMemo(() => uniqueLocais.filter(l => l.toLowerCase().includes(localInput.toLowerCase())), [uniqueLocais, localInput]);
  const filteredPatios = useMemo(() => uniquePatios.filter(p => p.toLowerCase().includes(patioInput.toLowerCase())), [uniquePatios, patioInput]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.localDesmobilizacao) newErrors.localDesmobilizacao = 'Local da desmobilização é obrigatório';
    if (!formData.dataEntrega) {
      newErrors.dataEntrega = 'Data da entrega é obrigatória';
    } else {
      const today = new Date();
      const entregaDate = new Date(formData.dataEntrega);
      if (entregaDate <= today) newErrors.dataEntrega = 'Data da entrega deve ser futura';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, veiculos: selectedVehicles });
    }
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAutocompleteChange = (field: 'localDesmobilizacao' | 'patioDestino', value: string) => {
    if (field === 'localDesmobilizacao') {
      setLocalInput(value);
      handleInputChange(field, value);
    } else if (field === 'patioDestino') {
      setPatioInput(value);
      handleInputChange(field, value);
    }
  };
  
  const handleSelect = (field: 'localDesmobilizacao' | 'patioDestino', value: string) => {
    if (field === 'localDesmobilizacao') {
      setLocalInput(value);
      setShowLocalSuggestions(false);
    } else if (field === 'patioDestino') {
      setPatioInput(value);
      setShowPatioSuggestions(false);
    }
    handleInputChange(field, value);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Iniciar Desmobilização - {selectedVehicles.length} veículo(s) selecionado(s)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Selected Vehicles Table */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Veículos Selecionados</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diretoria</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição CR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Desmobilização</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.modelo}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.anoModelo}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.diretoria}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.cr}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.descricaoCR}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.tipoDesmobilizacao}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.cliente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local da Desmobilização Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Local da Desmobilização <span className="text-red-500">*</span></label>
              <input type="text" value={localInput}
                onChange={(e) => handleAutocompleteChange('localDesmobilizacao', e.target.value)}
                onFocus={() => setShowLocalSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocalSuggestions(false), 200)}
                className={`w-full px-3 py-2 border rounded-md ${errors.localDesmobilizacao ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Digite o local..." />
              {showLocalSuggestions && filteredLocais.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredLocais.map((local) => (
                    <button type="button" key={local} onMouseDown={() => handleSelect('localDesmobilizacao', local)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100">{local}</button>
                  ))}
                </div>
              )}
              {errors.localDesmobilizacao && <p className="mt-1 text-sm text-red-600">{errors.localDesmobilizacao}</p>}
            </div>

            {/* Data da Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data da Entrega <span className="text-red-500">*</span></label>
              <input type="date" value={formData.dataEntrega}
                onChange={(e) => handleInputChange('dataEntrega', e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md ${errors.dataEntrega ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.dataEntrega && <p className="mt-1 text-sm text-red-600">{errors.dataEntrega}</p>}
            </div>

            {/* Pátio Destino Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pátio Destino</label>
              <input type="text" value={patioInput}
                onChange={(e) => handleAutocompleteChange('patioDestino', e.target.value)}
                onFocus={() => setShowPatioSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPatioSuggestions(false), 200)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Digite o pátio de destino..." />
              {showPatioSuggestions && filteredPatios.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredPatios.map((patio) => (
                    <button type="button" key={patio} onMouseDown={() => handleSelect('patioDestino', patio)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100">{patio}</button>
                  ))}
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">Opcional - pode ser preenchido posteriormente</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Solicitar desmobilização das placas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemobilizationModal;