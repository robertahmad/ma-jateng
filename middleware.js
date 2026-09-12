import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Proteksi semua rute yang dimulai dengan /admin
  if (path.startsWith('/admin')) {
    // Kecualikan halaman login dan api login/logout
    if (path === '/admin/login' || path.startsWith('/api/admin')) {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value

    // Jika tidak ada token (belum login), tendang ke halaman login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Terapkan middleware ini HANYA untuk path /admin dan bawahnya
export const config = {
  matcher: '/admin/:path*',
}
