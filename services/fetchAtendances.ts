import { getUnitPrisma } from './unitService'

// Lista com todas as unidades
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

export async function getTotalAttendances() {
  // Cria um cliente Prisma para cada unidade
  const prismaClients = ALL_UNITS.map((unit) => getUnitPrisma(unit))

  // Cria um array de promessas para a contagem de atendimentos
  const countPromises = prismaClients.map((client) =>
    client.atendimentos.count(),
  )

  // Executa todas as contagens em paralelo
  const counts = await Promise.all(countPromises)

  // Cria um array de promessas para desconectar os clientes
  const disconnectPromises = prismaClients.map((client) => client.$disconnect())

  // Desconecta todos os clientes em paralelo
  await Promise.all(disconnectPromises)

  // Soma todos os resultados e retorna o total
  return counts.reduce((sum, current) => sum + current, 0)
}
