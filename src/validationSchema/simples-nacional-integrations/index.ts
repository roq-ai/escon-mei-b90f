import * as yup from 'yup';

export const simplesNacionalIntegrationValidationSchema = yup.object().shape({
  api_key: yup.string().required(),
  empresa_id: yup.string().nullable(),
});
