import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = await params

  // Try by ID first, then by slug
  let berita
  if (!isNaN(id)) {
    berita = await prisma.berita.findUnique({ where: { id: parseInt(id) } })
  } else {
    berita = await prisma.berita.findUnique({ where: { slug: id } })
  }

  if (!berita) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: berita })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const berita = await prisma.berita.update({
    where: { id: parseInt(id) },
    data: body
  })
  return NextResponse.json({ success: true, data: berita })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.berita.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
