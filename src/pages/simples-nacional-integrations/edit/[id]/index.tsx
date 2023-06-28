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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import {
  getSimplesNacionalIntegrationById,
  updateSimplesNacionalIntegrationById,
} from 'apiSdk/simples-nacional-integrations';
import { Error } from 'components/error';
import { simplesNacionalIntegrationValidationSchema } from 'validationSchema/simples-nacional-integrations';
import { SimplesNacionalIntegrationInterface } from 'interfaces/simples-nacional-integration';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EmpresaInterface } from 'interfaces/empresa';
import { getEmpresas } from 'apiSdk/empresas';

function SimplesNacionalIntegrationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SimplesNacionalIntegrationInterface>(
    () => (id ? `/simples-nacional-integrations/${id}` : null),
    () => getSimplesNacionalIntegrationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SimplesNacionalIntegrationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSimplesNacionalIntegrationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/simples-nacional-integrations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SimplesNacionalIntegrationInterface>({
    initialValues: data,
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
            Edit Simples Nacional Integration
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'simples_nacional_integration',
  operation: AccessOperationEnum.UPDATE,
})(SimplesNacionalIntegrationEditPage);
