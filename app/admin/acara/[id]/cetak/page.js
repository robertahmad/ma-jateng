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
          body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
            background: acara.background 
              ? `url(${getDirectImageUrl(acara.background)}) center/cover no-repeat` 
              : `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,1) 45%, rgba(255,255,255,1) 100%), url('https://i.ibb.co.com/8N6KbbQ/bg-kta-ma.jpg') center/cover no-repeat`,
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Header / Nama Acara (Tampil di area transparan/hijau atas) */}
            {!acara.background && (
              <div style={{ width: '100%', height: '35mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', color: 'white', padding: '10mm 5mm 0', textAlign: 'center', boxSizing: 'border-box', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.2 }}>{acara.nama}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', fontWeight: 600 }}>{new Date(acara.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
              </div>
            )}

            {/* Foto Peserta */}
            <div style={{ 
              width: '35mm', 
              height: '45mm', 
              background: '#f1f5f9', 
              marginTop: acara.background ? '30mm' : '-5mm', 
              borderRadius: '8px',
              border: '4px solid white',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)',
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
            <div style={{ width: '100%', textAlign: 'center', padding: '0 8mm', marginTop: '6mm', zIndex: 2 }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: acara.background ? 'white' : '#0f172a', lineHeight: 1.2 }}>
                {p.nama}
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: acara.background ? 'rgba(255,255,255,0.9)' : '#64748b', fontWeight: 700 }}>
                {p.instansi}
              </p>
            </div>

            {/* Peran / Label */}
            <div style={{ 
              marginTop: 'auto', 
              marginBottom: acara.background ? '30mm' : '15mm',
              background: p.peran === 'PANITIA' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : p.peran === 'VIP' || p.peran === 'PENGISI ACARA' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '30px',
              fontWeight: 900,
              letterSpacing: '1.5px',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              zIndex: 2,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)'
            }}>
              {p.peran}
            </div>

            {/* Area Bawah: QR Code & Ornamen */}
            {!acara.background && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '8mm', background: 'linear-gradient(90deg, #16a34a, #047857)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }} />
            )}

            {/* QR Code di pojok */}
            <div style={{ position: 'absolute', bottom: '12mm', right: '10mm', padding: '4px', background: 'white', borderRadius: '8px', zIndex: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <QRCodeSVG value={`https://ma-jateng.vercel.app/acara/${acara.slug}/peserta/${p.id}`} size={45} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
