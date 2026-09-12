import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const revalidate = 0 // Disable caching untuk API ini

export async function GET() {
  try {
    const [
      anggotaPending,
      lp3hPending,
      tanyaJawabPending,
      donasiPending
    ] = await Promise.all([
      prisma.anggota.count({ where: { status: 'PENDING' } }),
      prisma.pendaftaranLP3H.count({ where: { status: 'PENDING' } }),
      prisma.tanyaJawab.count({ where: { status: 'PENDING' } }),
      prisma.donatur.count({ where: { status: 'PENDING' } })
    ])

    return NextResponse.json({
      success: true,
      data: {
        anggota: anggotaPending,
        lp3h: lp3hPending,
        tanyajawab: tanyaJawabPending,
        donasi: donasiPending
      }
    })
  } catch (error) {
    console.error('Error fetch notifikasi:', error)
    return NextResponse.json({ success: false, data: {} }, { status: 500 })
  }
}
