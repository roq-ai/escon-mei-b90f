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
import { createNotaFiscal } from 'apiSdk/nota-fiscals';
import { Error } from 'components/error';
import { notaFiscalValidationSchema } from 'validationSchema/nota-fiscals';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EmpresaInterface } from 'interfaces/empresa';
import { getEmpresas } from 'apiSdk/empresas';
import { NotaFiscalInterface } from 'interfaces/nota-fiscal';

function NotaFiscalCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NotaFiscalInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNotaFiscal(values);
      resetForm();
      router.push('/nota-fiscals');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NotaFiscalInterface>({
    initialValues: {
      issue_date: new Date(new Date().toDateString()),
      amount: 0,
      empresa_id: (router.query.empresa_id as string) ?? null,
    },
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
            Create Nota Fiscal
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'nota_fiscal',
  operation: AccessOperationEnum.CREATE,
})(NotaFiscalCreatePage);
