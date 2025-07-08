export interface Unit {
  id: string
  name: string
  isMainUnit: boolean
  parentId?: string
  secretarias: { section: string; total: number }[]
}
