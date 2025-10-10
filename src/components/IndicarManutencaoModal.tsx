import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface IndicarManutencaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  onConfirm: () => void;
}

const IndicarManutencaoModal: React.FC<IndicarManutencaoModalProps> = ({ isOpen, onClose, vehicles, onConfirm }) => {
  const [tipoManutencao, setTipoManutencao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setDataInicio(`${year}-${month}-${day}`);
    } else {
      setTipoManutencao('');
      setObservacao('');
      setDataInicio('');
      setEmails([]);
      setEmailInput('');
      setEmailError('');
    }
  }, [isOpen]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    const newEmail = emailInput.trim();

    if (newEmail) {
      if (!isValidEmail(newEmail)) {
        setEmailError('Por favor, insira um e-mail válido.');
        return;
      }
      if (emails.includes(newEmail)) {
        setEmailError('Este e-mail já foi adicionado.');
        return;
      }
      setEmails([...emails, newEmail]);
      setEmailInput('');
      setEmailError('');
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      handleAddEmail();
    }
  };
  
  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Indicar Manutenção</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados</h3>
            <div className="overflow-x-auto border rounded-lg max-h-48">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.modelo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              E-mails para retorno <span className="text-gray-500">(Opcional)</span>
            </label>
            <div className="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500 flex flex-wrap items-center gap-2">
              {emails.map(email => (
                <span key={email} className="flex items-center gap-1 bg-gray-200 text-sm rounded-md px-2 py-1">
                  {email}
                  <button type="button" onClick={() => handleRemoveEmail(email)} className="text-gray-600 hover:text-black">
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onKeyDown={handleEmailKeyDown}
                onBlur={handleAddEmail}
                className="flex-grow bg-transparent outline-none text-sm"
                placeholder="Informar e-mails"
              />
            </div>
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label htmlFor="dataInicioManutencao" className="block text-sm font-medium text-gray-700 mb-2">Data Início Manutenção</label>
                <input
                  id="dataInicioManutencao"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div>
              <label htmlFor="tipoManutencao" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Manutenção</label>
              <select
                id="tipoManutencao"
                value={tipoManutencao}
                onChange={(e) => setTipoManutencao(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecione um tipo</option>
                <option value="Fiscal">Fiscal</option>
                <option value="Documental">Documental</option>
                <option value="Vistoria">Vistoria</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="observacao" className="block text-sm font-medium text-gray-700">Observação</label>
            <textarea
              id="observacao"
              rows={3}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Voltar</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-blue-600 text-white rounded-md">Indicar Manutenção</button>
        </div>
      </div>
    </div>
  );
};

export default IndicarManutencaoModal;