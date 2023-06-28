import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getNotaFiscals, deleteNotaFiscalById } from 'apiSdk/nota-fiscals';
import { NotaFiscalInterface } from 'interfaces/nota-fiscal';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function NotaFiscalListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<NotaFiscalInterface[]>(
    () => '/nota-fiscals',
    () =>
      getNotaFiscals({
        relations: ['empresa'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteNotaFiscalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('nota_fiscal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/nota-fiscals/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('nota_fiscal', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Nota Fiscal
            </Text>
            <NextLink href={`/nota-fiscals/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>issue_date</Th>
                  <Th>amount</Th>
                  {hasAccess('empresa', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>empresa</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.issue_date as unknown as string}</Td>
                    <Td>{record.amount}</Td>
                    {hasAccess('empresa', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/empresas/view/${record.empresa?.id}`}>
                          {record.empresa?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('nota_fiscal', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/nota-fiscals/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('nota_fiscal', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'nota_fiscal',
  operation: AccessOperationEnum.READ,
})(NotaFiscalListPage);
