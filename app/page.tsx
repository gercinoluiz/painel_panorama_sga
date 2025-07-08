import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardTable } from "@/components/dashboard-table"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardTable />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
