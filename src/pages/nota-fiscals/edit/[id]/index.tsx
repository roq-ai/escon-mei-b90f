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
import { getNotaFiscalById, updateNotaFiscalById } from 'apiSdk/nota-fiscals';
import { Error } from 'components/error';
import { notaFiscalValidationSchema } from 'validationSchema/nota-fiscals';
import { NotaFiscalInterface } from 'interfaces/nota-fiscal';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EmpresaInterface } from 'interfaces/empresa';
import { getEmpresas } from 'apiSdk/empresas';

function NotaFiscalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NotaFiscalInterface>(
    () => (id ? `/nota-fiscals/${id}` : null),
    () => getNotaFiscalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: NotaFiscalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateNotaFiscalById(id, values);
      mutate(updated);
      resetForm();
      router.push('/nota-fiscals');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<NotaFiscalInterface>({
    initialValues: data,
    validationSchema: notaFiscalValidationSchema,
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
            Edit Nota Fiscal
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
            <FormControl id="issue_date" mb="4">
              <FormLabel>Issue Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.issue_date ? new Date(formik.values?.issue_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('issue_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                name="amount"
                value={formik.values?.amount}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
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
  entity: 'nota_fiscal',
  operation: AccessOperationEnum.UPDATE,
})(NotaFiscalEditPage);
