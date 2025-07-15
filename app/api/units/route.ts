import { getAttendancesBySection } from '@/services/getAttendancesBySection'
import { getMaxWaitTime } from '@/services/getMaxWaitTime'
import { NextResponse } from 'next/server'

/**
 * Formata um objeto Date ou uma string de data para o formato HH:MM:SS.
 * @param timeValue O valor de data/hora a ser formatado.
 * @returns Uma string em formato HH:MM:SS.
 */
function formatTime(timeValue: Date | string | null): string {
  if (!timeValue) {
    return '00:00:00'
  }

  try {
    const date = new Date(timeValue)
    if (isNaN(date.getTime())) {
      return '00:00:00'
    }

    // Usa getUTC para ignorar o fuso horário e pegar o tempo puro.
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('Error formatting time:', error)
    return '00:00:00'
  }
}

export async function GET() {
  const [sectionsByUnit, waitTimesByUnit] = await Promise.all([
    getAttendancesBySection(),
    getMaxWaitTime(),
  ])

  const mergedData = sectionsByUnit.map((unit) => {
    const unitWaitTimes = waitTimesByUnit[unit.unidade] || {}

    const updatedSecretarias = unit.secretarias.map((secretaria) => ({
      ...secretaria,
      // Agora o formatador funciona corretamente com o objeto Date.
      maxWaitTime: formatTime(unitWaitTimes[secretaria.section]),
    }))

    return {
      unidade: unit.unidade,
      secretarias: updatedSecretarias,
    }
  })

  return NextResponse.json({
    sections: mergedData,
  })
}
