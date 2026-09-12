import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    const result = await prisma.khutbah.create({
      data: {
        judul: data.judul,
        penulis: data.penulis,
        fileUrl: data.fileUrl,
      }
    })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const result = await prisma.khutbah.findMany({
      orderBy: { tanggal: 'desc' }
    })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
