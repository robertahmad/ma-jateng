'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function AdminMimbar() {
  const [formData, setFormData] = useState({
    kutipan_jenis: 'Ayat Al-Quran',
    kutipan_teks: '',
    kutipan_sumber: '',
    kutipan_tanggal: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/pengaturan')
        const data = await res.json()
        if (data.data) {
          setFormData(prev => ({
            ...prev,
            kutipan_jenis: data.data.kutipan_jenis || 'Ayat Al-Quran',
            kutipan_teks: data.data.kutipan_teks || '',
            kutipan_sumber: data.data.kutipan_sumber || '',
            kutipan_tanggal: data.data.kutipan_tanggal || ''
          }))
        }
      } catch (e) {
        toast.error('Gagal mengambil data mimbar')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    // Otomatis update tanggal hari ini saat disimpan
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    const updatedData = { ...formData, kutipan_tanggal: today + ' WIB' }

    const loadingToast = toast.loading('Menyimpan pembaruan Mimbar...')
    try {
      const res = await fetch('/api/pengaturan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (res.ok) {
        toast.success('Mimbar harian berhasil diperbarui!', { id: loadingToast })
        setFormData(updatedData)
      } else {
        toast.error('Gagal menyimpan data', { id: loadingToast })
      }
    } catch (e) {
      toast.error('Terjadi kesalahan koneksi', { id: loadingToast })
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat data mimbar...</div>

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="admin-topbar">
        <div>
          <h1>Mimbar Harian</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Update kutipan hari ini untuk ditampilkan di Beranda. Tanggal update akan otomatis tercatat saat Anda menekan tombol simpan.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="card-admin">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            
            <div className="form-group">
              <label className="form-label">Pilih Jenis Kutipan</label>
              <select className="form-input" name="kutipan_jenis" value={formData.kutipan_jenis} onChange={handleChange} required style={{ background: 'white' }}>
                <option value="Ayat Al-Quran">Ayat Al-Quran</option>
                <option value="Hadits Nabi">Hadits Nabi</option>
                <option value="Dzikir / Doa">Dzikir / Doa</option>
                <option value="Hikmah Ulama">Kalam Ulama / Hikmah</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Teks Kutipan</label>
              <textarea 
                className="form-textarea" 
                name="kutipan_teks" 
                value={formData.kutipan_teks} 
                onChange={handleChange} 
                required 
                style={{ minHeight: '150px', fontSize: '1.1rem' }}
                placeholder={
                  formData.kutipan_jenis === 'Ayat Al-Quran' ? '"Sesungguhnya bersama kesulitan ada kemudahan..."' : 
                  formData.kutipan_jenis === 'Hadits Nabi' ? '"Sebaik-baik manusia adalah yang paling bermanfaat..."' :
                  '"Subhanallah Wabihamdih, Subhanallahil Adzim..."'
                }
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Sumber / Riwayat (Surat & Ayat / Perawi)</label>
              <input 
                type="text" 
                className="form-input" 
                name="kutipan_sumber" 
                value={formData.kutipan_sumber} 
                onChange={handleChange} 
                required 
                placeholder="Cth: QS. Al-Insyirah: 5-6 / HR. Bukhari"
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.9rem', color: 'var(--teks-abu)' }}>
              <strong>Info:</strong> Waktu update terakhir tercatat pada: <span style={{ color: 'var(--hijau-tua)', fontWeight: 'bold' }}>{formData.kutipan_tanggal || 'Belum ada'}</span>
            </div>

          </div>
        </div>

        <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10, marginTop: '2rem' }}>
          <button type="submit" className="btn-green" style={{ width: '100%', fontSize: '1.1rem', padding: '1.25rem', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} disabled={saving}>
            <Save size={24} />
            {saving ? 'Menyiarkan...' : 'SIARKAN KUTIPAN HARI INI'}
          </button>
        </div>
      </form>
    </div>
  )
}
