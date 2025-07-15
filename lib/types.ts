export interface Secretaria {
  section: string
  total: number
}

export interface UnitSection {
  unidade: string
  secretarias: Secretaria[]
  maxWaitTime: string
}

export interface Unit {
  id: string
  name: string
  isMainUnit: boolean
  parentId?: string
  waitTime: string,
  maxWaitTime: string,
  secretarias: { section: string; total: number, zero_to_twenty: any, twenty_one_to_sixty: any, above_sixty: any, in_attendance: any, waiting: any }[]
}
