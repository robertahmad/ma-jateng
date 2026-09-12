import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const data = await prisma.pengurus.update({
    where: { id: parseInt(id) },
    data: {
      nama: body.nama,
      jabatan: body.jabatan,
      foto: body.foto,
      urutan: parseInt(body.urutan) || 0
    }
  })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.pengurus.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
