import { useMemo } from 'react';
import { ApprovalVehicle, ApprovalFilters } from '../types/Approval';

export const useApprovalFilter = (vehicles: ApprovalVehicle[], filters: ApprovalFilters) => {
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
      if (filters.modelo && !vehicle.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) {
        return false;
      }
      if (filters.cliente && !vehicle.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) {
        return false;
      }
      if (filters.cr && filters.cr.length > 0 && !filters.cr.includes(vehicle.cr)) {
        return false;
      }
      if (filters.diretoria && vehicle.diretoria !== filters.diretoria) {
        return false;
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
      
      if (filters.tipoDesmobilizacao && vehicle.tipoDesmobilizacao !== filters.tipoDesmobilizacao) {
        return false;
      }
      
      if (filters.patioDestino && vehicle.patioDestino !== filters.patioDestino) {
        return false;
      }

      if (filters.uf && vehicle.uf !== filters.uf) {
        return false;
      }

      if (filters.municipio && vehicle.municipio !== filters.municipio) {
        return false;
      }
      
      if (filters.situacao && vehicle.situacao !== filters.situacao) {
        return false;
      }

      if (filters.comPendencias) {
        if (vehicle.situacaoAnaliseDocumental !== 'Documentação Pendente' && vehicle.situacaoAnaliseFiscal !== 'Pendente') {
          return false;
        }
      }

      if (filters.origemPendencia === 'Documental') {
        if (vehicle.situacaoAnaliseDocumental !== 'Documentação Pendente') {
          return false;
        }
      }

      if (filters.origemPendencia === 'Fiscal') {
        if (vehicle.situacaoAnaliseFiscal !== 'Pendente') {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, filters]);
};