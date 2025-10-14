import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Pendency } from '../types/Pendency';

interface PendencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<Pendency, 'id'>) => void;
  editingPendency: Pendency | null;
}

const PendencyModal: React.FC<PendencyModalProps> = ({ isOpen, onClose, onSubmit, editingPendency }) => {
  const [formData, setFormData] = useState({
    origem: 'Documental' as 'Fiscal' | 'Documental',
    descricao: '',
    geraBloqueio: false,
  });

  useEffect(() => {
    if (editingPendency) {
      setFormData({
        origem: editingPendency.origem,
        descricao: editingPendency.descricao,
        geraBloqueio: editingPendency.geraBloqueio,
      });
    } else {
      setFormData({
        origem: 'Documental',
        descricao: '',
        geraBloqueio: false,
      });
    }
  }, [editingPendency, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{editingPendency ? 'Editar' : 'Nova'} Pendência</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="origem" className="block text-sm font-medium text-gray-700">Origem da Pendência</label>
            <select
              id="origem"
              value={formData.origem}
              onChange={(e) => setFormData({ ...formData, origem: e.target.value as 'Fiscal' | 'Documental' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option>Documental</option>
              <option>Fiscal</option>
            </select>
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição da Pendência</label>
            <input
              type="text"
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="geraBloqueio" className="text-sm font-medium text-gray-700">Gera Bloqueio?</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, geraBloqueio: !formData.geraBloqueio })}
              className={`${
                formData.geraBloqueio ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11 ml-4`}
            >
              <span className={`${
                  formData.geraBloqueio ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </button>
            <span className="ml-3 text-sm">{formData.geraBloqueio ? 'Sim' : 'Não'}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default PendencyModal;