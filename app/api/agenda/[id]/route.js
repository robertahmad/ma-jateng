import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = await params
  const agenda = await prisma.agenda.findUnique({ where: { id: parseInt(id) } })
  if (!agenda) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: agenda })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const agenda = await prisma.agenda.update({ where: { id: parseInt(id) }, data: body })
  return NextResponse.json({ success: true, data: agenda })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.agenda.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
