import type { Unit } from './types'

// This function simulates fetching data from an API
export async function fetchUnitsData(): Promise<Unit[]> {
  const res = await fetch('/api/units')
  return res.json()
}
