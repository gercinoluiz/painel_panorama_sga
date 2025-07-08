import { Clock, Users } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Painel de Atendimento</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-50">
            <Clock className="h-4 w-4" />
            <span>Atualizado às {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-teal-100 px-3 py-1.5 text-sm font-medium text-teal-900 dark:bg-teal-900/30 dark:text-teal-50">
            <Users className="h-4 w-4" />
            <span>Senhas aguardando: 78</span>
          </div>
        </div>
      </div>
    </header>
  )
}
