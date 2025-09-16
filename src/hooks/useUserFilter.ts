import { useMemo } from 'react';
import { User, UserFilters } from '../types/User';

export const useUserFilter = (users: User[], filters: UserFilters) => {
  return useMemo(() => {
    return users.filter((user) => {
      // Filtro por nome
      if (filters.nome && !user.nome.toLowerCase().includes(filters.nome.toLowerCase())) {
        return false;
      }

      // Filtro por email
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }

      // Filtro por cargo
      if (filters.cargo && user.cargo !== filters.cargo) {
        return false;
      }

      // Filtro por CR
      if (filters.cr && user.cr !== filters.cr) {
        return false;
      }

      return true;
    });
  }, [users, filters]);
};