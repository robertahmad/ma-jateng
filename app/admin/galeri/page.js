'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getDirectImageUrl } from '@/lib/image'

export default function AdminGaleri() {
  const [galeriList, setGaleriList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') 
  
  const [formData, setFormData] = useState({ id: null, judul: '', jenis: 'Foto', foto: '', linkVideo: '', album: 'Kegiatan Umum', keterangan: '' })

  const fetchGaleri = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/galeri')
      const data = await res.json()
      setGaleriList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data galeri')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGaleri()
  }, [])

  // Ekstrak ID YouTube untuk mendapatkan thumbnail otomatis
  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/galeri/${formData.id}` : '/api/galeri'
    const method = isEdit ? 'PUT' : 'POST'

    // Jika video, otomatis buatkan thumbnail dari YouTube jika kolom foto kosong
    let finalData = { ...formData }
    if (finalData.jenis === 'Video' && finalData.linkVideo) {
      const ytId = extractYoutubeId(finalData.linkVideo)
      if (ytId && !finalData.foto) {
        finalData.foto = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      }
    }

    const loadingToast = toast.loading('Menyimpan ke galeri...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Data galeri diperbarui!' : 'Berhasil ditambahkan ke galeri!', { id: loadingToast })
        setView('list')
        fetchGaleri()
      } else {
        toast.error('Gagal menyimpan data', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return
    try {
      const res = await fetch(`/api/galeri/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Data dihapus')
        fetchGaleri()
      }
    } catch (e) {
      toast.error('Gagal menghapus data')
    }
  }

  const openForm = (item = null) => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({ id: null, judul: '', jenis: 'Foto', foto: '', linkVideo: '', album: 'Kegiatan Umum', keterangan: '' })
    }
    setView('form')
  }

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Data Galeri' : 'Tambah Ke Galeri'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Unggah foto atau tautkan video YouTube.</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ color: 'var(--teks)', borderColor: '#e2e8f0' }}>
            Batal
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Jenis Media</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="jenis" value="Foto" checked={formData.jenis === 'Foto'} onChange={() => setFormData({...formData, jenis: 'Foto'})} />
                  📸 Foto Biasa
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="jenis" value="Video" checked={formData.jenis === 'Video'} onChange={() => setFormData({...formData, jenis: 'Video'})} />
                  🎥 Video YouTube
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Judul {formData.jenis}</label>
              <input type="text" className="form-input" required
                value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} 
                placeholder="Cth: Penyerahan Simbolis SK Wilayah"
              />
            </div>
            
            {formData.jenis === 'Video' && (
              <div className="form-group">
                <label className="form-label">Tautan Video YouTube</label>
                <input type="url" className="form-input" required
                  value={formData.linkVideo || ''} onChange={e => setFormData({...formData, linkVideo: e.target.value})} 
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{formData.jenis === 'Foto' ? 'URL Gambar' : 'URL Thumbnail (Opsional)'}</label>
              <input type="url" className="form-input" required={formData.jenis === 'Foto'}
                value={formData.foto || ''} onChange={e => setFormData({...formData, foto: e.target.value})} 
                placeholder="https://link-gambar.com/foto.jpg"
              />
              {formData.jenis === 'Video' && (
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                  *Jika dikosongkan, sistem akan otomatis mengambil thumbnail dari video YouTube.
                </p>
              )}
            </div>

            {formData.foto && formData.jenis === 'Foto' && (
              <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teks-abu)', marginBottom: '0.5rem' }}>Pratinjau Gambar:</p>
                <img src={getDirectImageUrl(formData.foto)} alt="Pratinjau" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nama Album</label>
              <input type="text" className="form-input" required
                value={formData.album} onChange={e => setFormData({...formData, album: e.target.value})} 
                list="album-list"
              />
              <datalist id="album-list">
                <option value="Kegiatan Umum" />
                <option value="Musyawarah Wilayah" />
                <option value="Pendidikan & Dakwah" />
                <option value="Video Kajian" />
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Keterangan / Caption (Opsional)</label>
              <textarea className="form-textarea" style={{ minHeight: '80px' }}
                value={formData.keterangan || ''} onChange={e => setFormData({...formData, keterangan: e.target.value})} 
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-green">💾 Simpan {formData.jenis}</button>
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
          <h1>Kelola Galeri</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Arsip foto dan video dokumentasi kegiatan</p>
        </div>
        <button onClick={() => openForm()} className="btn-green">
          + Tambah Galeri
        </button>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat galeri...</div>
        ) : (
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th width="15%">Pratinjau</th>
                <th width="35%">Judul</th>
                <th width="10%">Jenis</th>
                <th width="15%">Album</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {galeriList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Belum ada media yang diunggah.
                  </td>
                </tr>
              ) : (
                galeriList.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                        <img src={getDirectImageUrl(g.foto)} alt={g.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
                        {g.jenis === 'Video' && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>▶️</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--teks)', marginBottom: '0.2rem' }}>{g.judul}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)' }}>{g.keterangan || '-'}</div>
                    </td>
                    <td>
                      {g.jenis === 'Video' ? <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>🎥 Video</span> : <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem' }}>📸 Foto</span>}
                    </td>
                    <td><span className="card-tag">{g.album}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openForm(g)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(g.id)} className="btn-red">Hapus</button>
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
