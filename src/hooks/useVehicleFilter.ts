import { useMemo } from 'react';
import { Vehicle, DemobilizationFilters } from '../types/Vehicle';

export const useVehicleFilter = (vehicles: Vehicle[], filters: DemobilizationFilters) => {
  return useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (filters.chassi && filters.chassi.length > 0 && !filters.chassi.includes(vehicle.chassi)) {
        return false;
      }
      if (filters.placa && filters.placa.length > 0 && !filters.placa.includes(vehicle.placa)) {
        return false;
      }
      if (filters.anoModelo && !vehicle.anoModelo.includes(filters.anoModelo)) {
        return false;
      }
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
      if (filters.entregaInicio || filters.entregaFim) {
        const dataEntrega = new Date(vehicle.dataEntrega);

        if (filters.entregaInicio) {
          const dataInicio = new Date(filters.entregaInicio);
          if (dataEntrega < dataInicio) return false;
        }

        if (filters.entregaFim) {
          const dataFim = new Date(filters.entregaFim);
          if (dataEntrega > dataFim) return false;
        }
      }
      if (filters.mes) {
        const mesVeiculo = new Date(vehicle.dataPrevista).getMonth() + 1;
        const mesFiltro = parseInt(filters.mes);
        if (mesVeiculo !== mesFiltro) return false;
      }
      if (filters.modelo) {
        if (!vehicle.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) {
          return false;
        }
      }
      if (filters.cliente) {
        if (!vehicle.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) {
          return false;
        }
      }
      if (filters.cr && filters.cr.length > 0) {
        if (!filters.cr.includes(vehicle.cr)) {
          return false;
        }
      }
      if (filters.diretoria) {
        if (vehicle.diretoria !== filters.diretoria) {
          return false;
        }
      }
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