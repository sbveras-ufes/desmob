// src/components/AcompanhamentoTable.tsx

import React from 'react';

// Define a interface para a estrutura dos dados que a tabela espera.
// Você pode ajustar isso para corresponder aos seus dados reais.
interface AcompanhamentoItem {
  id: string | number;
  ativo: string;
  status: string;
  dataPrevista: string;
  responsavel: string;
}

interface AcompanhamentoTableProps {
  data?: AcompanhamentoItem[]; // A prop 'data' é opcional
}

const AcompanhamentoTable: React.FC<AcompanhamentoTableProps> = ({ data = [] }) => {
  // CORREÇÃO: Ao usar "data = []", garantimos que 'data' nunca será 'undefined'.
  // Se nenhuma prop 'data' for passada, 'data' será um array vazio.

  // Se não houver dados, exibe uma mensagem amigável.
  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum item para acompanhamento encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Ativo</th>
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Data Prevista</th>
            <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Responsável</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b text-sm text-gray-700">{item.ativo}</td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">{item.status}</td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">{item.dataPrevista}</td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">{item.responsavel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcompanhamentoTable;