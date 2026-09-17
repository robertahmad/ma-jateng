import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Dapatkan Daftar Acara
export async function GET() {
  try {
    const acara = await prisma.acara.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { peserta: true }
        }
      }
    })
    return NextResponse.json({ success: true, data: acara })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data acara' }, { status: 500 })
  }
}

// Tambah Acara Baru
export async function POST(request) {
  try {
    const data = await request.json()
    const { nama, tanggal, tempat, background } = data
    
    const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)

    const baru = await prisma.acara.create({
      data: {
        nama,
        slug,
        tanggal: new Date(tanggal),
        tempat,
        background: background || null
      }
    })

    return NextResponse.json({ success: true, data: baru })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menambah acara' }, { status: 500 })
  }
}
