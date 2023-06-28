import axios from 'axios';
import queryString from 'query-string';
import {
  SimplesNacionalIntegrationInterface,
  SimplesNacionalIntegrationGetQueryInterface,
} from 'interfaces/simples-nacional-integration';
import { GetQueryInterface } from '../../interfaces';

export const getSimplesNacionalIntegrations = async (query?: SimplesNacionalIntegrationGetQueryInterface) => {
  const response = await axios.get(
    `/api/simples-nacional-integrations${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const createSimplesNacionalIntegration = async (
  simplesNacionalIntegration: SimplesNacionalIntegrationInterface,
) => {
  const response = await axios.post('/api/simples-nacional-integrations', simplesNacionalIntegration);
  return response.data;
};

export const updateSimplesNacionalIntegrationById = async (
  id: string,
  simplesNacionalIntegration: SimplesNacionalIntegrationInterface,
) => {
  const response = await axios.put(`/api/simples-nacional-integrations/${id}`, simplesNacionalIntegration);
  return response.data;
};

export const getSimplesNacionalIntegrationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/simples-nacional-integrations/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteSimplesNacionalIntegrationById = async (id: string) => {
  const response = await axios.delete(`/api/simples-nacional-integrations/${id}`);
  return response.data;
};
