import { getAttendancesBySection } from '@/services/getAttendancesBySection'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await getAttendancesBySection()
  return NextResponse.json(result)
}
