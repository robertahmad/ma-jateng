'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminBerita() {
  const [beritaList, setBeritaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list', 'form'
  
  // State Form
  const [formData, setFormData] = useState({ id: null, judul: '', ringkasan: '', isi: '', kategori: 'Umum', diterbitkan: true, thumbnail: '' })

  const fetchBerita = async () => {
    setLoading(true)
    try {
      // Fetch semua berita (tanpa limit/filter rilis)
      const res = await fetch('/api/berita?limit=100')
      const data = await res.json()
      setBeritaList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data berita')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBerita()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/berita/${formData.id}` : '/api/berita'
    const method = isEdit ? 'PUT' : 'POST'

    const loadingToast = toast.loading('Menyimpan berita...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Berita diperbarui!' : 'Berita ditambahkan!', { id: loadingToast })
        setView('list')
        fetchBerita()
      } else {
        toast.error('Gagal menyimpan berita', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini secara permanen?')) return
    
    try {
      const res = await fetch(`/api/berita/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Berita dihapus')
        fetchBerita()
      }
    } catch (e) {
      toast.error('Gagal menghapus berita')
    }
  }

  const openForm = (berita = null) => {
    if (berita) {
      setFormData(berita)
    } else {
      setFormData({ id: null, judul: '', ringkasan: '', isi: '', kategori: 'Umum', diterbitkan: true, thumbnail: '' })
    }
    setView('form')
  }

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Berita' : 'Tulis Berita Baru'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Isi form di bawah untuk mempublikasikan berita ke website.</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ color: 'var(--teks)', borderColor: '#e2e8f0' }}>
            Batal & Kembali
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Judul Berita</label>
              <input type="text" className="form-input" required
                value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} 
                placeholder="Contoh: Rapat Kerja Wilayah MA Jateng 2026..."
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-select" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                  <option value="Umum">Umum</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Dakwah">Dakwah</option>
                  <option value="Sosial">Sosial</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status Rilis</label>
                <select className="form-select" value={formData.diterbitkan} onChange={e => setFormData({...formData, diterbitkan: e.target.value === 'true'})}>
                  <option value="true">Publikasikan Langsung</option>
                  <option value="false">Simpan sebagai Draf</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL Thumbnail (Opsional)</label>
              <input type="text" className="form-input" 
                value={formData.thumbnail || ''} onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                placeholder="https://link-gambar.com/foto.jpg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ringkasan (Tampil di halaman depan)</label>
              <textarea className="form-textarea" required style={{ minHeight: '80px' }}
                value={formData.ringkasan} onChange={e => setFormData({...formData, ringkasan: e.target.value})} 
                placeholder="Tulis ringkasan berita maksimal 2-3 kalimat..."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Isi Berita Lengkap</label>
              <textarea className="form-textarea" required style={{ minHeight: '300px' }}
                value={formData.isi} onChange={e => setFormData({...formData, isi: e.target.value})} 
                placeholder="Tuliskan detail berita lengkap di sini..."
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-green">💾 Simpan Berita</button>
            </div>
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Kelola Berita</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Manajemen artikel dan liputan organisasi</p>
        </div>
        <button onClick={() => openForm()} className="btn-green">
          + Tulis Berita Baru
        </button>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat data...</div>
        ) : (
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th width="40%">Judul Berita</th>
                <th width="15%">Kategori</th>
                <th width="15%">Status</th>
                <th width="15%">Tanggal</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {beritaList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Belum ada data berita. Silakan tambahkan berita baru.
                  </td>
                </tr>
              ) : (
                beritaList.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--teks)' }}>{b.judul}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', marginTop: '0.2rem' }}>/{b.slug}</div>
                    </td>
                    <td><span className="card-tag">{b.kategori}</span></td>
                    <td>
                      {b.diterbitkan 
                        ? <span className="badge-aktif">Terbit</span>
                        : <span className="badge-nonaktif">Draf</span>
                      }
                    </td>
                    <td>{new Date(b.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openForm(b)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(b.id)} className="btn-red">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
