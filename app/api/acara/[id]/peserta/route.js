import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Tambah Peserta Acara
export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const acaraId = parseInt(resolvedParams.id)
    const data = await request.json()
    
    const baru = await prisma.pesertaAcara.create({
      data: {
        acaraId,
        nama: data.nama,
        instansi: data.instansi,
        peran: data.peran,
        pasFoto: data.pasFoto || null
      }
    })
    
    return NextResponse.json({ success: true, data: baru })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah peserta' }, { status: 500 })
  }
}
