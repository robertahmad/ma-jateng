'use client'
import { useState } from 'react'
import { HelpCircle, Send, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayananUmat() {
  const [formData, setFormData] = useState({ nama: '', kontak: '', pertanyaan: '' })
  const [status, setStatus] = useState('idle') // idle, submitting, success

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/tanyajawab', {
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
        <div className="container" style={{ maxWidth: '600px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--emas)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(200, 169, 81, 0.3)' }}>
              <HelpCircle size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem' }}>Layanan Umat</h1>
            <p style={{ color: 'var(--teks-abu)', fontSize: '1.1rem', lineHeight: 1.6 }}>Sampaikan pertanyaan Anda seputar hukum Islam, ibadah, atau muamalah. Tim asatidz Mathla'ul Anwar Jawa Tengah akan segera menjawab melalui kontak Anda.</p>
          </div>

          {status === 'success' ? (
            <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <CheckCircle2 size={64} color="var(--emas)" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1rem' }}>Pertanyaan Terkirim!</h2>
              <p style={{ color: 'var(--teks-abu)', marginBottom: '2rem' }}>Alhamdulillah, pertanyaan Anda telah masuk ke meja redaksi kami. Tim asatidz akan segera meninjau dan mengirimkan jawaban melalui kontak yang Anda berikan.</p>
              <button onClick={() => { setStatus('idle'); setFormData({nama:'', kontak:'', pertanyaan:''}) }} className="btn-outline">Kirim Pertanyaan Lain</button>
            </div>
          ) : (
            <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" className="form-input" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Fulan bin Fulan" />
                </div>
                <div className="form-group">
                  <label className="form-label">No. WhatsApp / Email</label>
                  <input type="text" className="form-input" required value={formData.kontak} onChange={e => setFormData({...formData, kontak: e.target.value})} placeholder="08123456xxxx / fulan@email.com" />
                  <small style={{ color: 'var(--teks-abu)', marginTop: '0.5rem', display: 'block' }}>Jawaban akan dikirimkan ke kontak ini secara privat.</small>
                </div>
                <div className="form-group">
                  <label className="form-label">Pertanyaan Anda</label>
                  <textarea className="form-textarea" required value={formData.pertanyaan} onChange={e => setFormData({...formData, pertanyaan: e.target.value})} placeholder="Tuliskan detail pertanyaan Anda di sini..." style={{ minHeight: '150px' }}></textarea>
                </div>
                <button type="submit" className="btn-primary" disabled={status === 'submitting'} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '1rem' }}>
                  <Send size={20} /> {status === 'submitting' ? 'Mengirim...' : 'Kirim Pertanyaan'}
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
