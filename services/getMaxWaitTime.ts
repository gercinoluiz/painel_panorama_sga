import { getUnitPrisma } from './unitService'

// Define ALL_UNITS locally to prevent circular dependencies.
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
// SQL Definitivo: Filtra por status para garantir que apenas atendimentos
// ativos e válidos sejam considerados no cálculo do tempo de espera.
const RAW_SQL = `
  SELECT
      LEFT(s.nome, LOCATE(' ', s.nome) - 1) AS section,
      SEC_TO_TIME(
          MAX(
              TIMESTAMPDIFF(
                  SECOND,
                  CONVERT_TZ(a.dt_cheg, 'America/Sao_Paulo', 'UTC'),
                  UTC_TIMESTAMP()
              )
          )
      ) AS max_wait_time
  FROM
      atendimentos a
  JOIN
      servicos s ON a.servico_id = s.id
  WHERE
      -- ESTA É A MUDANÇA PRINCIPAL: Considerar apenas quem está aguardando.
      a.status = 1 
      AND LEFT(s.nome, LOCATE(' ', s.nome) - 1) IS NOT NULL 
      AND LENGTH(LEFT(s.nome, LOCATE(' ', s.nome) - 1)) > 0
  GROUP BY
      section;
`

type MaxWaitTimeResult = {
  section: string | null
  max_wait_time: Date | null
}

export async function getMaxWaitTime(): Promise<
  Record<string, Record<string, Date | null>>
> {
  const prismaClients = ALL_UNITS.map((unit) => getUnitPrisma(unit))

  const queryPromises = prismaClients.map((client) =>
    client.$queryRawUnsafe<MaxWaitTimeResult[]>(RAW_SQL),
  )

  const settledResults = await Promise.allSettled(queryPromises)

  const disconnectPromises = prismaClients.map((client) => client.$disconnect())
  await Promise.all(disconnectPromises)

  return ALL_UNITS.reduce((unitAcc, unit, index) => {
    const result = settledResults[index]
    const sectionTimes: Record<string, Date | null> = {}

    if (result.status === 'fulfilled') {
      for (const row of result.value) {
        if (row.section) {
          sectionTimes[row.section] = row.max_wait_time
        }
      }
    } else {
      console.error(
        `Failed to fetch max wait times for unit ${unit}:`,
        result.reason,
      )
    }

    unitAcc[unit] = sectionTimes
    return unitAcc
  }, {} as Record<string, Record<string, Date | null>>)
}
