'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

export default function AdminPengaturan() {
  const [formData, setFormData] = useState({
    nama_organisasi: '',
    alamat: '',
    telepon: '',
    email: '',
    whatsapp: '',
    nama_ketua: '',
    nama_sekretaris: '',
    nama_ketua_musma: '',
    nama_sekretaris_musma: '',
    ttd_ketua: '',
    ttd_sekretaris: '',
    stempel_wilayah: '',
    foto_ketua: '',
    sambutan_ketua: '',
    rekening_donasi: '',
    facebook: '',
    instagram: '',
    youtube: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/pengaturan')
        const data = await res.json()
        if (data.data) {
          // Gabungkan data dari DB dengan default state agar properti tetap ada meskipun DB kosong
          setFormData(prev => ({ ...prev, ...data.data }))
        }
      } catch (e) {
        toast.error('Gagal mengambil pengaturan')
      }
      setLoading(false)
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
    const loadingToast = toast.loading('Menyimpan pengaturan web...')
    
    try {
      const res = await fetch('/api/pengaturan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success('Pengaturan berhasil diperbarui!', { id: loadingToast })
      } else {
        toast.error('Gagal menyimpan pengaturan', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--teks-abu)' }}>
        Memuat konfigurasi sistem...
      </div>
    )
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Pengaturan Website</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Atur identitas organisasi, kontak, dan tautan sosial media.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
        
        {/* Identitas Organisasi */}
        <div className="card-admin">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Identitas & Kontak Utama
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Organisasi Lengkap</label>
              <input type="text" className="form-input" name="nama_organisasi" value={formData.nama_organisasi || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Email Resmi</label>
              <input type="email" className="form-input" name="email" value={formData.email || ''} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Nomor Telepon Kantor</label>
              <input type="text" className="form-input" name="telepon" value={formData.telepon || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp Admin (Untuk Tombol WA)</label>
              <input type="text" className="form-input" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} placeholder="Gunakan format: 628..." />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Lengkap Kantor Sekretariat</label>
            <textarea className="form-textarea" name="alamat" value={formData.alamat || ''} onChange={handleChange} style={{ minHeight: '80px' }}></textarea>
          </div>
        </div>

        {/* Profil Pimpinan */}
        <div className="card-admin">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Profil Pimpinan & Sambutan
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Ketua Umum / Pimpinan Wilayah</label>
              <input type="text" className="form-input" name="nama_ketua" value={formData.nama_ketua || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Nama Sekretaris Wilayah</label>
              <input type="text" className="form-input" name="nama_sekretaris" value={formData.nama_sekretaris || ''} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Pimpinan Wilayah MUSMA (Muslimat)</label>
              <input type="text" className="form-input" name="nama_ketua_musma" value={formData.nama_ketua_musma || ''} onChange={handleChange} placeholder="Kosongkan jika sama dengan MA" />
            </div>
            <div className="form-group">
              <label className="form-label">Nama Sekretaris Wilayah MUSMA</label>
              <input type="text" className="form-input" name="nama_sekretaris_musma" value={formData.nama_sekretaris_musma || ''} onChange={handleChange} placeholder="Kosongkan jika sama dengan MA" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Tanda Tangan Ketua (URL Gambar PNG transparan) - Untuk KTA</label>
              <input type="url" className="form-input" name="ttd_ketua" value={formData.ttd_ketua || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Tanda Tangan Sekretaris (URL Gambar PNG transparan) - Untuk KTA</label>
              <input type="url" className="form-input" name="ttd_sekretaris" value={formData.ttd_sekretaris || ''} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Stempel Wilayah (URL Gambar PNG transparan) - Untuk KTA</label>
              <input type="url" className="form-input" name="stempel_wilayah" value={formData.stempel_wilayah || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Foto Ketua (URL Gambar) - Untuk Sambutan Profil</label>
              <input type="url" className="form-input" name="foto_ketua" value={formData.foto_ketua || ''} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Teks Sambutan (Tampil di Halaman Profil)</label>
            <textarea className="form-textarea" name="sambutan_ketua" value={formData.sambutan_ketua || ''} onChange={handleChange} style={{ minHeight: '150px' }}></textarea>
          </div>
        </div>

        {/* Keuangan & Donasi */}
        <div className="card-admin">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Keuangan & Donasi
          </h2>
          
          <div className="form-group">
            <label className="form-label">Nomor Rekening Organisasi (Untuk Menampung Donasi)</label>
            <input type="text" className="form-input" name="rekening_donasi" value={formData.rekening_donasi || ''} onChange={handleChange} placeholder="Contoh: BSI 123456789 a.n Mathla'ul Anwar Jateng" />
          </div>
        </div>

        {/* Sosial Media */}
        <div className="card-admin">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Tautan Sosial Media
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Facebook (URL)</label>
              <input type="url" className="form-input" name="facebook" value={formData.facebook || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram (URL)</label>
              <input type="url" className="form-input" name="instagram" value={formData.instagram || ''} onChange={handleChange} placeholder="https://instagram.com/..." />
            </div>
            <div className="form-group">
              <label className="form-label">YouTube (URL)</label>
              <input type="url" className="form-input" name="youtube" value={formData.youtube || ''} onChange={handleChange} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', bottom: '2rem', zIndex: 10 }}>
          <button type="submit" className="btn-green" style={{ width: '100%', fontSize: '1.1rem', padding: '1.25rem', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} disabled={saving}>
            <Save size={24} />
            {saving ? 'Menyimpan...' : 'SIMPAN SEMUA PENGATURAN'}
          </button>
        </div>

      </form>
    </>
  )
}
