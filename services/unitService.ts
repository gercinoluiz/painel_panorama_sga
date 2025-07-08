import { getPrismaClient } from '../prisma/multiPrisma';

const unitDatabaseUrls: Record<string, string> = {
  'CASA_VERDE': process.env.DATABASE_URL_CASA_VERDE!,
  'PINHEIROS': process.env.DATABASE_URL_PINHEIROS!,
};

export function getUnitPrisma(unitId: string) {
  const url = unitDatabaseUrls[unitId];
  if (!url) throw new Error('Unidade desconhecida');
  return getPrismaClient(url);
}