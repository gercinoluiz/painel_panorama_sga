'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchUnitsData } from '@/lib/data'
import type { Unit } from '@/lib/types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import React from 'react'

const unitNames: Record<string, string> = {
  CASA_VERDE: 'Casa Verde',
  PINHEIROS: 'Pinheiros',
  MOOCA: 'Mooca',
  MBOI: 'Mboi',
  PIRITUBA: 'Pirituba',
  PARELHEIROS: 'Parelheiros',
  GUAIANASES: 'Guaianases',
  ITAIM_PAULISTA: 'Itaim Paulista',
  ERMELINO_MATARAZZO: 'Ermelino Matarazzo',
  ITAQUERA: 'Itaquera',
  ARICANDUVA: 'Aricanduva',
  '24_HORAS': '24 Horas',
}

export function DashboardTable() {
  const [units, setUnits] = useState<Unit[]>([])
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(
    {},
  )

  useEffect(() => {
    const getUnitsData = async () => {
      const data = await fetchUnitsData()
      setUnits(data)

      const initialExpandedState: Record<string, boolean> = {}
      data.forEach((unit) => {
        if (unit.isMainUnit) {
          initialExpandedState[unit.unidade] = true
        }
      })
      setExpandedUnits(initialExpandedState)
    }

    getUnitsData()

    const interval = setInterval(getUnitsData, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleExpand = (unitName: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitName]: !prev[unitName],
    }))
  }

  const getWaitTimeColor = (time?: string) => {
    if (!time || time === '00:00:00') {
      return 'text-slate-500 dark:text-slate-400 text-lg'
    }

    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes

    if (totalMinutes > 60) {
      // Vermelho para mais de 60 minutos
      return 'text-rose-600 dark:text-rose-500 font-medium text-lg'
    }
    if (totalMinutes >= 21) {
      // Amarelo para 21 a 60 minutos
      return 'text-amber-600 dark:text-amber-500 font-medium text-lg'
    }
    // Verde para até 20 minutos
    return 'text-emerald-600 dark:text-emerald-500 font-medium text-lg'
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <Table>
          <TableHeader className='bg-slate-100 dark:bg-slate-800/50'>
            <TableRow>
              <TableHead className='w-[300px] px-2 py-2 h-auto text-lg'>
                Unidade/Seção
              </TableHead>
              <TableHead className='text-center px-2 py-2 h-auto'>
                Atendimentos
              </TableHead>
              <TableHead className='text-center px-2 py-2 h-auto'>
                Maior espera
              </TableHead>
              <TableHead className='text-center h-auto py-2'>
                Aguardando <br />0 a 20 min 🥳
              </TableHead>
              <TableHead className='text-center h-auto py-2'>
                Aguardando <br />
                21 a 60 min ⚠️
              </TableHead>
              <TableHead className='text-center h-auto py-2'>
                Aguardando <br />
                Acima de 60 min 🚨
              </TableHead>
              <TableHead className='text-center h-auto py-2'>
                Em atendimento 👩🏻‍💻
              </TableHead>
              <TableHead className='text-center h-auto py-2'>
                Aguardando ⏳
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center py-4'>
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit) => {
                // --- LÓGICA ADICIONADA AQUI ---
                // Calcula o maior tempo de espera de todas as seções da unidade.
                const overallMaxWaitTime = unit.secretarias.reduce(
                  (max, sec) => {
                    return sec.maxWaitTime > max ? sec.maxWaitTime : max
                  },
                  '00:00:00',
                )

                return (
                  <React.Fragment key={unit.unidade}>
                    <TableRow
                      className={`cursor-pointer bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 ${
                        unit.secretarias.length === 0 ? 'opacity-50' : ''
                      }`}
                      onClick={() => toggleExpand(unit.unidade)}
                    >
                      <TableCell className='font-medium flex items-center gap-2 text-lg py-1'>
                        {expandedUnits[unit.unidade] ? (
                          <ChevronDown className='h-4 w-4 text-slate-500' />
                        ) : (
                          <ChevronRight className='h-4 w-4 text-slate-500' />
                        )}
                        {unitNames[unit.unidade]?.toUpperCase() || unit.unidade}
                        {unit.secretarias.length === 0 && ` 😵`}
                        <Badge variant='outline' className='ml-2'>
                          {unit.totalServices}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center font-medium text-lg py-1'>
                        {unit.secretarias.reduce(
                          (sum, sec) => sum + sec.total,
                          0,
                        )}
                      </TableCell>
                      {/* Célula corrigida: exibe o maior tempo calculado */}
                      <TableCell
                        className={`text-center text-lg py-1 ${getWaitTimeColor(
                          overallMaxWaitTime,
                        )}`}
                      >
                        <Badge
                          variant='outline'
                          className={getWaitTimeColor(overallMaxWaitTime)}
                        >
                          {overallMaxWaitTime}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center text-lg py-1'>
                        <Badge
                          variant='outline'
                          className='text-emerald-600 dark:text-emerald-500 font-medium text-lg'
                        >
                          {unit.secretarias
                            .map((sec) => sec.zero_to_twenty)
                            .reduce((sum, val) => sum + val, 0)}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center text-lg py-1'>
                        <Badge
                          variant='outline'
                          className='text-yellow-600 dark:text-yellow-500 font-medium text-lg'
                        >
                          {unit.secretarias
                            .map((sec) => sec.twenty_one_to_sixty)
                            .reduce((sum, val) => sum + val, 0)}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center text-lg py-1'>
                        <Badge
                          variant='outline'
                          className='text-red-600 dark:text-red-500 font-medium text-lg'
                        >
                          {unit.secretarias
                            .map((sec) => sec.above_sixty)
                            .reduce((sum, val) => sum + val, 0)}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center text-lg py-1'>
                        {unit.secretarias
                          .map((sec) => sec.in_attendance)
                          .reduce((sum, val) => sum + val, 0)}
                      </TableCell>
                      <TableCell className='text-center text-lg py-1'>
                        {unit.secretarias
                          .map((sec) => sec.waiting)
                          .reduce((sum, val) => sum + val, 0)}
                      </TableCell>
                    </TableRow>

                    {expandedUnits[unit.unidade] &&
                      unit.secretarias.map((sec) => (
                        <TableRow
                          key={sec.section}
                          className='odd:bg-slate-50 even:bg-white dark:odd:bg-slate-800/10 dark:even:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-800/20'
                        >
                          <TableCell className='pl-10 text-base py-1 leading-tight'>
                            {sec.section}
                          </TableCell>
                          <TableCell className='text-center text-base py-1 leading-tight'>
                            {sec.total}
                          </TableCell>
                          <TableCell className='text-center text-base py-1 leading-tight'>
                            <Badge
                              variant='outline'
                              className={getWaitTimeColor(sec.maxWaitTime)}
                            >
                              {sec.maxWaitTime || '00:00:00'}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-center text-base py-1 leading-tight'>
                            <Badge
                              variant='outline'
                              className='text-emerald-600 dark:text-emerald-500 font-medium'
                            >
                              {sec.zero_to_twenty}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-center py-1 leading-tight'>
                            <Badge
                              variant='outline'
                              className='text-yellow-600 dark:text-yellow-500 font-medium'
                            >
                              {sec.twenty_one_to_sixty}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-center py-1 leading-tight'>
                            <Badge
                              variant='outline'
                              className='text-red-600 dark:text-red-500 font-medium'
                            >
                              {sec.above_sixty}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-center text-base py-1 leading-tight'>
                            {sec.in_attendance}
                          </TableCell>
                          <TableCell className='text-center text-base py-1 leading-tight'>
                            {sec.waiting}
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
