import { useMemo } from 'react';
import { Vehicle, DemobilizationFilters } from '../types/Vehicle';

export const useVehicleFilter = (vehicles: Vehicle[], filters: DemobilizationFilters) => {
  return useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Filtro por período
      if (filters.periodoInicio || filters.periodoFim) {
        const dataPrevista = new Date(vehicle.dataPrevista);
        
        if (filters.periodoInicio) {
          const dataInicio = new Date(filters.periodoInicio);
          if (dataPrevista < dataInicio) return false;
        }
        
        if (filters.periodoFim) {
          const dataFim = new Date(filters.periodoFim);
          if (dataPrevista > dataFim) return false;
        }
      }

      // Filtro por mês
      if (filters.mes) {
        const mesVeiculo = new Date(vehicle.dataPrevista).getMonth() + 1;
        const mesFiltro = parseInt(filters.mes);
        if (mesVeiculo !== mesFiltro) return false;
      }

      // Filtro por modelo
      if (filters.modelo) {
        if (!vehicle.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) {
          return false;
        }
      }

      // Filtro por cliente
      if (filters.cliente) {
        if (!vehicle.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) {
          return false;
        }
      }

      // Filtro por CR
      if (filters.cr && filters.cr.length > 0) {
        if (!filters.cr.includes(vehicle.cr)) {
          return false;
        }
      }

      // Filtro por diretoria
      if (filters.diretoria) {
        if (vehicle.diretoria !== filters.diretoria) {
          return false;
        }
      }
      
      // Filtro por tipo de veículo
      if (filters.tipo) {
        const isHeavyVehicle = vehicle.modelo.includes('HILUX') || 
                              vehicle.modelo.includes('RANGER') || 
                              vehicle.modelo.includes('AMAROK');
        
        if (filters.tipo === 'pesado' && !isHeavyVehicle) {
          return false;
        }
        
        if (filters.tipo === 'leve' && isHeavyVehicle) {
          return false;
        }
      }

      if (filters.tipoDesmobilizacao) {
        if (vehicle.tipoDesmobilizacao !== filters.tipoDesmobilizacao) {
          return false;
        }
      }

      if (filters.patioDestino) {
        if (vehicle.patioDestino !== filters.patioDestino) {
          return false;
        }
      }

      if (filters.uf && vehicle.uf !== filters.uf) {
        return false;
      }

      if (filters.municipio && vehicle.municipio !== filters.municipio) {
        return false;
      }

      return true;
    });
  }, [vehicles, filters]);
};