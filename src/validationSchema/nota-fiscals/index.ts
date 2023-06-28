import * as yup from 'yup';

export const notaFiscalValidationSchema = yup.object().shape({
  issue_date: yup.date().required(),
  amount: yup.number().integer().required(),
  empresa_id: yup.string().nullable(),
});
