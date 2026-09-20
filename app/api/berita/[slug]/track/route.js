import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const { slug } = await params
  
  try {
    const { type } = await request.json()
    
    if (type === 'view') {
      await prisma.berita.update({
        where: { slug },
        data: { dilihat: { increment: 1 } }
      })
    } else if (type === 'share') {
      await prisma.berita.update({
        where: { slug },
        data: { dibagikan: { increment: 1 } }
      })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid tracking type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tracking Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update tracking stats' }, { status: 500 })
  }
}
