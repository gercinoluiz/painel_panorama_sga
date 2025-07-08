import { PrismaClient } from '../lib/generated/prisma'

export function getPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}
