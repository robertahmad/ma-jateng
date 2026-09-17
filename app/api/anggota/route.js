import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // PENDING, DITERIMA, DITOLAK
  const nik = searchParams.get('nik')

  // Mode Cari NIK untuk Publik
  if (nik) {
    const data = await prisma.anggota.findUnique({ where: { nik } })
    if (!data) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    return NextResponse.json({ data })
  }
  
  // Mode Daftar untuk Admin
  const where = status ? { status } : {}
  const data = await prisma.anggota.findMany({
    where,
    orderBy: { tanggalDaftar: 'desc' }
  })
  return NextResponse.json({ data })
}

// Digunakan oleh frontend pendaftaran
export async function POST(request) {
  try {
    const { id, ...body } = await request.json()
    // Cek apakah NIK sudah pernah mendaftar
    const cekNik = await prisma.anggota.findUnique({ where: { nik: body.nik } })
    if (cekNik) {
      return NextResponse.json({ error: 'NIK ini sudah terdaftar sebelumnya' }, { status: 400 })
    }

    const anggota = await prisma.anggota.create({ data: body })
    return NextResponse.json({ success: true, data: anggota })
  } catch (e) {
    console.error("ERROR PRISMA ANGGOTA:", e)
    return NextResponse.json({ error: e.message || 'Gagal mendaftar' }, { status: 500 })
  }
}
