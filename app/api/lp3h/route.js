import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    const result = await prisma.pendaftaranLP3H.create({
      data: {
        namaLengkap: data.namaLengkap,
        kontak: data.kontak,
        namaUsaha: data.namaUsaha || null,
        jenisLayanan: data.jenisLayanan,
        alamat: data.alamat,
      }
    })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const result = await prisma.pendaftaranLP3H.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
