import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Vehicle, DemobilizationRequest } from '../types/Vehicle';

interface DemobilizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVehicles: Vehicle[];
  onSubmit: (request: DemobilizationRequest) => void;
}

const DemobilizationModal: React.FC<DemobilizationModalProps> = ({
  isOpen,
  onClose,
  selectedVehicles,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Omit<DemobilizationRequest, 'veiculos'>>({
    localDesmobilizacao: '',
    dataEntrega: '',
    patioDestino: '',
    tipoDesmobilizacao: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.localDesmobilizacao) {
      newErrors.localDesmobilizacao = 'Local da desmobilização é obrigatório';
    }

    if (!formData.dataEntrega) {
      newErrors.dataEntrega = 'Data da entrega é obrigatória';
    } else {
      const today = new Date();
      const entregaDate = new Date(formData.dataEntrega);
      if (entregaDate <= today) {
        newErrors.dataEntrega = 'Data da entrega deve ser futura';
      }
    }

    if (!formData.tipoDesmobilizacao) {
      newErrors.tipoDesmobilizacao = 'Tipo de desmobilização é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        veiculos: selectedVehicles
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Iniciar Desmobilização - {selectedVehicles.length} veículo(s) selecionado(s)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Placa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Modelo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ano/Modelo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Diretoria
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Residual
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {vehicle.placa}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {vehicle.modelo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {vehicle.anoModelo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {vehicle.diretoria}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {vehicle.cliente}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatCurrency(vehicle.residual)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local da Desmobilização <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.localDesmobilizacao}
                onChange={(e) => handleInputChange('localDesmobilizacao', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.localDesmobilizacao ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o local</option>
                <option value="patio-sp">Pátio São Paulo</option>
                <option value="patio-rj">Pátio Rio de Janeiro</option>
                <option value="patio-mg">Pátio Belo Horizonte</option>
                <option value="cliente-local">Local do Cliente</option>
              </select>
              {errors.localDesmobilizacao && (
                <p className="mt-1 text-sm text-red-600">{errors.localDesmobilizacao}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Entrega <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dataEntrega}
                onChange={(e) => handleInputChange('dataEntrega', e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dataEntrega ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dataEntrega && (
                <p className="mt-1 text-sm text-red-600">{errors.dataEntrega}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pátio Destino
              </label>
              <input
                type="text"
                value={formData.patioDestino}
                onChange={(e) => handleInputChange('patioDestino', e.target.value)}
                placeholder="Digite o pátio de destino..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Opcional - pode ser preenchido posteriormente</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Desmobilização <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipoDesmobilizacao}
                onChange={(e) => handleInputChange('tipoDesmobilizacao', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tipoDesmobilizacao ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o tipo</option>
                <option value="renovacao">Renovação da Frota</option>
                <option value="reducao">Redução da Frota</option>
                <option value="termino">Término Contrato</option>
              </select>
              {errors.tipoDesmobilizacao && (
                <p className="mt-1 text-sm text-red-600">{errors.tipoDesmobilizacao}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Solicitar desmobilização das placas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemobilizationModal;