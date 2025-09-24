import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Vehicle, DemobilizationRequest } from '../types/Vehicle';
import { mockVehicles } from '../data/mockData';
import AddVehicleModal from './AddVehicleModal';

interface DemobilizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicles: Vehicle[];
  onSubmit: (request: Omit<DemobilizationRequest, 'localDesmobilizacao'>) => void;
}

const DemobilizationModal: React.FC<DemobilizationModalProps> = ({
  isOpen,
  onClose,
  selectedVehicles,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Omit<DemobilizationRequest, 'veiculos'>>({
    uf: '',
    municipio: '',
    dataEntrega: '',
    patioDestino: '',
  });

  const [vehiclesInModal, setVehiclesInModal] = useState<Vehicle[]>([]);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVehiclesInModal(selectedVehicles);
    }
  }, [isOpen, selectedVehicles]);

  const [patioInput, setPatioInput] = useState('');
  const [showPatioSuggestions, setShowPatioSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { uniqueUFs, uniqueMunicipios, uniquePatios } = useMemo(() => {
    const ufs = [...new Set(mockVehicles.map(v => v.uf))].sort();
    const municipios = [...new Set(mockVehicles.map(v => v.municipio))].sort();
    const patios = [...new Set(mockVehicles.map(v => v.patioDestino))].sort();
    return { uniqueUFs: ufs, uniqueMunicipios: municipios, uniquePatios: patios };
  }, []);

  const availableMunicipios = useMemo(() => {
    if (!formData.uf) return uniqueMunicipios;
    return [...new Set(mockVehicles.filter(v => v.uf === formData.uf).map(v => v.municipio))].sort();
  }, [formData.uf, uniqueMunicipios]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ uf: '', municipio: '', dataEntrega: '', patioDestino: '' });
      setPatioInput('');
      setErrors({});
    }
  }, [isOpen]);

  const filteredPatios = useMemo(() => uniquePatios.filter(p => p.toLowerCase().includes(patioInput.toLowerCase())), [uniquePatios, patioInput]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.uf) newErrors.uf = 'UF é obrigatória';
    if (!formData.municipio) newErrors.municipio = 'Município é obrigatório';
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
      onSubmit({ ...formData, veiculos: vehiclesInModal });
    }
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    if (field === 'uf') {
      newFormData.municipio = '';
    }
    setFormData(newFormData);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handlePatioSelect = (value: string) => {
    setPatioInput(value);
    setShowPatioSuggestions(false);
    handleInputChange('patioDestino', value);
  };

  const handleAddVehicle = (newVehicle: Partial<Vehicle>) => {
    setVehiclesInModal(prev => [...prev, newVehicle as Vehicle]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Iniciar Desmobilização - {vehiclesInModal.length} veículo(s) selecionado(s)
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Veículos Selecionados</h3>
              <button
                type="button"
                onClick={() => setIsAddVehicleModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Veículo</span>
              </button>
            </div>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
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
                  {vehiclesInModal.map((vehicle, index) => (
                    <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{vehicle.chassi}</td>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <fieldset className="border border-gray-300 rounded-md p-4">
                  <legend className="text-sm font-medium text-gray-700 px-2">Local de Desmobilização</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UF <span className="text-red-500">*</span></label>
                      <select value={formData.uf} onChange={(e) => handleInputChange('uf', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${errors.uf ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="">Selecione a UF</option>
                        {uniqueUFs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                      {errors.uf && <p className="mt-1 text-sm text-red-600">{errors.uf}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Município <span className="text-red-500">*</span></label>
                      <select value={formData.municipio} onChange={(e) => handleInputChange('municipio', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md ${errors.municipio ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={!formData.uf}>
                        <option value="">Selecione o município</option>
                        {availableMunicipios.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {errors.municipio && <p className="mt-1 text-sm text-red-600">{errors.municipio}</p>}
                    </div>
                  </div>
                </fieldset>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data da Entrega <span className="text-red-500">*</span></label>
                <input type="date" value={formData.dataEntrega}
                  onChange={(e) => handleInputChange('dataEntrega', e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-md ${errors.dataEntrega ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.dataEntrega && <p className="mt-1 text-sm text-red-600">{errors.dataEntrega}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pátio Destino</label>
                <input type="text" value={patioInput}
                  onChange={(e) => setPatioInput(e.target.value)}
                  onFocus={() => setShowPatioSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPatioSuggestions(false), 200)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Digite o pátio de destino..." />
                {showPatioSuggestions && filteredPatios.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredPatios.map((patio) => (
                      <button type="button" key={patio} onMouseDown={() => handlePatioSelect(patio)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100">{patio}</button>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-sm text-gray-500">Opcional - pode ser preenchido posteriormente</p>
              </div>
            </div>

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
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onAddVehicle={handleAddVehicle}
      />
    </>
  );
};

export default DemobilizationModal;