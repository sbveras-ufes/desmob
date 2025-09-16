import { useMemo } from 'react';
import { User, UserFilters } from '../types/User';

export const useUserFilter = (users: User[], filters: UserFilters) => {
  return useMemo(() => {
    return users.filter((user) => {
      if (filters.nome && !user.nome.toLowerCase().includes(filters.nome.toLowerCase())) {
        return false;
      }

      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }

      if (filters.cargo && user.cargo !== filters.cargo) {
        return false;
      }

      if (filters.cr && filters.cr.length > 0) {
        if (!filters.cr.some(cr => user.cr.includes(cr))) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);
};