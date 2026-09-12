import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')

  const data = await prisma.agenda.findMany({
    orderBy: { tanggalMulai: 'asc' },
    take: limit,
  })

  return NextResponse.json({ data })
}

export async function POST(request) {
  const body = await request.json()
  const agenda = await prisma.agenda.create({ data: body })
  return NextResponse.json({ success: true, data: agenda })
}
