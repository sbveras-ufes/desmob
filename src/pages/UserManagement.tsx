import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/Header';
import UserBreadcrumb from '../components/UserBreadcrumb';
import UserFilterPanel from '../components/UserFilterPanel';
import UserTable from '../components/UserTable';
import UserModal from '../components/UserModal';
import { mockUsers } from '../data/mockUsers';
import { useUserFilter } from '../hooks/useUserFilter';
import { User, UserFilters, UserFormData } from '../types/User';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filters, setFilters] = useState<UserFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = useUserFilter(users, filters);

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleSubmitUser = (userData: UserFormData) => {
    // Verificar se está tentando criar/editar para Supervisor
    if (userData.cargo === 'Supervisor') {
      const existingSupervisor = users.find(user => 
        user.cargo === 'Supervisor' && 
        (!editingUser || user.id !== editingUser.id)
      );
      
      if (existingSupervisor) {
        alert(`Já existe um usuário com perfil Supervisor: ${existingSupervisor.nome}. Apenas um Supervisor é permitido por vez.`);
        return;
      }
    }

    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...userData,
              updatedAt: new Date().toISOString()
            }
          : user
      ));
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        cargo: userData.cargo as 'Gestor Contrato' | 'Supervisor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
    }
    
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserBreadcrumb />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Parametrização E-mail</h1>
          </div>
          
          <button
            onClick={handleCreateUser}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Usuário</span>
          </button>
        </div>

        <UserFilterPanel
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredUsers.length}</span> usuário(s)
            </p>
          </div>
          
          <UserTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleSubmitUser}
          editingUser={editingUser}
          existingUsers={users}
        />
      </main>
    </div>
  );
};

export default UserManagement;