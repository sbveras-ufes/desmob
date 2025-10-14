import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import { Pendency } from '../types/Pendency';
import PendencyBreadcrumb from '../components/PendencyBreadcrumb';
import PendencyTable from '../components/PendencyTable';
import PendencyModal from '../components/PendencyModal';

interface PendencyManagementPageProps {
  pendencies: Pendency[];
  onUpdatePendencies: (pendencies: Pendency[]) => void;
}

const PendencyManagementPage: React.FC<PendencyManagementPageProps> = ({ pendencies, onUpdatePendencies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPendency, setEditingPendency] = useState<Pendency | null>(null);

  const handleOpenModal = (pendency: Pendency | null = null) => {
    setEditingPendency(pendency);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPendency(null);
    setIsModalOpen(false);
  };

  const handleSavePendency = (formData: Omit<Pendency, 'id'>) => {
    if (editingPendency) {
      const updatedPendencies = pendencies.map(p =>
        p.id === editingPendency.id ? { ...editingPendency, ...formData } : p
      );
      onUpdatePendencies(updatedPendencies);
    } else {
      const newPendency: Pendency = {
        id: `pendency-${Date.now()}`,
        ...formData,
      };
      onUpdatePendencies([...pendencies, newPendency]);
    }
    handleCloseModal();
  };

  const handleDeletePendency = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pendência?')) {
      onUpdatePendencies(pendencies.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PendencyBreadcrumb />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tipo de Pendência</h1>
          <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus size={20} />
            <span>Nova Pendência</span>
          </button>
        </div>

        <PendencyTable
          pendencies={pendencies}
          onEdit={handleOpenModal}
          onDelete={handleDeletePendency}
        />

        <PendencyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSavePendency}
          editingPendency={editingPendency}
        />
      </main>
    </div>
  );
};

export default PendencyManagementPage;