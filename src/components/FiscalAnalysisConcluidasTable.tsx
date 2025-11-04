import React, { useState, useRef, useEffect } from 'react';
import { ApprovalVehicle } from '../types/Approval';
import { MoreVertical, Eye, Edit } from 'lucide-react';

interface FiscalAnalysisConcluidasTableProps {
  vehicles: ApprovalVehicle[];
  paginationComponent: React.ReactNode;
  onViewVehicle: (vehicle: ApprovalVehicle) => void;
  onEditVehicle: (vehicle: ApprovalVehicle) => void;
}

// O menu de ações foi copiado para este componente para mantê-lo independente
const ActionsMenu: React.FC<{
  vehicle: ApprovalVehicle;
  onView: (vehicle: ApprovalVehicle) => void;
  onEdit: (vehicle: ApprovalVehicle) => void;
}> = ({ vehicle, onView, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <a href="#" onClick={(e) => { e.preventDefault(); onView(vehicle); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              <Eye size={16} /> Visualizar
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onEdit(vehicle); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              <Edit size={16} /> Editar
            </a>
          </div>
        </div>
      )}
    </div>
  );
};


const FiscalAnalysisConcluidasTable: React.FC<FiscalAnalysisConcluidasTableProps> = ({ 
  vehicles, 
  paginationComponent, 
  onViewVehicle, 
  onEditVehicle 
}) => {
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF de Emplacamento</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ Proprietário</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa Proprietária</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle, index) => (
              <tr 
                key={vehicle.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                  <ActionsMenu vehicle={vehicle} onView={onViewVehicle} onEdit={onEditVehicle} />
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.ufEmplacamento || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cnpjProprietario || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.empresaProprietaria || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum veículo encontrado.</p>
        </div>
      )}
      {paginationComponent}
    </div>
  );
};

export default FiscalAnalysisConcluidasTable;