import { NextResponse } from 'next/server'
import { getUnitPrisma } from '@/services/unitService'

const units = [
  { id: 'CASA_VERDE', name: 'Casa Verde' },
  { id: 'PINHEIROS', name: 'Pinheiros' },
  // Adicione mais unidades conforme necessário
]

export async function GET() {
  const results = await Promise.all(
    units.map(async (unit) => {
      const prisma = getUnitPrisma(unit.id)
      const count = await prisma.atendimentos.count()
      await prisma.$disconnect()
      return {
        id: unit.id,
        name: unit.name,
        atendimentos: count,
      }
    }),
  )

  return NextResponse.json(results)
}
