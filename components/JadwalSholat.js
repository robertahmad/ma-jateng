'use client'

import { useState, useEffect } from 'react'
import { Clock, Sunrise, Sun, CloudSun, Sunset, Moon, MapPin } from 'lucide-react'

export default function JadwalSholat() {
  const [jadwal, setJadwal] = useState(null)
  const [tanggal, setTanggal] = useState('')
  const [loading, setLoading] = useState(true)

  const [jamSekarang, setJamSekarang] = useState('00:00:00')
  const [nextSholat, setNextSholat] = useState('')

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Semarang&country=Indonesia&method=20')
        const data = await res.json()
        
        if (data && data.data && data.data.timings) {
          setJadwal(data.data.timings)
          const hijri = data.data.date.hijri
          const gregorian = data.data.date.gregorian
          setTanggal(`${hijri.day} ${hijri.month.en} ${hijri.year} H / ${gregorian.day} ${gregorian.month.en} ${gregorian.year}`)
        }
      } catch (error) {
        console.error("Gagal mengambil jadwal sholat", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJadwal()
  }, [])

  // Efek Jam & Penentu Waktu Sholat Selanjutnya
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false })
      setJamSekarang(timeString.replace(/\./g, ':'))

      if (jadwal) {
        const currentMins = now.getHours() * 60 + now.getMinutes()
        const timesList = [
          { name: 'Imsak', time: jadwal.Imsak },
          { name: 'Subuh', time: jadwal.Fajr },
          { name: 'Dzuhur', time: jadwal.Dhuhr },
          { name: 'Ashar', time: jadwal.Asr },
          { name: 'Maghrib', time: jadwal.Maghrib },
          { name: 'Isya', time: jadwal.Isha }
        ]
        
        let next = 'Imsak' // Default ke Imsak besok jika semua sudah lewat
        for (let t of timesList) {
          const [h, m] = t.time.split(':')
          if (parseInt(h) * 60 + parseInt(m) > currentMins) {
            next = t.name
            break
          }
        }
        setNextSholat(next)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [jadwal])

  if (loading) {
    return (
      <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '-50px', marginBottom: '3rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center', color: 'var(--teks-abu)' }}>
          Mensinkronkan waktu sholat dengan server Kemenag...
        </div>
      </div>
    )
  }

  if (!jadwal) return null

  const times = [
    { name: 'Imsak', time: jadwal.Imsak, icon: <Clock size={28} /> },
    { name: 'Subuh', time: jadwal.Fajr, icon: <Sunrise size={28} /> },
    { name: 'Dzuhur', time: jadwal.Dhuhr, icon: <Sun size={28} /> },
    { name: 'Ashar', time: jadwal.Asr, icon: <CloudSun size={28} /> },
    { name: 'Maghrib', time: jadwal.Maghrib, icon: <Sunset size={28} /> },
    { name: 'Isya', time: jadwal.Isha, icon: <Moon size={28} /> },
  ]

  return (
    <div style={{
      background: 'rgba(15, 45, 20, 0.65)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '1.5rem',
      width: '100%',
      maxWidth: '350px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      color: 'white'
    }}>
      {/* Header Jadwal */}
      <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emas)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>
          <Clock size={16} />
          Jadwal Imsakiyah
        </h3>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '0.25rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {jamSekarang}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: '0.25rem' }}>
          {tanggal}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <MapPin size={12} /> Jawa Tengah (WIB)
        </div>
      </div>
      
      {/* List Waktu Vertikal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {times.map((t, i) => {
          const isNext = nextSholat === t.name
          return (
            <div key={i} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '0.6rem 1rem', borderRadius: '12px', 
              background: isNext ? 'rgba(200, 169, 81, 0.2)' : 'rgba(255,255,255,0.06)', 
              border: isNext ? '1px solid var(--emas)' : '1px solid rgba(255,255,255,0.05)',
              boxShadow: isNext ? '0 0 15px rgba(200, 169, 81, 0.3)' : 'none',
              transition: 'background 0.2s', cursor: 'default'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: isNext ? '#fff' : 'var(--emas)', animation: isNext ? 'pulse 2s infinite' : 'none' }}>{t.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: isNext ? '#fff' : 'rgba(255,255,255,0.9)' }}>
                  {t.name}
                  {isNext && <span style={{ fontSize: '0.6rem', background: 'var(--emas)', color: 'var(--hijau-tua)', padding: '0.15rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 800 }}>SEGERA</span>}
                </div>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{t.time}</div>
            </div>
          )
        })}
      </div>
      
      {/* SPONSOR WATERMARK */}
      <div style={{ 
        marginTop: '1rem', 
        paddingTop: '0.75rem', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.5rem' 
      }}>
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontWeight: 700 }}>POWERED BY</span>
        <a href="https://mitrasekolah.id" target="_blank" rel="noopener noreferrer" style={{ 
          fontSize: '0.72rem', 
          color: 'rgba(255,255,255,0.7)', 
          fontWeight: 800, 
          textDecoration: 'none',
          letterSpacing: '0.5px',
          transition: 'color 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--emas)'}
        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
        >
          MitraSekolah.id
        </a>
      </div>

      {/* Tambahan animasi CSS pulse via style tag untuk ikon yang berkedip */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  )
}
