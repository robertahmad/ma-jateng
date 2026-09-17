import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Hapus Peserta
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id)
    await prisma.pesertaAcara.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus peserta' }, { status: 500 })
  }
}
