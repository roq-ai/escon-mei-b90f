const mapping: Record<string, string> = {
  empresas: 'empresa',
  'nota-fiscals': 'nota_fiscal',
  'simples-nacional-integrations': 'simples_nacional_integration',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
