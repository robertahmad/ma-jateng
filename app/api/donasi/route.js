import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const data = await prisma.programDonasi.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  // Konversi BigInt ke String agar aman di JSON
  const safeData = data.map(item => ({
    ...item,
    targetDana: item.targetDana.toString(),
    terkumpul: item.terkumpul.toString()
  }))

  return NextResponse.json({ data: safeData })
}

export async function POST(request) {
  const { id, ...body } = await request.json()
  
  // Buat slug otomatis
  const slug = body.judul.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now()
  
  const program = await prisma.programDonasi.create({ 
    data: { 
      ...body, 
      slug,
      rekeningBank: body.rekeningBank || '[]' 
    } 
  })
  
  // Konversi response agar tidak error BigInt
  const safeProgram = {
    ...program,
    targetDana: program.targetDana.toString(),
    terkumpul: program.terkumpul.toString()
  }

  return NextResponse.json({ success: true, data: safeProgram })
}
