import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Update Status & Generate KTA
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    const { status, kabupaten, ktaMode, pasFoto } = await request.json()

    let dataUpdate = { status }
    
    if (ktaMode !== undefined) dataUpdate.ktaMode = ktaMode
    if (pasFoto !== undefined) dataUpdate.pasFoto = pasFoto

    // Fetch existing record first to get accurate year and existing mode
    const existing = await prisma.anggota.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }

    const newStatus = status !== undefined ? status : existing.status
    const newMode = ktaMode !== undefined ? ktaMode : (existing.ktaMode || 'MA')

    if (newStatus === 'DITERIMA') {
      const thn = new Date(existing.tanggalDaftar || new Date()).getFullYear()
      const urutan = String(id).padStart(5, '0')
      dataUpdate.nomorKTA = `${newMode}.0013.${thn}.${urutan}`
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
