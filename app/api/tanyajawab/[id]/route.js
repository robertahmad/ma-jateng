import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const result = await prisma.tanyaJawab.update({
      where: { id },
      data: { 
        status: data.status, 
        jawaban: data.jawaban // Opsional jika admin ingin menyimpan catatannya juga di DB
      } 
    })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    await prisma.tanyaJawab.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
