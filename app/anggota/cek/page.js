'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Printer, AlertCircle, Clock, XCircle, CheckCircle2, User } from 'lucide-react'

export default function CekKTA() {
  const [nik, setNik] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [settings, setSettings] = useState({})

  // Fetch Pengaturan Web untuk TTD Pejabat
  useEffect(() => {
    fetch('/api/pengaturan')
      .then(res => res.json())
      .then(res => {
        if (res.data) setSettings(res.data)
      })
  }, [])

  const handleCari = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setData(null)

    try {
      const res = await fetch(`/api/anggota?nik=${nik}`)
      const json = await res.json()
      if (res.ok) {
        setData(json.data)
      } else {
        setErrorMsg('Data tidak ditemukan. Pastikan NIK sudah benar.')
      }
    } catch (e) {
      setErrorMsg('Terjadi kesalahan jaringan')
    }
    setLoading(false)
  }

  const cetakKTA = () => {
    window.print()
  }

  return (
    <>
      <Navbar />
      
      {/* HEADER: Akan disembunyikan saat mode print */}
      <div className="no-print" style={{ background: 'var(--hijau-tua)', color: 'white', padding: '6rem 2rem 4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Cek Status & Unduh KTA</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Masukkan Nomor Induk Kependudukan (NIK) Anda untuk mencetak Kartu Tanda Anggota (KTA).
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Form Pencarian */}
        <form onSubmit={handleCari} className="no-print" style={{ width: '100%', maxWidth: '600px', display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
          <input 
            type="text" 
            placeholder="Masukkan 16 Digit NIK..." 
            className="form-input" 
            style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }} 
            required 
            value={nik} 
            onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
            maxLength="16"
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }} disabled={loading}>
            <Search size={20} /> {loading ? 'Mencari...' : 'Cari Data'}
          </button>
        </form>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="no-print" style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <AlertCircle size={20} /> {errorMsg}
          </div>
        )}

        {/* Hasil Pencarian */}
        {data && (
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div className="no-print" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem', textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--teks-abu)', fontWeight: 700, marginBottom: '0.5rem' }}>STATUS PENDAFTARAN</div>
              {data.status === 'PENDING' && <div style={{ color: '#d97706', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Clock size={24} /> Menunggu Verifikasi Pengurus Cabang</div>}
              {data.status === 'DITERIMA' && <div style={{ color: '#16a34a', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle2 size={24} /> KTA Resmi Diterbitkan</div>}
              {data.status === 'DITOLAK' && <div style={{ color: '#dc2626', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><XCircle size={24} /> Pendaftaran Ditolak</div>}
            </div>

            {/* Render KTA Jika Diterima */}
            {data.status === 'DITERIMA' && (
              <div className="kta-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
                
                {/* TAMPAK DEPAN (Front Side) */}
                <div className="kta-card front" style={{ 
                  width: '450px', height: '285px', background: 'linear-gradient(135deg, var(--hijau-tua), #164e63)', 
                  borderRadius: '16px', padding: '1.5rem', color: 'white', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden',
                  fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ position: 'absolute', right: '-20px', top: '20px', width: '200px', height: '200px', backgroundImage: 'url("/logo-ma.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.1 }}></div>
                  
                  {/* Header KTA */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <img src="/logo-ma.png" alt="Logo MA" style={{ height: '45px', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emas)', letterSpacing: '1px' }}>KARTU TANDA ANGGOTA</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.5px' }}>MATHLA&apos;UL ANWAR JATENG</div>
                    </div>
                  </div>

                  {/* Body KTA */}
                  <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1, flex: 1 }}>
                    {/* Frame Foto */}
                    <div style={{ width: '90px', height: '120px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {data.pasFoto ? (
                        <img src={data.pasFoto} alt="Pas Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <User size={40} color="rgba(255,255,255,0.4)" />
                      )}
                    </div>
                    
                    {/* Data Diri */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Nama Lengkap</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{data.namaLengkap}</div>
                      
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Tempat, Tgl Lahir</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>{data.tempatLahir}, {new Date(data.tanggalLahir).toLocaleDateString('id-ID')}</div>

                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Nomor Induk Anggota (NIA)</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emas)', letterSpacing: '1px' }}>{data.nomorKTA}</div>
                    </div>
                  </div>
                </div>

                {/* TAMPAK BELAKANG (Back Side) */}
                <div className="kta-card back" style={{ 
                  width: '450px', height: '285px', background: 'white', 
                  borderRadius: '16px', padding: '1.5rem', color: 'var(--teks)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden',
                  fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0'
                }}>
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '250px', height: '250px', backgroundImage: 'url("/logo-ma.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.05, zIndex: 0 }}></div>
                  
                  {/* Visi Misi */}
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '0.5rem', letterSpacing: '1px' }}>VISI & MISI MATHLA&apos;UL ANWAR</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Visi:</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--teks-abu)', marginBottom: '0.5rem', lineHeight: 1.4 }}>Menjadi ormas Islam yang mandiri dan profesional dalam memajukan pendidikan, dakwah, dan sosial ekonomi umat.</p>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>Misi:</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--teks-abu)', lineHeight: 1.4, margin: 0 }}>
                      1. Menyelenggarakan pendidikan yang berkualitas<br/>
                      2. Menyebarkan dakwah yang rahmatan lil &apos;alamin<br/>
                      3. Mengembangkan pemberdayaan ekonomi umat
                    </p>
                  </div>

                  {/* Pengesahan Tanda Tangan */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', marginBottom: '0.5rem', position: 'relative', zIndex: 1, borderTop: '1px solid #cbd5e1', paddingTop: '0.75rem' }}>
                    <div style={{ textAlign: 'center', width: '45%' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Sekretaris Wilayah</div>
                      {/* TTD Sekretaris */}
                      <div style={{ 
                        height: '35px', margin: '0.25rem 0', 
                        backgroundImage: settings.ttd_sekretaris ? `url("${settings.ttd_sekretaris}")` : 'none', 
                        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' 
                      }}></div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, textDecoration: 'underline', color: 'var(--teks)' }}>
                        {settings.nama_sekretaris || 'NAMA SEKRETARIS'}
                      </div>
                    </div>
                    
                    {/* Stempel Tengah KTA */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.85, pointerEvents: 'none' }}>
                      {settings.stempel_wilayah ? (
                        <img src={settings.stempel_wilayah} alt="Stempel PWMA" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ width: '55px', height: '55px', border: '2px solid var(--hijau-tua)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hijau-tua)', fontSize: '0.45rem', fontWeight: 800, textAlign: 'center', transform: 'rotate(-15deg)' }}>STEMPEL<br/>PWMA</div>
                      )}
                    </div>

                    <div style={{ textAlign: 'center', width: '45%' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Ketua Wilayah</div>
                      {/* TTD Ketua */}
                      <div style={{ 
                        height: '35px', margin: '0.25rem 0', 
                        backgroundImage: settings.ttd_ketua ? `url("${settings.ttd_ketua}")` : 'none', 
                        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' 
                      }}></div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, textDecoration: 'underline', color: 'var(--teks)' }}>
                        {settings.nama_ketua || 'NAMA KETUA'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {data?.status === 'DITERIMA' && (
              <button onClick={cetakKTA} className="btn-primary no-print" style={{ padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', border: 'none', cursor: 'pointer', borderRadius: '999px', boxShadow: '0 10px 20px rgba(22, 163, 74, 0.3)' }}>
                <Printer size={24} /> Cetak / Download PDF
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />

      {/* CSS Khusus Mode Print */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .kta-container, .kta-container * { visibility: visible; }
          .kta-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px !important;
            padding: 20px 0;
          }
          .kta-card {
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
        }
      `}} />
    </>
  )
}
