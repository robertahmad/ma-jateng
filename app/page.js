'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JadwalSholat from '@/components/JadwalSholat'
import MimbarUmat from '@/components/MimbarUmat'
import { useEffect, useState } from 'react'
import { CalendarDays, GraduationCap, Heart, Users, MapPin } from 'lucide-react'

export default function Home() {
  const [berita, setBerita] = useState([])
  const [agenda, setAgenda] = useState([])
  const [counts, setCounts] = useState({ lembaga: 0, anggota: 0, madrasah: 0, tahun: 0 })
  const [kutipanHariIni, setKutipanHariIni] = useState(null)

  useEffect(() => {
    // Simulasi fetch data dari API
    const fetchData = async () => {
      try {
        // Fetch Pengaturan untuk Mimbar Umat
        const resPengaturan = await fetch('/api/pengaturan')
        const dataPengaturan = await resPengaturan.json()
        if (dataPengaturan.data) {
          setKutipanHariIni(dataPengaturan.data)
        }
      } catch (e) {
        console.error("Error fetching data:", e)
      }
    }
    fetchData()

    fetch('/api/berita?limit=3&diterbitkan=true')
      .then(r => r.json()).then(d => setBerita(d.data || []))
    fetch('/api/agenda?limit=3')
      .then(r => r.json()).then(d => setAgenda(d.data || []))

    // Counter animasi
    const targets = { lembaga: 250, anggota: 15000, madrasah: 180, tahun: 110 }
    const duration = 1500
    const steps = 60
    let step = 0
    const timer = setInterval(() => {
      step++
      setCounts({
        lembaga: Math.min(targets.lembaga, Math.round((targets.lembaga / steps) * step)),
        anggota: Math.min(targets.anggota, Math.round((targets.anggota / steps) * step)),
        madrasah: Math.min(targets.madrasah, Math.round((targets.madrasah / steps) * step)),
        tahun: Math.min(targets.tahun, Math.round((targets.tahun / steps) * step)),
      })
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [])

  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <>
      <Navbar />

      <section className="hero" style={{ 
        backgroundImage: 'url("/logo-ma.png")',
        backgroundPosition: 'right center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6rem 5%',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <div className="hero-content" style={{
          background: 'rgba(15, 45, 20, 0.75)',
          padding: '3rem',
          borderRadius: '24px',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '600px',
          textAlign: 'left',
          flex: '1 1 min(100%, 500px)'
        }}>
          <div className="hero-badge" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', margin: '0 0 1.5rem 0', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/logo-ma.png" alt="Logo MA" style={{ height: '18px', objectFit: 'contain' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--emas)' }}>Berdiri Sejak 1916</span>
          </div>
          <h1 style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)', fontSize: '3rem', lineHeight: 1.2 }}>
            Pengurus Wilayah<br />
            <span style={{ textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>Mathla&apos;ul Anwar</span><br />
            Jawa Tengah
          </h1>
          <p style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontWeight: 500, color: 'rgba(255,255,255,0.95)' }}>
            Organisasi Islam yang berfokus pada Pendidikan, Dakwah, dan Sosial
            demi kemajuan umat dan bangsa Indonesia di bumi Jawa Tengah.
          </p>
          <div className="hero-buttons" style={{ justifyContent: 'flex-start' }}>
            <Link href="/profil" className="btn-primary">Profil Organisasi</Link>
            <Link href="/berita" className="btn-outline">Berita Terkini →</Link>
          </div>
        </div>

        {/* SISI KANAN: DA'WAH HUB (Mimbar & Jadwal) */}
        <div style={{ flex: '1 1 600px', display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {/* WIDGET MIMBAR UMAT (Tengah/Kiri dari Jadwal) */}
          <div style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center' }}>
            <MimbarUmat kutipan={kutipanHariIni} />
          </div>

          {/* WIDGET JADWAL SHOLAT (Paling Kanan) */}
          <div style={{ flex: '0 1 320px', display: 'flex', justifyContent: 'center' }}>
            <JadwalSholat />
          </div>
        </div>
      </section>

      {/* BARIS BANOM (Badan Otonom) */}
      <div style={{ background: 'var(--emas)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ fontWeight: 800, color: 'var(--hijau-tua)', letterSpacing: '0.15em', fontSize: '0.9rem', textTransform: 'uppercase', opacity: 0.8 }}>
          Badan Otonom & Lembaga
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', alignItems: 'center', maxWidth: '1000px' }}>
          {/* Item Banom 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{ width: '85px', height: '85px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(26,92,42,0.15)', border: '3px solid rgba(255,255,255,0.6)', overflow: 'hidden' }}>
              <img src="/banom-muslimat.jpg" alt="Muslimat MA" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <div style={{ display: 'none', fontWeight: 800, color: 'var(--hijau-tua)', fontSize: '0.8rem', textAlign: 'center' }}>MUSLIMAT</div>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--hijau-tua)' }}>Muslimat MA</span>
          </div>

          {/* Item Banom 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{ width: '85px', height: '85px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(26,92,42,0.15)', border: '3px solid rgba(255,255,255,0.6)', overflow: 'hidden' }}>
              <img src="/banom-gema.jpg" alt="GEMA MA" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <div style={{ display: 'none', fontWeight: 800, color: 'var(--hijau-tua)', fontSize: '0.8rem', textAlign: 'center' }}>GEMA</div>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--hijau-tua)' }}>GEMA MA</span>
          </div>

          {/* Item Banom 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{ width: '85px', height: '85px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(26,92,42,0.15)', border: '3px solid rgba(255,255,255,0.6)', overflow: 'hidden' }}>
              <img src="/banom-lp3h.jpg" alt="LP3H" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <div style={{ display: 'none', fontWeight: 800, color: 'var(--hijau-tua)', fontSize: '0.8rem', textAlign: 'center' }}>LP3H</div>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--hijau-tua)' }}>LP3H</span>
          </div>

          {/* Item Banom 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{ width: '85px', height: '85px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(26,92,42,0.15)', border: '3px solid rgba(255,255,255,0.6)', overflow: 'hidden' }}>
              <img src="/banom-unma.jpg" alt="UNMA Banten" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
              <div style={{ display: 'none', fontWeight: 800, color: 'var(--hijau-tua)', fontSize: '0.8rem', textAlign: 'center' }}>UNMA</div>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--hijau-tua)' }}>UNMA Banten</span>
          </div>
        </div>
      </div>

      {/* VISI MISI SINGKAT */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
              <div className="section-tag">Tentang Kami</div>
              <h2 className="section-title">Terbitnya Cahaya untuk Jawa Tengah</h2>
              <p style={{ color: 'var(--teks-abu)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Mathla&apos;ul Anwar (MA) adalah salah satu organisasi kemasyarakatan Islam tertua di Indonesia.
                Didirikan pada 10 Juli 1916 di Menes, Banten, kini PW MA Jawa Tengah terus berkhidmat
                dalam bidang Pendidikan, Dakwah, dan Sosial.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { icon: <GraduationCap size={24} />, judul: 'Pendidikan', teks: 'Mengelola ratusan madrasah dan lembaga pendidikan Islam' },
                  { icon: <Heart size={24} />, judul: 'Dakwah', teks: 'Menyebarkan nilai-nilai Islam yang rahmatan lil alamin' },
                  { icon: <Users size={24} />, judul: 'Sosial', teks: 'Memberdayakan masyarakat melalui program sosial kemasyarakatan' },
                ].map(p => (
                  <div key={p.judul} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0, color: 'var(--hijau-tua)' }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{p.judul}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--teks-abu)' }}>{p.teks}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/profil" className="btn-primary">Selengkapnya →</Link>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--hijau-tua), #2d8a45)',
              borderRadius: '16px',
              padding: '2.5rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.08 }}>☪️</div>
              <div style={{ color: 'var(--emas)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Visi</div>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Terwujudnya masyarakat Islam yang berilmu, beriman, dan berakhlak mulia dalam ridha Allah SWT.
              </p>
              <div style={{ color: 'var(--emas)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Misi</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  'Menyelenggarakan pendidikan Islam yang berkualitas',
                  'Melaksanakan dakwah yang inklusif dan rahmatan lil alamin',
                  'Memberdayakan umat melalui program sosial',
                  'Memperkuat ukhuwah Islamiyah di Jawa Tengah',
                ].map((m, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.88rem', opacity: 0.9 }}>
                    <span style={{ color: 'var(--emas)', flexShrink: 0 }}>✓</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA TERBARU */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Informasi</div>
            <h2 className="section-title">Berita Terkini</h2>
            <p className="section-sub">Ikuti perkembangan kegiatan dan informasi terbaru dari PW MA Jawa Tengah</p>
          </div>
          <div className="grid-3">
            {berita.length > 0 ? berita.map(b => (
              <Link key={b.id} href={`/berita/${b.slug}`} className="card">
                <div className="card-img-placeholder">📰</div>
                <div className="card-body">
                  <span className="card-tag">{b.kategori}</span>
                  <div className="card-title">{b.judul}</div>
                  <div className="card-date" style={{ display: 'flex', alignItems: 'center' }}><CalendarDays size={14} style={{ marginRight: '0.4rem' }} /> {formatTanggal(b.createdAt)}</div>
                  <div className="card-text">{b.ringkasan}</div>
                </div>
              </Link>
            )) : (
              // Placeholder cards
              [1,2,3].map(i => (
                <div key={i} className="card">
                  <div className="card-img-placeholder">📰</div>
                  <div className="card-body">
                    <span className="card-tag">Umum</span>
                    <div className="card-title">Berita akan segera ditampilkan di sini</div>
                    <div className="card-date" style={{ display: 'flex', alignItems: 'center' }}><CalendarDays size={14} style={{ marginRight: '0.4rem' }} /> September 2026</div>
                    <div className="card-text">Pengurus sedang menyiapkan konten berita terbaru untuk Anda.</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/berita" className="btn-primary">Lihat Semua Berita →</Link>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Jadwal</div>
            <h2 className="section-title">Agenda Kegiatan</h2>
            <p className="section-sub">Jadwal kegiatan dan acara resmi PW Mathla&apos;ul Anwar Jawa Tengah</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            {agenda.length > 0 ? agenda.map(a => (
              <div key={a.id} style={{
                background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', gap: '1.5rem', alignItems: 'center'
              }}>
                <div style={{
                  background: 'var(--hijau-tua)', color: 'white', borderRadius: '10px',
                  padding: '0.75rem', textAlign: 'center', minWidth: '60px'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {new Date(a.tanggalMulai).getDate()}
                  </div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 }}>
                    {new Date(a.tanggalMulai).toLocaleDateString('id-ID', { month: 'short' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{a.judul}</div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--teks-abu)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {a.lokasi}</div>
                </div>
              </div>
            )) : (
              [
                { tgl: '15 Sep', judul: 'Rapat Koordinasi Pengurus Wilayah', lokasi: 'Sekretariat PW MA Jateng, Semarang' },
                { tgl: '22 Sep', judul: 'Silaturahmi dan Musyawarah Daerah', lokasi: 'Aula Utama, Semarang' },
                { tgl: '5 Okt', judul: 'Pelatihan Guru Madrasah Se-Jateng', lokasi: 'Balai Diklat, Semarang' },
              ].map((a, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', gap: '1.5rem', alignItems: 'center'
                }}>
                  <div style={{
                    background: 'var(--hijau-tua)', color: 'white', borderRadius: '10px',
                    padding: '0.75rem', textAlign: 'center', minWidth: '60px', fontSize: '0.75rem', fontWeight: 700
                  }}>{a.tgl}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{a.judul}</div>
                    <div style={{ fontSize: '0.83rem', color: 'var(--teks-abu)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} /> {a.lokasi}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/agenda" className="btn-primary">Lihat Semua Agenda →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
