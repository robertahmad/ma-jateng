'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { getDirectImageUrl } from '@/lib/image'

export default function CetakIDCard() {
  const { id } = useParams()
  const [acara, setAcara] = useState(null)
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/acara/${id}`)
        const json = await res.json()
        if (json.success) setAcara(json.data)
      } catch (e) {
        console.error(e)
      }
    }
    if (id) fetchDetail()
  }, [id])

  if (!acara) return <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data cetak...</div>

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-container { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 15mm; 
            padding: 15mm; 
            background: white; 
          }
          .id-card { 
            page-break-inside: avoid;
            margin-bottom: 5mm;
          }
        }
        @media screen {
          .print-container { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 2rem; 
            padding: 2rem; 
            justify-content: center;
            background: #f1f5f9;
          }
        }
      `}} />

      <div className="no-print" style={{ padding: '1rem', background: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Cetak ID Card Acara</h2>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.85rem' }}>{acara.nama} - {acara.peserta.length} Peserta</p>
        </div>
        <button onClick={() => window.print()} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Mulai Cetak (Print)
        </button>
      </div>

      <div className="print-container">
        {acara.peserta.map(p => (
          <div key={p.id} className="id-card" style={{ 
            width: '90mm', 
            height: '135mm', 
            background: acara.background ? `url(${getDirectImageUrl(acara.background)}) center/cover no-repeat` : 'white',
            border: acara.background ? 'none' : '2px solid #16a34a',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Header / Logo Latar Belakang Standar jika tidak ada background custom */}
            {!acara.background && (
              <div style={{ width: '100%', height: '35mm', background: 'var(--hijau-utama)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '1rem', textAlign: 'center', boxSizing: 'border-box' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>{acara.nama}</h3>
                <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>{new Date(acara.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
              </div>
            )}

            {/* Foto Peserta */}
            <div style={{ 
              width: '35mm', 
              height: '45mm', 
              background: '#e2e8f0', 
              marginTop: acara.background ? '30mm' : '8mm', 
              borderRadius: '8px',
              border: '3px solid white',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2
            }}>
              {p.pasFoto ? (
                <img src={getDirectImageUrl(p.pasFoto)} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Tidak ada foto</span>
              )}
            </div>

            {/* Nama & Instansi */}
            <div style={{ width: '100%', textAlign: 'center', padding: '0 10mm', marginTop: '6mm', zIndex: 2 }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: acara.background ? 'white' : 'var(--teks)', lineHeight: 1.2 }}>
                {p.nama}
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: acara.background ? 'rgba(255,255,255,0.9)' : 'var(--teks-abu)', fontWeight: 600 }}>
                {p.instansi}
              </p>
            </div>

            {/* Peran / Label */}
            <div style={{ 
              marginTop: 'auto', 
              marginBottom: acara.background ? '30mm' : '8mm',
              background: p.peran === 'PANITIA' ? '#ef4444' : p.peran === 'VIP' || p.peran === 'PENGISI ACARA' ? '#f59e0b' : '#3b82f6',
              color: 'white',
              padding: '6px 20px',
              borderRadius: '20px',
              fontWeight: 900,
              letterSpacing: '1px',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              zIndex: 2,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)'
            }}>
              {p.peran}
            </div>

            {/* QR Code di pojok */}
            <div style={{ position: 'absolute', bottom: '8mm', right: '8mm', padding: '4px', background: 'white', borderRadius: '4px', zIndex: 2 }}>
              <QRCodeSVG value={`https://ma-jateng.vercel.app/acara/${acara.slug}/peserta/${p.id}`} size={45} />
            </div>
            
            {/* Logo MA watermark (jika standar) */}
            {!acara.background && (
              <img src="/logo-ma.png" alt="Logo" style={{ position: 'absolute', width: '60%', opacity: 0.05, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
