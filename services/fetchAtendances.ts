import { getUnitPrisma } from './unitService'

export async function getTotalAttendances() {
  const prisma_CASA_VERDE = getUnitPrisma('CASA_VERDE')
  const prisma_PINHEIROS = getUnitPrisma('PINHEIROS')

  const [count01, count02] = await Promise.all([
    prisma_CASA_VERDE.atendimentos.count(),
    prisma_PINHEIROS.atendimentos.count(),
  ])

  await Promise.all([prisma_CASA_VERDE.$disconnect(), prisma_PINHEIROS.$disconnect()])

  return count01 + count02
}
