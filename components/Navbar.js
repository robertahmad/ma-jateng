'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

// ── Kelompok Dropdown Menu ──────────────────────────
const menuGroups = [
  {
    label: 'Tentang Kami',
    children: [
      { href: '/profil',   label: 'Profil Organisasi' },
      { href: '/lembaga',  label: 'Data Lembaga' },
      { href: '/galeri',   label: 'Galeri Foto' },
      { href: '/anggota/cek', label: 'Cek Status & KTA' },
    ]
  },
  {
    label: 'Konten',
    children: [
      { href: '/berita',   label: 'Berita & Artikel' },
      { href: '/agenda',   label: 'Agenda Kegiatan' },
      { href: '/dokumen',  label: 'Dokumen & SK' },
    ]
  },
  {
    label: 'Layanan',
    children: [
      { href: '/layanan-umat', label: 'Tanya Jawab Agama' },
      { href: '/khutbah',      label: 'Arsip Khutbah Jum\'at' },
      { href: '/lp3h',         label: 'Halal & NIB (LP3H)' },
      { href: '/kontak',       label: 'Hubungi Kami' },
    ]
  },
]

// ── Komponen Dropdown Item ──────────────────────────
function DropdownItem({ group }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.95rem',
          display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0',
          transition: 'color 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--emas)'}
        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
      >
        {group.label}
        <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
          background: 'white', borderRadius: '14px', minWidth: '220px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0',
          overflow: 'hidden', zIndex: 9998,
          animation: 'fadeSlideDown 0.15s ease'
        }}>
          {/* Segitiga kecil di atas dropdown */}
          <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid white' }} />
          
          {group.children.map(child => (
            <Link key={child.href} href={child.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '0.85rem 1.25rem',
                color: 'var(--teks)', fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'none', borderBottom: '1px solid #f1f5f9',
                transition: 'background 0.15s, color 0.15s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = 'var(--hijau-tua)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--teks)' }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Komponen Navbar Utama ──────────────────────────
export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 9990 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <img src="/logo-ma.png" alt="Logo Mathla'ul Anwar Jateng" style={{ height: '45px', borderRadius: '4px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', lineHeight: 1.1 }}>PWMA</span>
            <span style={{ color: 'var(--emas)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em' }}>JAWA TENGAH</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link href="/" style={{ color: pathname === '/' ? 'var(--emas)' : 'rgba(255,255,255,0.9)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
            Beranda
          </Link>

          {menuGroups.map(group => (
            <DropdownItem key={group.label} group={group} />
          ))}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/donasi" style={{
              background: 'var(--hijau-muda)', color: 'white',
              padding: '0.55rem 1.1rem', borderRadius: '999px',
              fontWeight: 800, textDecoration: 'none', fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}>
              Donasi
            </Link>
            <Link href="/anggota/daftar" style={{
              background: 'var(--emas)', color: 'var(--hijau-tua)',
              padding: '0.55rem 1.1rem', borderRadius: '999px',
              fontWeight: 800, textDecoration: 'none', fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(200,169,81,0.4)',
              whiteSpace: 'nowrap'
            }}>
              Daftar Anggota
            </Link>
          </div>
        </div>
      </nav>

      {/* Animasi Dropdown */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 768px) {
          .navbar-menu { display: none !important; }
        }
      `}} />
    </>
  )
}
