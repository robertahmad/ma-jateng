'use client'
import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Link as LinkIcon, DownloadCloud } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminKhutbah() {
  const [arsip, setArsip] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({ judul: '', penulis: '', fileUrl: '' })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/khutbah')
      const json = await res.json()
      if (json.success) setArsip(json.data)
    } catch (e) {
      toast.error('Gagal mengambil data khutbah')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const loadingId = toast.loading('Mengunggah arsip...')
    try {
      const res = await fetch('/api/khutbah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Berhasil ditambahkan!', { id: loadingId })
        setFormData({ judul: '', penulis: '', fileUrl: '' })
        fetchData()
      } else {
        toast.error('Gagal menambahkan', { id: loadingId })
      }
    } catch (e) {
      toast.error('Kesalahan koneksi', { id: loadingId })
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus arsip khutbah ini?')) return
    const loadingId = toast.loading('Menghapus...')
    try {
      const res = await fetch(`/api/khutbah/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Dihapus!', { id: loadingId })
        fetchData()
      } else toast.error('Gagal', { id: loadingId })
    } catch (e) { toast.error('Kesalahan', { id: loadingId }) }
  }

  return (
    <div style={{ maxWidth: '1000px', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Form Tambah */}
      <div style={{ position: 'sticky', top: '2rem' }}>
        <div className="admin-topbar" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={24} color="var(--emas)" /> Arsip Baru
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="card-admin" style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Judul Tema Khutbah</label>
            <input type="text" className="form-input" required value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} placeholder="Keutamaan Bulan..." />
          </div>
          <div className="form-group">
            <label className="form-label">Penulis / Ustadz</label>
            <input type="text" className="form-input" required value={formData.penulis} onChange={e => setFormData({...formData, penulis: e.target.value})} placeholder="KH. Fulan bin Fulan" />
          </div>
          <div className="form-group">
            <label className="form-label">Tautan File PDF (G-Drive dll)</label>
            <input type="url" className="form-input" required value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} placeholder="https://drive.google.com/..." />
            <small style={{ color: 'var(--teks-abu)', display: 'block', marginTop: '0.5rem' }}>Upload file PDF ber-kop resmi MA ke Google Drive, lalu tempel tautannya di sini.</small>
          </div>
          <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
            <Plus size={20} /> {saving ? 'Menyimpan...' : 'Tambahkan ke Arsip'}
          </button>
        </form>
      </div>

      {/* Daftar Arsip */}
      <div>
        <div className="admin-topbar" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>Daftar Arsip Tersedia</h2>
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Memuat...</div> : 
         arsip.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <DownloadCloud size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--teks)' }}>Belum Ada Arsip Khutbah</h3>
            <p style={{ color: 'var(--teks-abu)' }}>Tambahkan naskah khutbah pertama Anda di form sebelah kiri.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {arsip.map((item) => (
              <div key={item.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '0.25rem' }}>{item.judul}</h3>
                  <div style={{ color: 'var(--teks-abu)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Oleh: <strong style={{ color: 'var(--emas)' }}>{item.penulis}</strong></span>
                    <span>• {new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <LinkIcon size={16} /> Buka File
                  </a>
                  <button onClick={() => handleDelete(item.id)} className="btn-outline" style={{ padding: '0.5rem 1rem', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
