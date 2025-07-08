import { getUnitPrisma } from './unitService'

type SectionResult = { unidade: string; section: string; total: number }

const RAW_SQL = `
  SELECT 
    LEFT(s.nome, LOCATE(' ', s.nome) - 1) AS prefixo,
    COUNT(a.id) AS total
  FROM 
    atendimentos a
  JOIN 
    servicos s ON a.servico_id = s.id
  GROUP BY 
    LEFT(s.nome, LOCATE(' ', s.nome) - 1)
  ORDER BY 
    total DESC
`

export async function getAttendancesBySection() {
  const units = ['CASA_VERDE', 'PINHEIROS']
  const results: SectionResult[] = []

  for (const unit of units) {
    const prisma = getUnitPrisma(unit)
    // @ts-ignore
    const rows: Array<{ prefixo: string; total: number }> =
      await prisma.$queryRawUnsafe(RAW_SQL)
    await prisma.$disconnect()
    for (const row of rows) {
      if (!row.prefixo) continue
      results.push({
        unidade: unit,
        section: row.prefixo,
        total: Number(row.total),
      })
    }
  }

  // Agrupa por unidade
  const grouped = units.map((unidade) => ({
    unidade,
    secretarias: results
      .filter((r) => r.unidade === unidade)
      .map(({ section, total }) => ({ section, total })),
  }))

  return grouped
}
