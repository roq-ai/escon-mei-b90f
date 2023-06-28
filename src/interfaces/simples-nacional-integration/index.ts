import { EmpresaInterface } from 'interfaces/empresa';
import { GetQueryInterface } from 'interfaces';

export interface SimplesNacionalIntegrationInterface {
  id?: string;
  empresa_id?: string;
  api_key: string;
  created_at?: any;
  updated_at?: any;

  empresa?: EmpresaInterface;
  _count?: {};
}

export interface SimplesNacionalIntegrationGetQueryInterface extends GetQueryInterface {
  id?: string;
  empresa_id?: string;
  api_key?: string;
}
