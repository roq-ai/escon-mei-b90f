import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { notaFiscalValidationSchema } from 'validationSchema/nota-fiscals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.nota_fiscal
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getNotaFiscalById();
    case 'PUT':
      return updateNotaFiscalById();
    case 'DELETE':
      return deleteNotaFiscalById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNotaFiscalById() {
    const data = await prisma.nota_fiscal.findFirst(convertQueryToPrismaUtil(req.query, 'nota_fiscal'));
    return res.status(200).json(data);
  }

  async function updateNotaFiscalById() {
    await notaFiscalValidationSchema.validate(req.body);
    const data = await prisma.nota_fiscal.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteNotaFiscalById() {
    const data = await prisma.nota_fiscal.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
