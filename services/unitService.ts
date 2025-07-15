import { getPrismaClient } from '../prisma/multiPrisma'

const unitDatabaseUrls: Record<string, string> = {
  CASA_VERDE: process.env.DATABASE_URL_CASA_VERDE!,
  PINHEIROS: process.env.DATABASE_URL_PINHEIROS!,
  MOOCA: process.env.DATABASE_URL_MOOCA!,
  MBOI: process.env.DATABASE_URL_MBOI!,
  PIRITUBA: process.env.DATABASE_URL_PIRITUBA!,
  PARELHEIROS: process.env.DATABASE_URL_PARELHEIROS!,
  GUAIANASES: process.env.DATABASE_URL_GUAIANASES!,
  ITAIM_PAULISTA: process.env.DATABASE_URL_ITAIM_PAULISTA!,
  ERMELINO_MATARAZZO: process.env.DATABASE_URL_ERMELINO_MATARAZZO!,
  ITAQUERA: process.env.DATABASE_URL_ITAQUERA!,
  ARICANDUVA: process.env.DATABASE_URL_ARICANDUVA!,
  '24_HORAS': process.env.DATABASE_URL_24_HORAS!,
}

export function getUnitPrisma(unitId: string) {
  const url = unitDatabaseUrls[unitId]
  if (!url) throw new Error('Unidade desconhecida')
  return getPrismaClient(url)
}
