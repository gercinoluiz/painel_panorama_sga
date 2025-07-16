import { getUnitPrisma } from './unitService'

// A lista de unidades, definida localmente para evitar problemas de import.
const ALL_UNITS = [
  'CASA_VERDE',
  'PINHEIROS',
  'MOOCA',
  'MBOI',
  'PIRITUBA',
  'PARELHEIROS',
  'GUAIANASES',
  'ITAIM_PAULISTA',
  'ERMELINO_MATARAZZO',
  'ITAQUERA',
  'ARICANDUVA',
  '24_HORAS',
]

type SectionData = {
  section: string
  total: number
  zero_to_twenty: number
  twenty_one_to_sixty: number
  above_sixty: number
  in_attendance: number
  waiting: number
}

type UnitData = {
  unidade: string
  secretarias: SectionData[]
}

type RawQueryResult = {
  section: string
  total: bigint
  range_0_20: number | null
  range_21_60: number | null
  range_above_60: number | null
  in_attendance: number | null
  waiting: number | null
}

// SQL Corrigido: Removido CONVERT_TZ e usando DATE_SUB para ajustar o fuso horário.
const RAW_SQL = `
  SELECT
    LEFT(s.nome, LOCATE(' ', s.nome) - 1) AS section,
    COUNT(a.dt_ini) AS total,
    SUM(CASE
        WHEN a.status = 1 AND TIMESTAMPDIFF(MINUTE, a.dt_cheg, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 HOUR)) BETWEEN 0 AND 20 THEN 1
        ELSE 0
    END) AS range_0_20,
    SUM(CASE
        WHEN a.status = 1 AND TIMESTAMPDIFF(MINUTE, a.dt_cheg, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 HOUR)) BETWEEN 21 AND 60 THEN 1
        ELSE 0
    END) AS range_21_60,
    SUM(CASE
        WHEN a.status = 1 AND TIMESTAMPDIFF(MINUTE, a.dt_cheg, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 HOUR)) > 60 THEN 1
        ELSE 0
    END) AS range_above_60,
    SUM(CASE WHEN a.status IN (2, 3) THEN 1 ELSE 0 END) AS in_attendance,
    SUM(CASE WHEN a.status = 1 THEN 1 ELSE 0 END) AS waiting
  FROM
    atendimentos a
  JOIN
    servicos s ON a.servico_id = s.id
  GROUP BY
    section
  HAVING
    section IS NOT NULL AND LENGTH(section) > 0
  ORDER BY
    total DESC
`

/**
 * Recupera os dados de atendimento agrupados por seção para múltiplas unidades.
 */
export async function getAttendancesBySection(): Promise<UnitData[]> {
  const allUnitsData: UnitData[] = []

  for (const unit of ALL_UNITS) {
    const prisma = getUnitPrisma(unit)
    try {
      const rows: RawQueryResult[] = await prisma.$queryRawUnsafe(RAW_SQL)

      const secretarias: SectionData[] = rows.map((row) => ({
        section: row.section,
        total: Number(row.total),
        zero_to_twenty: Number(row.range_0_20) || 0,
        twenty_one_to_sixty: Number(row.range_21_60) || 0,
        above_sixty: Number(row.range_above_60) || 0,
        in_attendance: Number(row.in_attendance) || 0,
        waiting: Number(row.waiting) || 0,
      }))

      allUnitsData.push({
        unidade: unit,
        secretarias,
      })
    } catch (error) {
      console.error(`Failed to fetch attendance data for unit ${unit}:`, error)
      allUnitsData.push({
        unidade: unit,
        secretarias: [],
      })
    } finally {
      await prisma.$disconnect()
    }
  }

  return allUnitsData
}
