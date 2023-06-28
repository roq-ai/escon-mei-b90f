import axios from 'axios';
import queryString from 'query-string';
import { EmpresaInterface, EmpresaGetQueryInterface } from 'interfaces/empresa';
import { GetQueryInterface } from '../../interfaces';

export const getEmpresas = async (query?: EmpresaGetQueryInterface) => {
  const response = await axios.get(`/api/empresas${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmpresa = async (empresa: EmpresaInterface) => {
  const response = await axios.post('/api/empresas', empresa);
  return response.data;
};

export const updateEmpresaById = async (id: string, empresa: EmpresaInterface) => {
  const response = await axios.put(`/api/empresas/${id}`, empresa);
  return response.data;
};

export const getEmpresaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/empresas/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmpresaById = async (id: string) => {
  const response = await axios.delete(`/api/empresas/${id}`);
  return response.data;
};
