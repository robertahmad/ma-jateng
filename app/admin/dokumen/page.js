'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminDokumen() {
  const [dokumenList, setDokumenList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') 
  
  const [formData, setFormData] = useState({ 
    id: null, judul: '', file: '', kategori: 'Surat Keputusan (SK)', 
    ukuran: '', rahasia: false 
  })

  const fetchDokumen = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dokumen')
      const data = await res.json()
      setDokumenList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data dokumen')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDokumen()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/dokumen/${formData.id}` : '/api/dokumen'
    const method = isEdit ? 'PUT' : 'POST'

    const loadingToast = toast.loading('Menyimpan dokumen...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Dokumen diperbarui!' : 'Dokumen berhasil diunggah!', { id: loadingToast })
        setView('list')
        fetchDokumen()
      } else {
        toast.error('Gagal menyimpan dokumen', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini secara permanen?')) return
    try {
      const res = await fetch(`/api/dokumen/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Dokumen dihapus')
        fetchDokumen()
      }
    } catch (e) {
      toast.error('Gagal menghapus dokumen')
    }
  }

  const openForm = (item = null) => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({ 
        id: null, judul: '', file: '', kategori: 'Surat Keputusan (SK)', 
        ukuran: '', rahasia: false 
      })
    }
    setView('form')
  }

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Dokumen' : 'Unggah Dokumen Baru'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Atur file arsip dan hak akses (publik/rahasia).</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ color: 'var(--teks)', borderColor: '#e2e8f0' }}>
            Batal
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nama / Judul Dokumen</label>
              <input type="text" className="form-input" required
                value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} 
                placeholder="Cth: SK Susunan Pengurus Wilayah 2026-2031"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Tautan File (URL Google Drive / PDF)</label>
              <input type="url" className="form-input" required
                value={formData.file} onChange={e => setFormData({...formData, file: e.target.value})} 
                placeholder="https://drive.google.com/file/d/.../view"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Kategori Dokumen</label>
                <input type="text" className="form-input" required
                  value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} 
                  placeholder="Pilih atau ketik kategori baru" list="kategori-list"
                />
                <datalist id="kategori-list">
                  <option value="Surat Keputusan (SK)" />
                  <option value="Surat Edaran (SE)" />
                  <option value="AD/ART Organisasi" />
                  <option value="Modul Pelatihan / Kajian" />
                  <option value="Laporan Tahunan" />
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Perkiraan Ukuran (Opsional)</label>
                <input type="text" className="form-input"
                  value={formData.ukuran || ''} onChange={e => setFormData({...formData, ukuran: e.target.value})} 
                  placeholder="Cth: 2.5 MB"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem', background: formData.rahasia ? '#fef3c7' : '#f8fafc', border: `1px solid ${formData.rahasia ? '#fbbf24' : '#e2e8f0'}`, padding: '1.5rem', borderRadius: '12px', transition: 'all 0.3s' }}>
              <label style={{ display: 'flex', gap: '1rem', cursor: 'pointer', alignItems: 'flex-start' }}>
                <input type="checkbox" style={{ width: '20px', height: '20px', marginTop: '0.2rem' }}
                  checked={formData.rahasia} onChange={e => setFormData({...formData, rahasia: e.target.checked})} 
                />
                <div>
                  <div style={{ fontWeight: 700, color: formData.rahasia ? '#b45309' : 'var(--teks)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {formData.rahasia ? '🛡️ Dokumen Rahasia (Internal)' : '🌐 Dokumen Publik'}
                  </div>
                  <p style={{ color: formData.rahasia ? '#92400e' : 'var(--teks-abu)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {formData.rahasia 
                      ? 'Dokumen ini akan disembunyikan dari masyarakat umum dan HANYA bisa diunduh oleh kader yang memasukkan Kata Sandi (Password) Cabang.'
                      : 'Dokumen ini akan tampil secara bebas di halaman depan dan siapapun bisa mengunduhnya tanpa syarat.'
                    }
                  </p>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <button type="submit" className="btn-green">💾 Simpan Arsip</button>
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
          <h1>Kelola Dokumen & SK</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Pusat arsip file publik dan internal (Ruang Kader)</p>
        </div>
        <button onClick={() => openForm()} className="btn-green">
          + Unggah Dokumen Baru
        </button>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat arsip...</div>
        ) : (
          <table style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th width="35%">Judul Dokumen</th>
                <th width="20%">Kategori</th>
                <th width="20%">Hak Akses</th>
                <th width="15%">Tanggal</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dokumenList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Belum ada dokumen yang diunggah.
                  </td>
                </tr>
              ) : (
                dokumenList.map(doc => (
                  <tr key={doc.id} style={{ background: doc.rahasia ? '#fffbeb' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.2rem' }}>{doc.judul}</div>
                      <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none' }}>
                        🔗 Lihat File ({doc.ukuran || '?'})
                      </a>
                    </td>
                    <td><span className="card-tag">{doc.kategori}</span></td>
                    <td>
                      {doc.rahasia 
                        ? <span className="badge-aktif" style={{ background: '#fef3c7', color: '#d97706' }}>🛡️ RAHASIA KADER</span>
                        : <span className="badge-aktif" style={{ background: '#dbeafe', color: '#1e40af' }}>🌐 PUBLIK UMUM</span>
                      }
                    </td>
                    <td>{new Date(doc.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openForm(doc)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(doc.id)} className="btn-red">Hapus</button>
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
