import { useMemo } from 'react';
import { ApprovalVehicle, ApprovalFilters } from '../types/Approval';

export const useApprovalFilter = (vehicles: ApprovalVehicle[], filters: ApprovalFilters) => {
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

      // Filtro por placa
      if (filters.placa && !vehicle.placa.toLowerCase().includes(filters.placa.toLowerCase())) {
        return false;
      }

      // Filtro por modelo
      if (filters.modelo && !vehicle.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) {
        return false;
      }

      // Filtro por cliente
      if (filters.cliente && !vehicle.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) {
        return false;
      }

      // Filtro por CR
      if (filters.cr && filters.cr.length > 0 && !filters.cr.includes(vehicle.cr)) {
        return false;
      }
      
      // Filtro por Descrição CR
      if (filters.descricaoCR && vehicle.descricaoCR !== filters.descricaoCR) {
        return false;
      }

      // Filtro por diretoria
      if (filters.diretoria && vehicle.diretoria !== filters.diretoria) {
        return false;
      }

      // Filtro por tipo (simulado baseado no modelo)
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
      
      if (filters.tipoDesmobilizacao && vehicle.tipoDesmobilizacao !== filters.tipoDesmobilizacao) {
        return false;
      }
      
      if (filters.patioDestino && vehicle.patioDestino !== filters.patioDestino) {
        return false;
      }

      if (filters.localDesmobilizacao && vehicle.localDesmobilizacao !== filters.localDesmobilizacao) {
        return false;
      }

      return true;
    });
  }, [vehicles, filters]);
};