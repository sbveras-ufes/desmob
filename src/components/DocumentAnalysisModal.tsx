import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

type PendencyType = 'RENAVAN' | 'Multa' | 'Recall';

interface DocumentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  onApprove: (observation: string) => void;
  onSignalPendency: (pendencies: PendencyType[], observation: string) => void;
}

const DocumentAnalysisModal: React.FC<DocumentAnalysisModalProps> = ({ isOpen, onClose, vehicles, onApprove, onSignalPendency }) => {
  const [selectedPendencies, setSelectedPendencies] = useState<PendencyType[]>([]);
  const [observation, setObservation] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pendencyOptions: PendencyType[] = ['RENAVAN', 'Multa', 'Recall'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleTogglePendency = (pendency: PendencyType) => {
    setSelectedPendencies(prev =>
      prev.includes(pendency) ? prev.filter(p => p !== pendency) : [...prev, pendency]
    );
  };

  const handleApprove = () => {
    onApprove(observation);
    onClose();
  };

  const handleSignalPendency = () => {
    if (selectedPendencies.length > 0) {
      onSignalPendency(selectedPendencies, observation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Análise Documental</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Tabela de Veículos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados</h3>
            <div className="overflow-x-auto border rounded-lg max-h-48">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.modelo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tipo de Pendência */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Pendência</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <span className="block truncate">{selectedPendencies.length > 0 ? `${selectedPendencies.length} selecionada(s)` : 'Selecione...'}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {pendencyOptions.map(option => (
                      <li key={option} className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100" onClick={() => handleTogglePendency(option)}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPendencies.includes(option)}
                            readOnly
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="ml-3 block font-normal truncate">{option}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {selectedPendencies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPendencies.map(pendency => (
                  <span key={pendency} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                    {pendency}
                    <button onClick={() => handleTogglePendency(pendency)} className="ml-1.5 text-blue-500 hover:text-blue-700">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Observação */}
          <div className="mb-4">
            <label htmlFor="observation" className="block text-sm font-medium text-gray-700">Observação</label>
            <textarea
              id="observation"
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleSignalPendency}
            disabled={selectedPendencies.length === 0}
            className="px-6 py-2 border rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
          >
            Sinalizar Pendência
          </button>
          <button onClick={handleApprove} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysisModal;