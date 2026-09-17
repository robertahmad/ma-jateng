import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await prisma.pengurus.findMany({
    orderBy: { urutan: 'asc' }
  })
  return NextResponse.json({ data })
}

export async function POST(request) {
  const { id, ...body } = await request.json()
  const data = await prisma.pengurus.create({ data: {
    nama: body.nama,
    jabatan: body.jabatan,
    foto: body.foto,
    urutan: parseInt(body.urutan) || 0
  }})
  return NextResponse.json({ success: true, data })
}
