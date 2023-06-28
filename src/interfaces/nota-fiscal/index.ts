import { EmpresaInterface } from 'interfaces/empresa';
import { GetQueryInterface } from 'interfaces';

export interface NotaFiscalInterface {
  id?: string;
  empresa_id?: string;
  issue_date: any;
  amount: number;
  created_at?: any;
  updated_at?: any;

  empresa?: EmpresaInterface;
  _count?: {};
}

export interface NotaFiscalGetQueryInterface extends GetQueryInterface {
  id?: string;
  empresa_id?: string;
}
