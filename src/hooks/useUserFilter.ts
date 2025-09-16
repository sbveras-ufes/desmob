import { useMemo } from 'react';
import { User, UserFilters } from '../types/User';

export const useUserFilter = (users: User[], filters: UserFilters) => {
  return useMemo(() => {
    return users.filter((user) => {
      // Filtro por nome
      if (filters.nome) {
        if (!user.nome.toLowerCase().includes(filters.nome.toLowerCase())) {
          return false;
        }
      }

      // Filtro por email
      if (filters.email) {
        if (!user.email.toLowerCase().includes(filters.email.toLowerCase())) {
          return false;
        }
      }

      // Filtro por cargo
      if (filters.cargo) {
        if (user.cargo !== filters.cargo) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);
};