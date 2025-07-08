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
  // adicione mais se necessário
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

      // Set initial expanded state for main units
      const initialExpandedState: Record<string, boolean> = {}
      data.forEach((unit) => {
        if (unit.isMainUnit) {
          initialExpandedState[unit.id] = true
        }
      })
      setExpandedUnits(initialExpandedState)
    }

    getUnitsData()

    // Refresh data every 60 seconds
    const interval = setInterval(getUnitsData, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleExpand = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }))
  }

  const getWaitTimeColor = (time?: string) => {
    if (!time || time === '00:00:00')
      return 'text-slate-500 dark:text-slate-400'

    const [hours, minutes] = time.split(':').map(Number)

    if (hours > 0 || minutes > 45)
      return 'text-rose-600 dark:text-rose-500 font-medium'
    if (minutes > 30) return 'text-amber-600 dark:text-amber-500 font-medium'
    return 'text-emerald-600 dark:text-emerald-500 font-medium'
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <Table>
          <TableHeader className='bg-slate-100 dark:bg-slate-800/50'>
            <TableRow>
              <TableHead className='w-[300px]'>Unidade/Seção</TableHead>
              <TableHead className='text-center'>Atendimentos</TableHead>
              <TableHead className='text-center'>Espera real</TableHead>
              <TableHead className='text-center'>0 a 30 min</TableHead>
              <TableHead className='text-center'>30 a 45 min</TableHead>
              <TableHead className='text-center'>Acima de 45 min</TableHead>
              <TableHead className='text-center'>Em atendimento</TableHead>
              <TableHead className='text-center'>Aguardando</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center'>
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit) => (
                <React.Fragment key={unit.id}>
                  <TableRow
                    className='cursor-pointer bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                    onClick={() => toggleExpand(unit.id)}
                  >
                    <TableCell className='font-medium flex items-center gap-2'>
                      {expandedUnits[unit.id] ? (
                        <ChevronDown className='h-4 w-4 text-slate-500' />
                      ) : (
                        <ChevronRight className='h-4 w-4 text-slate-500' />
                      )}
                      {unitNames[unit.unidade].toUpperCase() || unit.unidade}
                      <Badge variant='outline' className='ml-2'>
                        {unit.totalServices}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center font-medium'>
                      {/* Soma total de atendimentos da unidade */}
                      {unit.secretarias.reduce(
                        (sum, sec) => sum + sec.total,
                        0,
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-center ${getWaitTimeColor(
                        unit.waitTime,
                      )}`}
                    >
                      {unit.waitTime || '00:00:00'}
                    </TableCell>
                    <TableCell className='text-center'>
                      {unit.under30min}
                    </TableCell>
                    <TableCell className='text-center'>
                      {unit.between30and45min}
                    </TableCell>
                    <TableCell className='text-center'>
                      {unit.above45min}
                    </TableCell>
                    <TableCell className='text-center'>
                      {unit.inService}
                    </TableCell>
                    <TableCell className='text-center'>
                      {unit.waiting}
                    </TableCell>
                  </TableRow>
                  {expandedUnits[unit.id] &&
                    unit.secretarias.map((sec) => (
                      <TableRow
                        key={sec.section}
                        className='odd:bg-slate-50 even:bg-white dark:odd:bg-slate-800/10 dark:even:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-800/20'
                      >
                        <TableCell className='pl-10'>{sec.section}</TableCell>
                        <TableCell className='text-center'>
                          {sec.total}
                        </TableCell>
                        {/* ...outras colunas em branco ou com dados específicos da secretaria... */}
                        <TableCell
                          className='text-center'
                          colSpan={6}
                        ></TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
