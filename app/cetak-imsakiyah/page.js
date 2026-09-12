'use client'

import { useState, useEffect } from 'react'

export default function CetakImsakiyah() {
  const [jadwalBulanan, setJadwalBulanan] = useState([])
  const [loading, setLoading] = useState(true)

  const date = new Date()
  const tahun = date.getFullYear()
  const bulan = date.getMonth() + 1
  const namaBulan = date.toLocaleDateString('id-ID', { month: 'long' })

  useEffect(() => {
    // Mengambil data jadwal sebulan penuh dari API Aladhan (Metode Kemenag)
    const fetchJadwal = async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/calendarByCity?city=Semarang&country=Indonesia&method=20&month=${bulan}&year=${tahun}`)
        const data = await res.json()
        if (data.code === 200) {
          setJadwalBulanan(data.data)
        }
      } catch (e) {
        console.error("Gagal mengambil jadwal:", e)
      } finally {
        setLoading(false)
        // Tunggu gambar & layout dirender sebentar, lalu otomatis trigger Print
        setTimeout(() => {
          window.print()
        }, 1000)
      }
    }
    fetchJadwal()
  }, [bulan, tahun])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'sans-serif' }}>Membuat Dokumen PDF...</div>
  }

  return (
    <div className="print-container" style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      
      {/* KOP SURAT */}
      <div style={{ borderBottom: '3px solid black', paddingBottom: '0.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <img src="/kop-ma.png" alt="Kop Surat Mathla'ul Anwar" style={{ width: '100%', maxWidth: '800px', height: 'auto', display: 'block', margin: '0 auto' }} />
      </div>

      {/* JUDUL DOKUMEN */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>
          JADWAL IMSAKIYAH & SHOLAT
        </h2>
        <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>
          BULAN {namaBulan.toUpperCase()} {tahun} M
        </h3>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          Wilayah Semarang dan Sekitarnya (Metode Kementerian Agama RI)
        </p>
      </div>

      {/* TABEL JADWAL */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid black', borderTop: '2px solid black' }}>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Tanggal</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Imsak</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Subuh</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Terbit</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Dhuha</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Dzuhur</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Ashar</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Maghrib</th>
            <th style={{ padding: '0.6rem', border: '1px solid #cbd5e1' }}>Isya</th>
          </tr>
        </thead>
        <tbody>
          {jadwalBulanan.map((hari, idx) => {
            const dateObj = new Date(hari.date.readable)
            // Cek jika hari ini, beri warna latar belakang
            const isToday = dateObj.getDate() === date.getDate()

            return (
              <tr key={idx} style={{ backgroundColor: isToday ? '#fef3c7' : 'transparent', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', fontWeight: isToday ? 'bold' : 'normal' }}>
                  {hari.date.gregorian.day} {hari.date.gregorian.month.en.substring(0, 3)}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1' }}>{hari.timings.Imsak.split(' ')[0]}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{hari.timings.Fajr.split(' ')[0]}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', color: '#64748b' }}>{hari.timings.Sunrise.split(' ')[0]}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1' }}>
                  {(() => {
                    const [h, m] = hari.timings.Sunrise.split(' ')[0].split(':').map(Number);
                    const d = new Date(); d.setHours(h, m + 20);
                    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                  })()}
                </td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{hari.timings.Dhuhr.split(' ')[0]}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{hari.timings.Asr.split(' ')[0]}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{hari.timings.Maghrib.split(' ')[0]}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{hari.timings.Isha.split(' ')[0]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* FOOTER TTD & BRANDING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', fontSize: '0.85rem' }}>
        <div>
          <p style={{ margin: 0 }}>Diperbarui pada: {date.toLocaleDateString('id-ID')}</p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Powered by</span>
          <img src="/logo-mitrasekolah.png" alt="MitraSekolah.id" style={{ height: '16px', filter: 'grayscale(100%)' }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Hide Navbar, Footer, and Badge when printing or viewing this page */
        nav, footer, .sticky-badge { display: none !important; }
        @media print {
          body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-container { width: 100% !important; max-width: none !important; padding: 0 !important; }
          @page { size: A4 portrait; margin: 1.5cm; }
        }
      `}} />
    </div>
  )
}
