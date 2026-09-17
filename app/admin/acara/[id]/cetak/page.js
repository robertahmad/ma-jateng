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
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}>
            {/* Latar Belakang Transparan jika ada Custom Background */}
            {acara.background && (
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: `url(${getDirectImageUrl(acara.background)}) center/cover no-repeat`, zIndex: 0 }} />
            )}

            {/* AREA ATAS (Isi Utama) */}
            <div style={{ display: 'flex', flex: 1, zIndex: 1 }}>
              
              {/* Sidebar Kiri (NAMA ACARA Vertikal) */}
              <div style={{ 
                width: '18mm', 
                background: '#16a34a', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '10mm 0'
              }}>
                <h2 style={{ 
                  writingMode: 'vertical-rl', 
                  transform: 'rotate(180deg)',
                  margin: 0, 
                  fontSize: '1.2rem', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  {acara.nama}
                </h2>
              </div>

              {/* Area Kanan (Tengah) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5mm', justifyContent: 'center' }}>
                
                {/* PERAN */}
                <h1 style={{ 
                  margin: 0,
                  color: p.peran === 'PANITIA' ? '#ef4444' : p.peran === 'VIP' || p.peran === 'PENGISI ACARA' ? '#f59e0b' : '#3b82f6',
                  fontSize: '1.6rem', 
                  fontWeight: 900, 
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {p.peran}
                </h1>

                {/* TEMPAT & TANGGAL */}
                <div style={{ textAlign: 'center', marginTop: '3mm', color: '#334155', fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.4, textTransform: 'uppercase' }}>
                  <div>{acara.tempat}</div>
                  <div>{new Date(acara.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                </div>

                {/* FOTO */}
                <div style={{ 
                  width: '35mm', 
                  height: '45mm', 
                  background: '#f1f5f9', 
                  marginTop: '5mm', 
                  marginBottom: '5mm', 
                  border: '2px solid #cbd5e1',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {p.pasFoto ? (
                    <img src={getDirectImageUrl(p.pasFoto)} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>FOTO</span>
                  )}
                </div>

                {/* NAMA PESERTA */}
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', textAlign: 'center', lineHeight: 1.2 }}>
                  {p.nama}
                </h2>
                
                {/* DELEGASI / INSTANSI */}
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#475569', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>
                  {p.instansi}
                </p>

              </div>
            </div>

            {/* AREA BAWAH (Footer: Logos & QR) */}
            <div style={{ 
              height: '24mm', 
              borderTop: '2px solid #cbd5e1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0 5mm', 
              background: 'white',
              zIndex: 1
            }}>
              
              {/* Logos */}
              <div style={{ display: 'flex', gap: '3mm', alignItems: 'center' }}>
                <img src="/logo-ma.png" alt="MA" style={{ height: '14mm', width: 'auto' }} />
                <img src="/banom-muslimat.jpg" alt="MUSMA" style={{ height: '12mm', width: 'auto', borderRadius: '50%' }} />
                <img src="/banom-gema.jpg" alt="HIMMA" style={{ height: '12mm', width: 'auto', borderRadius: '2px' }} />
              </div>

              {/* QR Code */}
              <div style={{ padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white' }}>
                <QRCodeSVG value={`https://ma-jateng.vercel.app/acara/${acara.slug}/peserta/${p.id}`} size={60} />
              </div>

            </div>

          </div>
        ))}
      </div>
    </>
  )
}
