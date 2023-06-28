import { NotaFiscalInterface } from 'interfaces/nota-fiscal';
import { SimplesNacionalIntegrationInterface } from 'interfaces/simples-nacional-integration';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmpresaInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  nota_fiscal?: NotaFiscalInterface[];
  simples_nacional_integration?: SimplesNacionalIntegrationInterface[];
  user?: UserInterface;
  _count?: {
    nota_fiscal?: number;
    simples_nacional_integration?: number;
  };
}

export interface EmpresaGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
