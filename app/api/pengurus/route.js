import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const kategoriOrganisasi = searchParams.get('kategoriOrganisasi')
  
  const where = kategoriOrganisasi ? { kategoriOrganisasi } : {}
  const data = await prisma.pengurus.findMany({
    where,
    orderBy: { urutan: 'asc' }
  })
  return NextResponse.json({ data })
}

export async function POST(request) {
  const { id, ...body } = await request.json()
  const data = await prisma.pengurus.create({ data: {
    nama: body.nama,
    jabatan: body.jabatan,
    bidang: body.bidang || 'Pengurus Inti',
    kategoriOrganisasi: body.kategoriOrganisasi || 'MA Jateng',
    foto: body.foto,
    urutan: parseInt(body.urutan) || 0
  }})
  return NextResponse.json({ success: true, data })
}
