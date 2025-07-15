import type { UnitSection } from './types'

// This function simulates fetching data from an API
export async function fetchUnitsData(): Promise<UnitSection[]> {
  const res = await fetch('/api/units')
  const data = await res.json()
  return data.sections // pois agora sections já tem maxWaitTime
}
