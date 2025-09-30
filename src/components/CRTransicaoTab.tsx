import React from 'react';
import { Download } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

interface CRTransicaoTabProps {
  vehicles: ApprovalVehicle[];
}

const CRTransicaoTab: React.FC<CRTransicaoTabProps> = ({ vehicles }) => {
  const pagination = usePagination(vehicles);

  const calculateDaysInCR = (startDate?: string) => {
    if (!startDate) return '-';
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{pagination.endIndex - pagination.startIndex}</span> de <span className="font-medium">{pagination.totalItems}</span> registro(s)
        </p>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={vehicles.length === 0}>
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição CR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Inicio CR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias no CR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Entrega</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pátio Destino</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação da Vistoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pátio da Vistoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data da Vistoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classificação da Vistoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data da Precificação</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor da Precificação</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Última Atualização</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.paginatedItems.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.placa}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.chassi}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.modelo}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.anoModelo}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.cr}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.descricaoCR}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.dataInicioCR ? new Date(vehicle.dataInicioCR).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{calculateDaysInCR(vehicle.dataInicioCR)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(vehicle.dataEntrega).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.patioDestino || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.situacaoVistoria || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.patioVistoria || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.dataVistoria ? new Date(vehicle.dataVistoria).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.classificacaoVistoria || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.dataPrecificacao ? new Date(vehicle.dataPrecificacao).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.valorPrecificacao ? vehicle.valorPrecificacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(vehicle.lastUpdated).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum veículo em CR de transição no momento.</p>
          </div>
        )}
        <Pagination 
          {...pagination}
          onItemsPerPageChange={pagination.changeItemsPerPage}
          onPageChange={pagination.goToPage}
        />
      </div>
    </div>
  );
};

export default CRTransicaoTab;