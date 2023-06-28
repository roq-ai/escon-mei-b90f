import axios from 'axios';
import queryString from 'query-string';
import { NotaFiscalInterface, NotaFiscalGetQueryInterface } from 'interfaces/nota-fiscal';
import { GetQueryInterface } from '../../interfaces';

export const getNotaFiscals = async (query?: NotaFiscalGetQueryInterface) => {
  const response = await axios.get(`/api/nota-fiscals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNotaFiscal = async (notaFiscal: NotaFiscalInterface) => {
  const response = await axios.post('/api/nota-fiscals', notaFiscal);
  return response.data;
};

export const updateNotaFiscalById = async (id: string, notaFiscal: NotaFiscalInterface) => {
  const response = await axios.put(`/api/nota-fiscals/${id}`, notaFiscal);
  return response.data;
};

export const getNotaFiscalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/nota-fiscals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNotaFiscalById = async (id: string) => {
  const response = await axios.delete(`/api/nota-fiscals/${id}`);
  return response.data;
};
