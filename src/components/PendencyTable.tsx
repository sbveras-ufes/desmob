import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Pendency } from '../types/Pendency';

interface PendencyTableProps {
  pendencies: Pendency[];
  onEdit: (pendency: Pendency) => void;
  onDelete: (id: string) => void;
}

const PendencyTable: React.FC<PendencyTableProps> = ({ pendencies, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* O cabeçalho continua "Origem" */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gera Bloqueio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendencies.map((pendency) => (
              <tr key={pendency.id}>
                {/* Corrigido de pendency.origem para pendency.tipo */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pendency.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pendency.descricao}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pendency.geraBloqueio ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {pendency.geraBloqueio ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => onEdit(pendency)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Editar">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(pendency.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendencies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma pendência cadastrada.</p>
        </div>
      )}
    </div>
  );
};

export default PendencyTable;