import React from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: ApprovalVehicle | null;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Aguardando aprovação':
        return 'bg-yellow-100 text-yellow-800';
      case 'Liberado para Desmobilização':
        return 'bg-green-100 text-green-800';
      case 'Reprovado':
      case 'Desmobilização Bloqueada':
        return 'bg-red-100 text-red-800';
      case 'Liberado para Transferência':
        return 'bg-blue-100 text-blue-800';
      case 'Em Manutenção':
        return 'bg-purple-100 text-purple-800';
      case 'Documentação Aprovada':
      case 'Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Documentação Pendente':
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Veículo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Cód. Desmobilização</p>
              <p className="text-gray-900">{vehicle.demobilizationCode || '-'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Situação Desmobilização</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.situacao)}`}>
                {vehicle.situacao}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-500">Placa</p>
              <p className="text-gray-900">{vehicle.placa}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Chassi</p>
              <p className="text-gray-900">{vehicle.chassi}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-gray-500">Modelo</p>
              <p className="text-gray-900">{vehicle.modelo}</p>
            </div>
          </div>

          {/* Análise Documental */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Análise Documental</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Situação</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.situacaoAnaliseDocumental)}`}>
                  {vehicle.situacaoAnaliseDocumental || '-'}
                </span>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-500">Pendências</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vehicle.tipoPendenciaDocumental && vehicle.tipoPendenciaDocumental.length > 0 ? (
                    vehicle.tipoPendenciaDocumental.map(p => (
                      <span key={p} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">{p}</span>
                    ))
                  ) : <p className="text-gray-900">-</p>}
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-500">Observação</p>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md mt-1">{vehicle.observacaoAnaliseDocumental || '-'}</p>
              </div>
            </div>
          </div>

          {/* Análise Fiscal */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Análise Fiscal</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Situação</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.situacaoAnaliseFiscal)}`}>
                  {vehicle.situacaoAnaliseFiscal || '-'}
                </span>
              </div>
               <div>
                <p className="font-medium text-gray-500">UF de Emplacamento</p>
                <p className="text-gray-900">{vehicle.ufEmplacamento || '-'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Empresa Proprietária</p>
                <p className="text-gray-900">{vehicle.empresaProprietaria || '-'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">CNPJ Proprietário</p>
                <p className="text-gray-900">{vehicle.cnpjProprietario || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-500">Pendências</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vehicle.tipoPendenciaFiscal && vehicle.tipoPendenciaFiscal.length > 0 ? (
                    vehicle.tipoPendenciaFiscal.map(p => (
                      <span key={p} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">{p}</span>
                    ))
                  ) : <p className="text-gray-900">-</p>}
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-500">Observação</p>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md mt-1">{vehicle.observacaoAnaliseFiscal || '-'}</p>
              </div>
            </div>
          </div>

          {/* Vistoria */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Vistoria</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Situação Vistoria</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.situacaoVistoria)}`}>
                  {vehicle.situacaoVistoria || '-'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-500">Data da Precificação</p>
                <p className="text-gray-900">{vehicle.dataPrecificacao ? new Date(vehicle.dataPrecificacao).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;