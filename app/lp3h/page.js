'use client'
import { useState } from 'react'
import { Store, Send, CheckCircle2, ShieldCheck, FileBadge, BookOpenCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayananHalalPage() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    kontak: '',
    namaUsaha: '',
    jenisLayanan: 'SERTIFIKASI_HALAL',
    alamat: ''
  })
  const [status, setStatus] = useState('idle') // idle, submitting, success

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/lp3h', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) setStatus('success')
      else setStatus('idle')
    } catch (e) {
      setStatus('idle')
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          {/* Hero / Header LP3H */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--hijau-tua)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(15, 45, 20, 0.2)' }}>
              <ShieldCheck size={40} color="var(--emas)" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem' }}>Pusat Layanan Halal (LP3H)</h1>
            <p style={{ color: 'var(--teks-abu)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
              Lembaga Pendamping Proses Produk Halal Mathla'ul Anwar siap mendampingi UMKM dan industri rumahan dalam mengurus Sertifikasi Halal Gratis (SEHATI) dan legalitas NIB.
            </p>
          </div>

          {/* Cards Layanan */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <BookOpenCheck size={32} color="var(--hijau-tua)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pelatihan Pendamping</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--teks-abu)' }}>Daftar menjadi Pendamping P3H bersertifikat untuk membantu proses sertifikasi halal UMKM.</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', borderTop: '4px solid var(--emas)' }}>
              <Store size={32} color="var(--emas)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sertifikasi Halal</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--teks-abu)' }}>Pendampingan pendaftaran Sertifikat Halal Gratis (SEHATI) untuk produk makanan & minuman.</p>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <FileBadge size={32} color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pembuatan NIB</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--teks-abu)' }}>Fasilitasi pendaftaran Nomor Induk Berusaha (NIB) berbasis risiko melalui sistem OSS.</p>
            </div>
          </div>

          {/* Form Pendaftaran */}
          {status === 'success' ? (
            <div style={{ background: 'white', padding: '4rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
              <CheckCircle2 size={64} color="var(--emas)" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem' }}>Pendaftaran Berhasil!</h2>
              <p style={{ color: 'var(--teks-abu)', marginBottom: '2rem', lineHeight: 1.6 }}>Data Anda telah masuk ke dalam antrean LP3H Mathla'ul Anwar. Tim pendamping kami akan segera menghubungi Anda via WhatsApp untuk meminta kelengkapan berkas.</p>
              <button onClick={() => { setStatus('idle'); setFormData({...formData, namaLengkap:'', namaUsaha:'', alamat:''}) }} className="btn-outline">Kembali</button>
            </div>
          ) : (
            <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Formulir Pendaftaran</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Pilih Layanan</label>
                  <select className="form-input" value={formData.jenisLayanan} onChange={e => setFormData({...formData, jenisLayanan: e.target.value})} required style={{ background: 'white' }}>
                    <option value="SERTIFIKASI_HALAL">Sertifikasi Halal (UMKM / Industri Rumahan)</option>
                    <option value="PEMBUATAN_NIB">Pembuatan NIB (Nomor Induk Berusaha)</option>
                    <option value="PELATIHAN_P3H">Pendaftaran Peserta Pelatihan Pendamping (P3H)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap Pemohon</label>
                  <input type="text" className="form-input" required value={formData.namaLengkap} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} placeholder="Sesuai KTP" />
                </div>
                <div className="form-group">
                  <label className="form-label">No. WhatsApp Aktif</label>
                  <input type="text" className="form-input" required value={formData.kontak} onChange={e => setFormData({...formData, kontak: e.target.value})} placeholder="08123456xxxx" />
                  <small style={{ color: 'var(--emas)', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>Pastikan nomor aktif, Pendamping LP3H akan menghubungi Anda via WA.</small>
                </div>
                
                {formData.jenisLayanan !== 'PELATIHAN_P3H' && (
                  <div className="form-group">
                    <label className="form-label">Nama Usaha / Merek Produk</label>
                    <input type="text" className="form-input" required={formData.jenisLayanan !== 'PELATIHAN_P3H'} value={formData.namaUsaha} onChange={e => setFormData({...formData, namaUsaha: e.target.value})} placeholder="Cth: Keripik Singkong Barokah" />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Alamat Lengkap (Domisili / Lokasi Usaha)</label>
                  <textarea className="form-textarea" required value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} placeholder="Alamat lengkap, Desa, Kecamatan, Kab/Kota..." style={{ minHeight: '100px' }}></textarea>
                </div>

                <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--hijau-tua)', fontSize: '0.85rem', color: 'var(--teks-abu)' }}>
                  <strong>Informasi Pemberkasan:</strong> Kelengkapan dokumen fisik / foto seperti KTP, Pasfoto, dan Foto Produk akan diminta secara terpisah oleh petugas kami melalui WhatsApp setelah formulir ini dikirim.
                </div>

                <button type="submit" className="btn-primary" disabled={status === 'submitting'} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '1rem', marginTop: '1rem' }}>
                  <Send size={20} /> {status === 'submitting' ? 'Memproses...' : 'Kirim Pendaftaran'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}
