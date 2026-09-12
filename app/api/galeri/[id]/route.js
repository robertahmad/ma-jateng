import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const galeri = await prisma.galeri.update({ where: { id: parseInt(id) }, data: body })
  return NextResponse.json({ success: true, data: galeri })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.galeri.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
