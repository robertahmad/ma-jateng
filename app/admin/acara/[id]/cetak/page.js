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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Poppins:wght@500;700;800&display=swap');

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
              : `linear-gradient(135deg, #064e3b 0%, #16a34a 100%)`,
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)'
          }}>
            {/* Latar Belakang Transparan & Watermark */}
            {acara.background ? (
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: `url(${getDirectImageUrl(acara.background)}) center/cover no-repeat`, zIndex: 0 }} />
            ) : (
              <img src="/logo-ma.png" alt="Watermark" style={{ position: 'absolute', top: '45%', left: '55%', transform: 'translate(-50%, -50%)', width: '75%', opacity: 0.08, zIndex: 0 }} />
            )}

            {/* AREA ATAS (Isi Utama) */}
            <div style={{ display: 'flex', flex: 1, zIndex: 1 }}>
              
              {/* Sidebar Kiri (NAMA ACARA Vertikal) */}
              <div style={{ 
                width: '16mm', 
                background: 'rgba(0, 0, 0, 0.25)', 
                borderRight: '1px solid rgba(255,255,255,0.1)',
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
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.2rem', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {acara.nama}
                </h2>
              </div>

              {/* Area Kanan (Tengah) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4mm', justifyContent: 'center' }}>
                
                {/* PERAN (Pill Badge) */}
                <div style={{ 
                  margin: 0,
                  background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
                  color: p.peran === 'PANITIA' ? '#dc2626' : p.peran === 'VIP' || p.peran === 'PENGISI ACARA' ? '#d97706' : '#2563eb',
                  padding: '4px 18px',
                  borderRadius: '30px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '1.1rem', 
                  fontWeight: 900, 
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
                }}>
                  {p.peran}
                </div>

                {/* TEMPAT & TANGGAL */}
                <div style={{ textAlign: 'center', marginTop: '3mm', color: 'rgba(255,255,255,0.95)', fontFamily: "'Poppins', sans-serif", fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.4, textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
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
                  border: '3px solid white',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.3)'
                }}>
                  {p.pasFoto ? (
                    <img src={getDirectImageUrl(p.pasFoto)} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontFamily: "'Poppins', sans-serif", fontSize: '0.75rem', fontWeight: 700 }}>FOTO</span>
                  )}
                </div>

                {/* NAMA PESERTA */}
                <h2 style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.2, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                  {p.nama}
                </h2>
                
                {/* DELEGASI / INSTANSI */}
                <p style={{ margin: '3px 0 0 0', fontFamily: "'Poppins', sans-serif", fontSize: '0.85rem', color: '#fde047', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  {p.instansi}
                </p>

              </div>
            </div>

            {/* AREA BAWAH (Footer: Logos & QR) */}
            <div style={{ 
              height: '22mm', 
              borderTop: '3px solid #f8fafc', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0 4mm', 
              background: 'white',
              zIndex: 1,
              boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
            }}>
              
              {/* Logos */}
              <div style={{ display: 'flex', gap: '3mm', alignItems: 'center' }}>
                <img src="/logo-ma.png" alt="MA" style={{ height: '10mm', width: 'auto' }} />
                <img src="/banom-muslimat.jpg" alt="MUSMA" style={{ height: '9mm', width: 'auto', borderRadius: '50%' }} />
                <img src="/banom-gema.jpg" alt="HIMMA" style={{ height: '9mm', width: 'auto', borderRadius: '2px' }} />
              </div>

              {/* QR Code */}
              <div style={{ padding: '2px', border: '1px solid #cbd5e1', borderRadius: '4px', background: 'white', display: 'flex' }}>
                <QRCodeSVG value={`https://ma-jateng.vercel.app/acara/${acara.slug}/peserta/${p.id}`} size={45} />
              </div>

            </div>

          </div>
        ))}
      </div>
    </>
  )
}
