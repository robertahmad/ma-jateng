import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const result = await prisma.pendaftaranLP3H.update({
      where: { id },
      data: { 
        status: data.status,
        catatanAdmin: data.catatanAdmin
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
    await prisma.pendaftaranLP3H.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
