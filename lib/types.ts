export interface Unit {
  id: string
  name: string
  parentId?: string
  isMainUnit: boolean
  totalServices?: string
  services: number
  waitTime: string
  under30min: number
  between30and45min: number
  above45min: number
  inService: number
  waiting: number
}
