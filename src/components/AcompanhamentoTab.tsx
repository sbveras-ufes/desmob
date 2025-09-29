// src/components/AcompanhamentoTab.tsx

import React, { useState, useEffect } from 'react';
import AcompanhamentoTable from './AcompanhamentoTable';

// A interface deve ser a mesma usada no componente da tabela
interface AcompanhamentoItem {
  id: string | number;
  ativo: string;
  status: string;
  dataPrevista: string;
  responsavel: string;
}

// Dados de exemplo para simular uma resposta de API
const mockAcompanhamentoData: AcompanhamentoItem[] = [
  { id: 1, ativo: 'Notebook Dell XPS 15', status: 'Em transporte', dataPrevista: '2025-10-05', responsavel: 'Logística LTDA' },
  { id: 2, ativo: 'Monitor LG UltraWide 34"', status: 'Aguardando coleta', dataPrevista: '2025-10-02', responsavel: 'Empresa X' },
  { id: 3, ativo: 'Cadeira de Escritório Ergonômica', status: 'Entregue', dataPrevista: '2025-09-28', responsavel: 'Logística LTDA' },
  { id: 4, ativo: 'Servidor PowerEdge R740', status: 'Em avaliação técnica', dataPrevista: '2025-10-15', responsavel: 'TI Interno' },
];

const AcompanhamentoTab: React.FC = () => {
  const [data, setData] = useState<AcompanhamentoItem[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Esta função simula a busca de dados de uma API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simula um atraso de rede de 1 segundo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Em uma aplicação real, você faria a chamada à API aqui.
        // Por agora, usamos os dados de exemplo.
        setData(mockAcompanhamentoData);

      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao carregar os dados.');
        setData([]); // Garante que a tabela não quebre em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  // Função para renderizar o conteúdo com base no estado (carregando, erro, sucesso)
  const renderContent = () => {
    if (isLoading) {
      return <div className="p-4 text-center text-gray-500">Carregando dados de acompanhamento...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">Erro: {error}</div>;
    }

    // Passa os dados carregados para o componente da tabela
    return <AcompanhamentoTable data={data} />;
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Acompanhamento de Desmobilização</h2>
      {renderContent()}
    </div>
  );
};

export default AcompanhamentoTab;