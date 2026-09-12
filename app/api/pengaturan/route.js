import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const data = await prisma.pengaturan.findMany()
  
  // Format data menjadi object key-value untuk mempermudah frontend
  const settingsObj = {}
  data.forEach(item => {
    settingsObj[item.kunci] = item.nilai
  })
  
  return NextResponse.json({ data: settingsObj })
}

export async function PUT(request) {
  const body = await request.json()
  
  // Update secara massal (bulk update) menggunakan transaksi
  const updatePromises = Object.keys(body).map(kunci => {
    return prisma.pengaturan.upsert({
      where: { kunci },
      update: { nilai: body[kunci] },
      create: { kunci, nilai: body[kunci] }
    })
  })
  
  await prisma.$transaction(updatePromises)
  
  return NextResponse.json({ success: true, message: 'Pengaturan berhasil disimpan' })
}
