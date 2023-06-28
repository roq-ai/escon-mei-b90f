import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { empresaValidationSchema } from 'validationSchema/empresas';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEmpresas();
    case 'POST':
      return createEmpresa();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmpresas() {
    const data = await prisma.empresa
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'empresa'));
    return res.status(200).json(data);
  }

  async function createEmpresa() {
    await empresaValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.nota_fiscal?.length > 0) {
      const create_nota_fiscal = body.nota_fiscal;
      body.nota_fiscal = {
        create: create_nota_fiscal,
      };
    } else {
      delete body.nota_fiscal;
    }
    if (body?.simples_nacional_integration?.length > 0) {
      const create_simples_nacional_integration = body.simples_nacional_integration;
      body.simples_nacional_integration = {
        create: create_simples_nacional_integration,
      };
    } else {
      delete body.simples_nacional_integration;
    }
    const data = await prisma.empresa.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
