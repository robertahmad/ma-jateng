'use client'

import { useState } from 'react'

export default function RuangKader({ dokumen }) {
  const [sandi, setSandi] = useState('')
  const [terbuka, setTerbuka] = useState(false)
  const [error, setError] = useState(false)

  const handleBuka = () => {
    // Kata sandi rahasia untuk membuka dokumen internal
    if (sandi === 'MAJATENG2026') {
      setTerbuka(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const FileIcon = () => (
    <div style={{ width: '50px', height: '60px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b91c1c', fontSize: '1.5rem', fontWeight: 800 }}>
      PDF
    </div>
  )

  const LockIcon = () => (
    <div style={{ width: '50px', height: '60px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '1.5rem', fontWeight: 800 }}>
      🔒
    </div>
  )

  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      {/* Form Password */}
      {!terbuka && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', maxWidth: '400px', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="password" 
              placeholder="Masukkan Sandi Akses..." 
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuka()}
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: error ? '2px solid #ef4444' : 'none', outline: 'none', color: '#333' }} 
            />
            <button onClick={handleBuka} style={{ background: 'var(--emas)', color: 'var(--hijau-tua)', fontWeight: 700, border: 'none', padding: '0 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Buka Akses</button>
          </div>
          {error && <span style={{ color: '#fca5a5', fontSize: '0.85rem' }}>Kata sandi salah. Silakan coba lagi.</span>}
        </div>
      )}

      {/* List Dokumen */}
      <div style={{ opacity: terbuka ? 1 : 0.6, pointerEvents: terbuka ? 'auto' : 'none', transition: 'all 0.3s' }}>
        {terbuka && <div style={{ background: '#059669', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>✅ Akses Kader Terverifikasi</div>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {(dokumen.length > 0 ? dokumen : [1,2,3]).map((doc, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: terbuka ? '1px solid rgba(255,255,255,0.2)' : '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {terbuka ? <FileIcon /> : <LockIcon />}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{terbuka ? doc.judul || 'Dokumen Tanpa Judul' : 'Dokumen Internal Terenkripsi'}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {terbuka ? (doc.createdAt ? formatTanggal(doc.createdAt) : 'Tersedia') : 'Terkunci 🔒'}
                </p>
                {terbuka && doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'white', color: 'var(--hijau-tua)', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                    Unduh Dokumen
                  </a>
                )}
              </div>
            </div>
          ))}
          {dokumen.length === 0 && terbuka && (
            <div style={{ color: '#cbd5e1' }}>Belum ada dokumen internal yang diunggah.</div>
          )}
        </div>
      </div>
    </>
  )
}
