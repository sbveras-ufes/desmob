import React from 'react';
import { Eye } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface ConcluidosTableProps {
  vehicles: ApprovalVehicle[];
  onViewVehicle: (vehicle: ApprovalVehicle) => void;
  paginationComponent?: React.ReactNode;
}

const ConcluidosTable: React.FC<ConcluidosTableProps> = ({ 
  vehicles, 
  onViewVehicle,
  paginationComponent, 
}) => {

  const getTipoAtivo = (modelo: string) => {
    const isHeavy = modelo.includes('HILUX') || 
                    modelo.includes('RANGER') || 
                    modelo.includes('AMAROK');
    return isHeavy ? 'Pesado' : 'Leve';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      // Adiciona 'T00:00:00' para garantir que a data seja interpretada como local
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return '-';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return '-';
    }
  };

  const formatKilometer = (value: number) => new Intl.NumberFormat('pt-BR').format(value);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3"></th> {/* Visualizar */}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo do ativo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Implemento</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Da Vistoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação da Vistoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da última Vistoria Aprovada</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da última Precificação</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio Atual</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Conclusão</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-sm">
                  <button onClick={() => onViewVehicle(vehicle)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.demobilizationCode || '-'}</td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.anoModelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatKilometer(vehicle.km)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{getTipoAtivo(vehicle.modelo)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">-</td> {/* Implemento */}
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.situacaoVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.classificacaoVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataVistoria)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataPrecificacao)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.descricaoCR}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataEntrega)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDateTime(vehicle.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum veículo concluído encontrado.</p>
        </div>
      )}
      {paginationComponent}
    </div>
  );
};

export default ConcluidosTable;