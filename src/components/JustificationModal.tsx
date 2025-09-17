import React from 'react';
import { X } from 'lucide-react';

interface JustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  justification: string;
}

const JustificationModal: React.FC<JustificationModalProps> = ({
  isOpen,
  onClose,
  justification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Justificativa da Reprovação
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 whitespace-pre-wrap">{justification}</p>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JustificationModal;