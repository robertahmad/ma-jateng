import Link from 'next/link'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'

const Facebook = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
const Instagram = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
const Twitter = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
const Youtube = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>

export default function Footer() {
  return (
    <>
      <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col" style={{ flex: '1 1 300px' }}>
          <img src="/logo-ma.png" alt="Mathla'ul Anwar" style={{ height: '50px', borderRadius: '4px', marginBottom: '1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Organisasi Islam yang berfokus pada Pendidikan, Dakwah, dan Sosial demi kemajuan umat dan bangsa Indonesia.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--emas)', display: 'flex', alignItems: 'center' }}><Facebook size={20} /></a>
            <a href="#" style={{ color: 'var(--emas)', display: 'flex', alignItems: 'center' }}><Instagram size={20} /></a>
            <a href="#" style={{ color: 'var(--emas)', display: 'flex', alignItems: 'center' }}><Twitter size={20} /></a>
            <a href="#" style={{ color: 'var(--emas)', display: 'flex', alignItems: 'center' }}><Youtube size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navigasi</h4>
          <ul>
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/profil">Profil Organisasi</Link></li>
            <li><Link href="/berita">Berita & Artikel</Link></li>
            <li><Link href="/agenda">Agenda Kegiatan</Link></li>
            <li><Link href="/galeri">Galeri Foto</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Layanan</h4>
          <ul>
            <li><Link href="/lembaga">Data Lembaga</Link></li>
            <li><Link href="/dokumen">Dokumen & SK</Link></li>
            <li><Link href="/kontak">Hubungi Kami</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Kontak</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Semarang, Jawa Tengah</a></li>
            <li><a href="tel:+62" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> (024) xxx-xxxx</a></li>
            <li><a href="mailto:pw@mathlaularwanjateng.id" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> pw@mathlaularwanjateng.id</a></li>
            <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={16} /> mathlaularwanjateng.id</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p>&copy; {new Date().getFullYear()} PW Mathla&apos;ul Anwar Jawa Tengah. Hak Cipta Dilindungi.</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Diberdayakan oleh</span>
          <a href="https://mitrasekolah.id" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo-mitrasekolah.png" alt="MitraSekolah.id" style={{ height: '24px', filter: 'brightness(0) invert(1)' }} />
            <span style={{ marginLeft: '0.5rem', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>MitraSekolah.id</span>
          </a>
        </div>
      </div>
      </footer>
    </>
  )
}
