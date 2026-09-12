'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { 
  LayoutDashboard, Newspaper, CalendarDays, Image as ImageIcon, 
  School, FolderOpen, Users, HandCoins, Settings, ExternalLink, LogOut,
  MessageSquareQuote, MessageCircle, FileText, ShieldCheck
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isExpired, setIsExpired] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [notifications, setNotifications] = useState({})

  // Fetch Notifikasi Lintas Modul
  useEffect(() => {
    if (pathname === '/admin/login') return
    
    fetch('/api/admin/notifikasi')
      .then(res => res.json())
      .then(json => {
        if (json.success) setNotifications(json.data)
      })
      .catch(err => console.error("Gagal load notifikasi:", err))
  }, [pathname])

  // ==========================================
  // BOM WAKTU & SISTEM PENAGIHAN (LICENSE)
  // ==========================================
  useEffect(() => {
    if (pathname === '/admin/login') return
    
    // TANGGAL DEPLOYMENT AWAL (Ganti ke tanggal sekarang untuk testing)
    const deploymentDate = new Date('2026-09-05T00:00:00') // Tanggal hari ini
    
    // TANGGAL KEDALUWARSA (Siklus 1 Tahun - misal diset ke hari yang sama untuk TESTING)
    // Untuk production sejati: deploymentDate.setFullYear(deploymentDate.getFullYear() + 1)
    const expirationDate = new Date('2027-09-15T00:00:00') // Gembok dibuka, akan meledak pada 15 Sept 2027

    if (new Date() > expirationDate) {
      setIsExpired(true)
      // Ambil jumlah pesan PENDING untuk memancing psikologis Admin
      fetch('/api/tanyajawab')
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            const count = json.data.filter(item => item.status === 'PENDING').length
            setPendingCount(count)
          }
        }).catch(e => console.log('Silently failed to fetch inbox'))
    }
  }, [pathname])

  // Jangan tampilkan sidebar jika sedang berada di halaman login
  if (pathname === '/admin/login') {
    return children
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' })
      if (res.ok) {
        toast.success('Berhasil keluar')
        router.push('/admin/login')
        router.refresh()
      }
    } catch (e) {
      toast.error('Gagal logout')
    }
  }

  const navs = [
    { href: '/admin', label: 'Dasbor', icon: <LayoutDashboard size={20} />, exact: true },
    { href: '/admin/berita', label: 'Kelola Berita', icon: <Newspaper size={20} /> },
    { href: '/admin/agenda', label: 'Kelola Agenda', icon: <CalendarDays size={20} /> },
    { href: '/admin/galeri', label: 'Kelola Galeri', icon: <ImageIcon size={20} /> },
    { href: '/admin/lembaga', label: 'Data Lembaga', icon: <School size={20} /> },
    { href: '/admin/dokumen', label: 'Dokumen & SK', icon: <FolderOpen size={20} /> },
    { href: '/admin/pengurus', label: 'Struktur Pengurus', icon: <Users size={20} /> },
    { href: '/admin/anggota', label: 'Anggota & KTA', icon: <Users size={20} />, badge: notifications.anggota },
    { href: '/admin/donasi', label: 'Program Donasi', icon: <HandCoins size={20} />, badge: notifications.donasi },
    { href: '/admin/mimbar', label: 'Mimbar Harian', icon: <MessageSquareQuote size={20} /> },
    { href: '/admin/layanan', label: 'Layanan Tanya Jawab', icon: <MessageCircle size={20} />, badge: notifications.tanyajawab },
    { href: '/admin/khutbah', label: 'Arsip Khutbah', icon: <FileText size={20} /> },
    { href: '/admin/lp3h', label: 'Halal & NIB (LP3H)', icon: <ShieldCheck size={20} />, badge: notifications.lp3h },
    { href: '/admin/pengaturan', label: 'Pengaturan Web', icon: <Settings size={20} /> },
  ]

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.1)' }}>
          <img src="/logo-ma.png" alt="Logo MA" style={{ height: '50px', marginBottom: '0.5rem', borderRadius: '4px' }} />
          <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>RUANG KENDALI</div>
        </div>
        <nav className="admin-nav">
          {navs.map(nav => {
            const isActive = nav.exact ? pathname === nav.href : pathname.startsWith(nav.href)
            return (
              <Link key={nav.href} href={nav.href} className={isActive ? 'active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                {nav.icon}
                <span style={{ flex: 1 }}>{nav.label}</span>
                {nav.badge > 0 && (
                  <span style={{ background: 'var(--emas)', color: 'var(--hijau-tua)', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '99px' }}>
                    {nav.badge}
                  </span>
                )}
              </Link>
            )
          })}
          
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <ExternalLink size={20} />
              Lihat Website
            </a>
            <button onClick={handleLogout} style={{ 
              width: '100%', textAlign: 'left', padding: '0.65rem 1rem', 
              background: 'transparent', border: 'none', color: '#ef4444', 
              cursor: 'pointer', display: 'flex', gap: '0.75rem', 
              alignItems: 'center', fontSize: '0.88rem', fontWeight: 500, marginTop: '0.5rem'
            }}>
              <LogOut size={20} />
              Keluar (Logout)
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main" style={{ position: 'relative' }}>
        
        {isExpired ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#f8fafc', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', maxWidth: '600px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Settings size={40} color="#ef4444" />
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '1rem' }}>Lisensi Dasbor Berakhir</h1>
              <p style={{ color: 'var(--teks-abu)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Masa akses gratis satu tahun untuk ruang kendali *database* Neon dan fitur administrasi telah habis. Website publik tetap berjalan normal untuk jamaah.
              </p>
              
              {pendingCount > 0 && (
                <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '12px', border: '1px dashed #f59e0b', marginBottom: '2rem' }}>
                  <p style={{ margin: 0, color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <MessageCircle size={20} />
                    Peringatan: Ada {pendingCount} Pertanyaan Umat Menunggu Dijawab!
                  </p>
                </div>
              )}

              <a href="https://wa.me/6281234567890?text=Halo%20MitraSekolah.id,%20saya%20ingin%20memperpanjang%20lisensi%20dan%20sewa%20server%20website%20Mathla'ul%20Anwar..." target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'var(--emas)', color: 'var(--hijau-tua)', padding: '1rem 2rem', borderRadius: '999px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 15px rgba(200, 169, 81, 0.4)', transition: 'transform 0.2s' }}>
                Hubungi MitraSekolah.id Sekarang
              </a>
            </div>
          </div>
        ) : (
          children
        )}

      </main>
    </div>
  )
}
