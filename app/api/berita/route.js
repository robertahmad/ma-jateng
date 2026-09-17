import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const diterbitkan = searchParams.get('diterbitkan')

  const where = diterbitkan === 'true' ? { diterbitkan: true } : {}

  const data = await prisma.berita.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({ data })
}

export async function POST(request) {
  const { id, ...body } = await request.json()
  const slug = body.judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    + '-' + Date.now()

  const berita = await prisma.berita.create({
    data: { ...body, slug }
  })

  return NextResponse.json({ success: true, data: berita })
}
