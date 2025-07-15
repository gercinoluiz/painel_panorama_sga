import { Suspense } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardTable } from '@/components/dashboard-table'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import Image from 'next/image'

import logo_prodam from '../assets/logo-prodam.png'

export default function DashboardPage() {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
      <DashboardHeader />
      <main className='flex-1 p-4 md:p-6'>
        <div className='mx-auto max-w-7xl'>
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardTable />
          </Suspense>
          <div className='flex justify-end '>
            <span className='text-sm text-slate-500 mt-1 dark:text-slate-400'>
              powered by
            </span>
            <Image
              src={logo_prodam}
              alt='Dashboard Illustration'
              width={100}
              height={50}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
