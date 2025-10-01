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

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{pagination.endIndex > 0 ? pagination.endIndex - pagination.startIndex : 0}</span> de <span className="font-medium">{pagination.totalItems}</span> registro(s)
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
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chassi</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano/Modelo</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CR</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição CR</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Inicio CR</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias no CR</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio Destino</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação da Vistoria</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio da Vistoria</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Vistoria</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação da Vistoria</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Precificação</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor da Precificação</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Última Atualização</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável pela atualização</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.paginatedItems.map((vehicle, index) => (
                <tr key={vehicle.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.chassi}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.anoModelo}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.descricaoCR}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.dataInicioCR ? new Date(vehicle.dataInicioCR).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{calculateDaysInCR(vehicle.dataInicioCR)}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{new Date(vehicle.dataEntrega).toLocaleDateString('pt-BR')}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioDestino || '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.situacaoVistoria || '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioVistoria || '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.dataVistoria ? new Date(vehicle.dataVistoria).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.classificacaoVistoria || '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.dataPrecificacao ? new Date(vehicle.dataPrecificacao).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.valorPrecificacao ? vehicle.valorPrecificacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.lastUpdated ? formatDateTime(vehicle.lastUpdated) : '-'}</td>
                  <td className="px-2 py-2 text-sm text-gray-500">{vehicle.responsavelAtualizacao || '-'}</td>
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