import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Update Status & Generate KTA
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    const { status, kabupaten } = await request.json()

    let dataUpdate = { status }

    // Jika DITERIMA, buatkan nomor KTA otomatis
    if (status === 'DITERIMA') {
      const thn = new Date().getFullYear()
      // Format: MA-JT.[Tahun].[ID] (contoh: MA-JT.2026.0001)
      const urutan = String(id).padStart(4, '0')
      dataUpdate.nomorKTA = `MA-JT.${thn}.${urutan}`
    }

    const updated = await prisma.anggota.update({
      where: { id },
      data: dataUpdate
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 })
  }
}

// Hapus Anggota
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    await prisma.anggota.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 })
  }
}
