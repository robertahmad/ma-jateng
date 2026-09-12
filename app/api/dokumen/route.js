import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const data = await prisma.dokumen.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ data })
}

export async function POST(request) {
  const body = await request.json()
  const dokumen = await prisma.dokumen.create({ data: body })
  return NextResponse.json({ success: true, data: dokumen })
}
