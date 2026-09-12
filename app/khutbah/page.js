'use client'
import { useState, useEffect } from 'react'
import { FileText, DownloadCloud, BookOpen } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayananKhutbah() {
  const [arsip, setArsip] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/khutbah')
      .then(res => res.json())
      .then(json => {
        if (json.success) setArsip(json.data)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--hijau-tua)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(15, 45, 20, 0.2)' }}>
              <BookOpen size={40} color="var(--emas)" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem' }}>Arsip Khutbah Jum'at</h1>
            <p style={{ color: 'var(--teks-abu)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
              Pusat unduhan naskah Khutbah Jum'at resmi dari Mathla'ul Anwar Jawa Tengah. 
              Silakan unduh secara gratis untuk dibacakan di mimbar masjid-masjid Anda.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--teks-abu)' }}>Mengambil arsip...</div>
          ) : arsip.length === 0 ? (
            <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px dashed #cbd5e1' }}>
              <FileText size={64} color="#e2e8f0" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--teks)' }}>Belum Ada Arsip Tersedia</h3>
              <p style={{ color: 'var(--teks-abu)' }}>Tim asatidz kami sedang menyiapkan naskah khutbah edisi terbaru.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {arsip.map((item) => (
                <div key={item.id} style={{ 
                  background: 'white', padding: '2rem', borderRadius: '20px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem',
                  transition: 'transform 0.2s, boxShadow 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)' }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)' }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: 'var(--hijau-tua)', padding: '0.3rem 0.8rem', borderRadius: '999px', fontWeight: 700, letterSpacing: '1px' }}>
                        NASKAH KHUTBAH
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{item.judul}</h2>
                    <div style={{ fontSize: '0.95rem', color: 'var(--teks-abu)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Oleh: <strong style={{ color: 'var(--emas)' }}>{item.penulis}</strong>
                    </div>
                  </div>

                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--emas)', color: 'var(--hijau-tua)',
                    padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 800, textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(200, 169, 81, 0.4)'
                  }}>
                    <DownloadCloud size={20} /> Unduh PDF
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}
