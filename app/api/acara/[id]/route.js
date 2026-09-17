import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Dapatkan Detail Acara
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    const acara = await prisma.acara.findUnique({
      where: { id },
      include: {
        peserta: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!acara) return NextResponse.json({ error: 'Acara tidak ditemukan' }, { status: 404 })
      
    return NextResponse.json({ success: true, data: acara })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// Update Acara
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    const data = await request.json()
    
    const updated = await prisma.acara.update({
      where: { id },
      data: {
        nama: data.nama,
        tanggal: new Date(data.tanggal),
        tempat: data.tempat,
        background: data.background || null
      }
    })
    
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui acara' }, { status: 500 })
  }
}

// Hapus Acara
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    await prisma.acara.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus acara' }, { status: 500 })
  }
}
