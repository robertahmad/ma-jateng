import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const data = await prisma.lembaga.findMany({
    orderBy: [
      { kabupaten: 'asc' },
      { jenjang: 'asc' },
      { nama: 'asc' }
    ]
  })
  return NextResponse.json({ data })
}

export async function POST(request) {
  const body = await request.json()
  const lembaga = await prisma.lembaga.create({ data: body })
  return NextResponse.json({ success: true, data: lembaga })
}
