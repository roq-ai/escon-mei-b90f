import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSimplesNacionalIntegration } from 'apiSdk/simples-nacional-integrations';
import { Error } from 'components/error';
import { simplesNacionalIntegrationValidationSchema } from 'validationSchema/simples-nacional-integrations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EmpresaInterface } from 'interfaces/empresa';
import { getEmpresas } from 'apiSdk/empresas';
import { SimplesNacionalIntegrationInterface } from 'interfaces/simples-nacional-integration';

function SimplesNacionalIntegrationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SimplesNacionalIntegrationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSimplesNacionalIntegration(values);
      resetForm();
      router.push('/simples-nacional-integrations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SimplesNacionalIntegrationInterface>({
    initialValues: {
      api_key: '',
      empresa_id: (router.query.empresa_id as string) ?? null,
    },
    validationSchema: simplesNacionalIntegrationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Simples Nacional Integration
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="api_key" mb="4" isInvalid={!!formik.errors?.api_key}>
            <FormLabel>Api Key</FormLabel>
            <Input type="text" name="api_key" value={formik.values?.api_key} onChange={formik.handleChange} />
            {formik.errors.api_key && <FormErrorMessage>{formik.errors?.api_key}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EmpresaInterface>
            formik={formik}
            name={'empresa_id'}
            label={'Select Empresa'}
            placeholder={'Select Empresa'}
            fetcher={getEmpresas}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'simples_nacional_integration',
  operation: AccessOperationEnum.CREATE,
})(SimplesNacionalIntegrationCreatePage);
