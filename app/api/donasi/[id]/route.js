import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const program = await prisma.programDonasi.update({ where: { id: parseInt(id) }, data: body })
  
  const safeProgram = {
    ...program,
    targetDana: program.targetDana.toString(),
    terkumpul: program.terkumpul.toString()
  }
  
  return NextResponse.json({ success: true, data: safeProgram })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  await prisma.programDonasi.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
