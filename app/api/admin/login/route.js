import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { username, password } = await request.json()

  const admin = await prisma.admin.findUnique({ where: { username } })
  if (!admin) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const token = signToken({ id: admin.id, username: admin.username, nama: admin.nama })

  const response = NextResponse.json({ success: true, nama: admin.nama })
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
    sameSite: 'lax',
  })

  return response
}
