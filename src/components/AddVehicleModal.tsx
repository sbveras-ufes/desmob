import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Vehicle } from '../types/Vehicle';
import { mockUnlistedVehicles } from '../data/mockUnlistedVehicles';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  currentVehicleIds: string[];
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onAddVehicle, currentVehicleIds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'placa' | 'chassi'>('placa');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const availableVehicles = useMemo(() => 
    mockUnlistedVehicles.filter(v => !currentVehicleIds.includes(v.id)),
  [currentVehicleIds]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return [];
    return availableVehicles.filter(v =>
      v[searchField].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, searchField, availableVehicles]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchTerm(vehicle[searchField]);
  };

  const handleAddClick = () => {
    if (selectedVehicle) {
      onAddVehicle({ ...selectedVehicle, tipoDesmobilizacao: '-' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Veículo Não Listado</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="searchField"
                value="placa"
                checked={searchField === 'placa'}
                onChange={() => setSearchField('placa')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm">Placa</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="searchField"
                value="chassi"
                checked={searchField === 'chassi'}
                onChange={() => setSearchField('chassi')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm">Chassi</span>
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Digite a ${searchField}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filteredVehicles.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredVehicles.map(vehicle => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {vehicle[searchField]} - {vehicle.modelo}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedVehicle && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <p><strong>Placa:</strong> {selectedVehicle.placa}</p>
              <p><strong>Chassi:</strong> {selectedVehicle.chassi}</p>
              <p><strong>Modelo:</strong> {selectedVehicle.modelo}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">Cancelar</button>
          <button onClick={handleAddClick} disabled={!selectedVehicle} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;