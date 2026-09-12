import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const lembaga = await prisma.lembaga.update({ where: { id: parseInt(id) }, data: body })
  return NextResponse.json({ success: true, data: lembaga })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.lembaga.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
