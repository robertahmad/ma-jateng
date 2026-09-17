'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle2, ShieldCheck, Camera, CreditCard } from 'lucide-react'

export default function PendaftaranAnggota() {
  const [formData, setFormData] = useState({
    nik: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    ktaMode: 'MA',
    noWhatsApp: '',
    alamatLengkap: '',
    kabupaten: '',
    pekerjaan: '',
    pasFoto: ''
  })
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      // Siapkan payload dengan mengkonversi tanggal menjadi string ISO yang diharapkan Prisma
      const payload = {
        ...formData,
        tanggalLahir: formData.tanggalLahir ? new Date(formData.tanggalLahir).toISOString() : null
      }

      const res = await fetch('/api/anggota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json()

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(json.error || 'Terjadi kesalahan sistem')
      }
    } catch (e) {
      setStatus('error')
      setErrorMessage('Koneksi terputus. Silakan coba lagi.')
    }
  }

  return (
    <>
      <Navbar />
      
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '6rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Registrasi Kader
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Pendaftaran Anggota KTA</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Bergabunglah menjadi barisan penggerak Mathla&apos;ul Anwar Jawa Tengah. Isi formulir di bawah ini untuk mendapatkan Kartu Tanda Anggota (KTA) resmi.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Form Registrasi / Layar Sukses */}
        <div style={{ flex: '1 1 600px', background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle2 size={80} color="var(--emas)" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem' }}>Pendaftaran Berhasil!</h2>
              <p style={{ color: 'var(--teks-abu)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Data Anda telah masuk ke dalam sistem dengan status <strong>Menunggu Verifikasi</strong>. Pengurus Daerah / Cabang akan segera memproses pendaftaran Anda.
              </p>
              <button onClick={() => { setStatus('idle'); setFormData({nik:'', namaLengkap:'', tempatLahir:'', tanggalLahir:'', jenisKelamin:'', noWhatsApp:'', alamatLengkap:'', kabupaten:'', pekerjaan:'', pasFoto:''}) }} className="btn-outline">
                Kembali
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem', borderBottom: '2px solid var(--abu)', paddingBottom: '1rem' }}>Formulir Data Diri</h2>
              
              {status === 'error' && (
                <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
                  Gagal: {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nomor Induk Kependudukan (NIK)</label>
                  <input type="text" className="form-input" required minLength="16" maxLength="16" placeholder="Masukkan 16 digit NIK" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value.replace(/\D/g,'')})} />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Nama Lengkap (Sesuai KTP)</label>
                  <input type="text" className="form-input" required placeholder="Nama Lengkap" value={formData.namaLengkap} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} />
                </div>

                <div>
                  <label className="form-label">Tempat Lahir</label>
                  <input type="text" className="form-input" required placeholder="Kota/Kabupaten" value={formData.tempatLahir} onChange={e => setFormData({...formData, tempatLahir: e.target.value})} />
                </div>

                <div>
                  <label className="form-label">Tanggal Lahir</label>
                  <input type="date" className="form-input" required value={formData.tanggalLahir} onChange={e => setFormData({...formData, tanggalLahir: e.target.value})} />
                </div>

                <div>
                  <label className="form-label">Jenis Kelamin</label>
                  <select className="form-input" required value={formData.jenisKelamin} onChange={e => {
                    const jk = e.target.value
                    setFormData({...formData, jenisKelamin: jk, ktaMode: jk === 'P' ? 'MUSMA' : 'MA'})
                  }} style={{ background: 'white' }}>
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Nomor WhatsApp Aktif</label>
                  <input type="text" className="form-input" required placeholder="08..." value={formData.noWhatsApp} onChange={e => setFormData({...formData, noWhatsApp: e.target.value})} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Organisasi yang Dituju (Mode KTA)</label>
                  <select className="form-input" required value={formData.ktaMode} onChange={e => setFormData({...formData, ktaMode: e.target.value})} style={{ background: 'white' }}>
                    <option value="MA">Mathla'ul Anwar (Umum / Pria)</option>
                    <option value="MUSMA">Muslimat Mathla'ul Anwar (Khusus Wanita)</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Alamat Lengkap</label>
                  <textarea className="form-textarea" required placeholder="Jalan, RT/RW, Desa/Kelurahan..." style={{ minHeight: '80px' }} value={formData.alamatLengkap} onChange={e => setFormData({...formData, alamatLengkap: e.target.value})}></textarea>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Pengurus Cabang / Daerah (Kabupaten)</label>
                  <select className="form-input" required value={formData.kabupaten} onChange={e => setFormData({...formData, kabupaten: e.target.value})} style={{ background: 'white' }}>
                    <option value="">Pilih Cabang Kabupaten...</option>
                    {[
                      "Kab. Banjarnegara", "Kab. Banyumas", "Kab. Batang", "Kab. Blora", "Kab. Boyolali", 
                      "Kab. Brebes", "Kab. Cilacap", "Kab. Demak", "Kab. Grobogan", "Kab. Jepara", 
                      "Kab. Karanganyar", "Kab. Kebumen", "Kab. Kendal", "Kab. Klaten", "Kab. Kudus", 
                      "Kab. Magelang", "Kab. Pati", "Kab. Pekalongan", "Kab. Pemalang", "Kab. Purbalingga", 
                      "Kab. Purworejo", "Kab. Rembang", "Kab. Semarang", "Kab. Sragen", "Kab. Sukoharjo", 
                      "Kab. Tegal", "Kab. Temanggung", "Kab. Wonogiri", "Kab. Wonosobo", 
                      "Kota Magelang", "Kota Pekalongan", "Kota Salatiga", "Kota Semarang", "Kota Surakarta (Solo)", "Kota Tegal"
                    ].map(kab => (
                      <option key={kab} value={kab}>{kab}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Pekerjaan Saat Ini (Opsional)</label>
                  <input type="text" className="form-input" placeholder="Wiraswasta, Guru, Pegawai..." value={formData.pekerjaan} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Link Pas Foto (Opsional, untuk dicetak di KTA)</label>
                  <input type="url" className="form-input" placeholder="https://contoh.com/foto-saya.jpg" value={formData.pasFoto} onChange={e => setFormData({...formData, pasFoto: e.target.value})} />
                  <small style={{ color: 'var(--teks-abu)', display: 'block', marginTop: '0.25rem' }}>*Strategi penghematan server: Foto via Link/URL.</small>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary" disabled={status === 'submitting'} style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {status === 'submitting' ? 'Memproses...' : 'Kirim Pendaftaran'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--teks-abu)', marginTop: '1rem' }}>
                    Dengan menekan tombol di atas, Anda menyatakan bahwa data yang diisi adalah benar dan bersedia mengikuti AD/ART Mathla&apos;ul Anwar.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Informasi KTA */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: 'var(--abu)', padding: '2rem', borderRadius: '16px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '1.5rem' }}>Keuntungan Memiliki KTA</h3>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <CheckCircle2 size={18} color="var(--emas)" />
                <span style={{ fontSize: '0.95rem', color: 'var(--teks-abu)' }}>Diakui secara resmi sebagai kader/anggota MA Jawa Tengah.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <ShieldCheck size={18} color="var(--emas)" />
                <span style={{ fontSize: '0.95rem', color: 'var(--teks-abu)' }}>Mendapatkan akses khusus ke Ruang Dokumen Kader.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <CreditCard size={18} color="var(--emas)" />
                <span style={{ fontSize: '0.95rem', color: 'var(--teks-abu)' }}>Prioritas kepesertaan dalam acara dan pelatihan organisasi.</span>
              </li>
            </ul>

            {/* Preview KTA Visual */}
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--teks)', marginBottom: '0.5rem', textAlign: 'center' }}>Contoh KTA Digital</div>
              <div style={{ 
                background: 'linear-gradient(135deg, var(--hijau-tua), #164e63)', 
                borderRadius: '12px', padding: '1.5rem', color: 'white', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', minHeight: '260px'
              }}>
                <div style={{ position: 'absolute', right: '0px', top: '10px', width: '120px', height: '120px', backgroundImage: 'url("/logo-ma.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.1 }}></div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
                  <img src="/logo-ma.png" alt="Logo MA" style={{ height: '35px', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--emas)' }}>KARTU TANDA ANGGOTA</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>MATHLA&apos;UL ANWAR JATENG</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '60px', height: '75px', background: '#cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Camera size={20} color="#94a3b8" /></div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>NAMA</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>AHMAD FULAN</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>NIA</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', fontFamily: 'monospace', color: 'var(--emas)' }}>3301.2026.001</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
