import React from 'react';
import { Download } from 'lucide-react';

const CRTransicaoTab: React.FC = () => {
  // Mock data length for demonstration purposes
  const dataLength = 0;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{dataLength}</span> registro(s)
        </p>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={dataLength === 0}>
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">CR de Transição</h2>
        <p className="text-gray-600">
          O conteúdo da aba de CR de Transição será implementado aqui.
        </p>
      </div>
    </div>
  );
};

export default CRTransicaoTab;