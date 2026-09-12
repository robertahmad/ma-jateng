import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import KalkulatorZakat from '@/components/KalkulatorZakat'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Wallet, Image as ImageIcon, HandCoins, ArrowRight, Heart } from 'lucide-react'

export const revalidate = 60

export default async function DonasiList() {
  const program = await prisma.programDonasi.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  // Ambil pengaturan rekening
  const settingRekening = await prisma.pengaturan.findUnique({ where: { kunci: 'rekening_donasi' } })
  const rekening = settingRekening?.nilai || 'Silakan hubungi pengurus untuk informasi rekening'

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  const ProgressBar = ({ terkumpul, target }) => {
    const p = Number(terkumpul)
    const t = Number(target)
    const percentage = t === 0 ? 0 : Math.min(Math.round((p / t) * 100), 100)
    
    return (
      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--teks)' }}>
          <span>Terkumpul: {formatRupiah(p)}</span>
          <span style={{ color: 'var(--teks-abu)' }}>Target: {formatRupiah(t)}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--hijau-tua)', borderRadius: '999px' }}></div>
        </div>
      </div>
    )
  }

  const getKategoriColor = (kat) => {
    switch(kat) {
      case 'ZAKAT': return { bg: '#fefce8', color: '#b45309', border: '#fde047' }
      case 'WAKAF': return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' }
      case 'INFAQ': return { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
      case 'HIBAH': return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' }
      default: return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' }
    }
  }

  return (
    <>
      <Navbar />
      
      <div style={{ background: 'linear-gradient(135deg, var(--hijau-tua) 0%, #164e63 100%)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Zakat, Infaq, Sedekah & Wakaf (ZISWAF)
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Portal ZISWAF Umat</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Salurkan Zakat, Infaq, Sedekah, dan Wakaf (ZISWAF) terbaik Anda untuk mendukung program pendidikan, dakwah, dan kesejahteraan umat Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        
        {/* Layout Utama: Kalkulator (Kiri) & Rekening/Penjelasan (Kanan) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          <KalkulatorZakat />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--hijau-muda)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Wallet size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '0.25rem' }}>Rekening Resmi ZISWAF</h3>
                <p style={{ color: 'var(--teks-abu)', fontSize: '0.95rem' }}>
                  Seluruh penyaluran dana disalurkan melalui satu pintu: <strong style={{ color: 'var(--teks)', fontSize: '1.05rem', background: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px dashed #cbd5e1', marginLeft: '0.5rem', display: 'inline-block', marginTop: '0.5rem' }}>{rekening}</strong>
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={20} color="#ef4444" fill="#ef4444" /> Kenapa Berdonasi Melalui PWMA Jateng?
              </h3>
              <ul style={{ color: 'var(--teks-abu)', fontSize: '0.95rem', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.8 }}>
                <li><strong>Sesuai Syariah:</strong> Pemisahan dana Zakat secara ketat untuk asnaf, serta Infaq/Wakaf untuk operasional dakwah dan fasilitas.</li>
                <li><strong>Transparan & Terukur:</strong> Setiap program memiliki target dan indikator *progress* yang dapat dipantau oleh semua donatur.</li>
                <li><strong>Membangun Peradaban:</strong> Dana diprioritaskan pada sektor pendidikan madrasah, dakwah pedalaman, dan pemberdayaan ekonomi umat.</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem', color: 'var(--teks)' }}>Program Penggalangan ZISWAF</h2>

        {program.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--teks-abu)' }}>
            <span style={{ display: 'block', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><HandCoins size={64} color="#94a3b8" /></span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teks)', fontWeight: 700 }}>Belum Ada Program Aktif</h3>
            <p>Saat ini belum ada program penggalangan dana ZISWAF yang aktif.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {program.map(p => {
              const theme = getKategoriColor(p.kategori)
              return (
                <div key={p.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: theme.bg, color: theme.color, border: `1px solid ${theme.border}`, padding: '0.2rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>
                    {p.kategori || 'UMUM'}
                  </div>

                  <div style={{ width: '100%', height: '200px', background: '#f1f5f9', position: 'relative' }}>
                    {p.gambar ? (
                      <img src={p.gambar} alt={p.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={48} color="#cbd5e1" /></div>
                    )}
                    {p.status === 'SELESAI' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem', backdropFilter: 'blur(4px)' }}>
                        PROGRAM SELESAI
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{p.judul}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--teks-abu)', lineHeight: 1.6, flex: 1 }}>{p.deskripsi}</p>
                    
                    <ProgressBar terkumpul={p.terkumpul} target={p.targetDana} />
                    
                    <button 
                      disabled={p.status === 'SELESAI'}
                      style={{ 
                        width: '100%', padding: '0.85rem', marginTop: '1rem', borderRadius: '8px', border: 'none',
                        background: p.status === 'SELESAI' ? '#e2e8f0' : 'var(--emas)', 
                        color: p.status === 'SELESAI' ? '#94a3b8' : 'var(--hijau-tua)',
                        fontWeight: 800, fontSize: '0.95rem', cursor: p.status === 'SELESAI' ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                      }}
                    >
                      {p.status === 'SELESAI' ? 'Ditutup' : <><span style={{ color: 'var(--hijau-tua)' }}>Donasi Sekarang</span> <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      <Footer />
    </>
  )
}
