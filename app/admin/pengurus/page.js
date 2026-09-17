'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/image'

export default function AdminPengurus() {
  const [pengurusList, setPengurusList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') 
  const [activeTab, setActiveTab] = useState('MA Jateng')
  
  const [formData, setFormData] = useState({ 
    id: null, nama: '', jabatan: '', foto: '', urutan: 1, kategoriOrganisasi: 'MA Jateng' 
  })

  const fetchPengurus = async (tab = activeTab) => {
    setLoading(true)
    try {
      const res = await fetch('/api/pengurus?kategoriOrganisasi=' + tab)
      const data = await res.json()
      setPengurusList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data pengurus')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPengurus(activeTab)
  }, [activeTab])

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/pengurus/${formData.id}` : '/api/pengurus'
    const method = isEdit ? 'PUT' : 'POST'

    const loadingToast = toast.loading('Menyimpan data pengurus...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Data diperbarui!' : 'Pengurus baru ditambahkan!', { id: loadingToast })
        setView('list')
        fetchPengurus()
      } else {
        toast.error('Gagal menyimpan data', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus pengurus ini dari struktur?')) return
    try {
      const res = await fetch(`/api/pengurus/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Data dihapus')
        fetchPengurus()
      }
    } catch (e) {
      toast.error('Gagal menghapus data')
    }
  }

  const openForm = (item = null) => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({ id: null, nama: '', jabatan: '', foto: '', urutan: pengurusList.length + 1, kategoriOrganisasi: activeTab })
    }
    setView('form')
  }

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Pengurus' : 'Tambah Pengurus'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Atur posisi dan profil dalam struktur wilayah.</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap & Gelar</label>
              <input type="text" className="form-input" required
                value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                placeholder="Cth: Dr. H. Fulan, M.Ag."
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Jabatan (Tampil di KTA & Profil)</label>
                <input type="text" className="form-input" required
                  value={formData.jabatan} onChange={e => setFormData({...formData, jabatan: e.target.value})} 
                  placeholder="Cth: Wakil Ketua"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kategori Organisasi</label>
                <select className="form-select" value={formData.kategoriOrganisasi} onChange={e => setFormData({...formData, kategoriOrganisasi: e.target.value})}>
                  <option value="MA Jateng">MA Jateng</option>
                  <option value="PWMUSMA Jateng">PWMUSMA Jateng (Muslimat)</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Nomor Urut Tampil</label>
              <input type="number" className="form-input" required min="1"
                value={formData.urutan} onChange={e => setFormData({...formData, urutan: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pas Foto (URL Gambar)</label>
              <input type="url" className="form-input"
                value={formData.foto || ''} onChange={e => setFormData({...formData, foto: e.target.value})} 
                placeholder="https://..."
              />
              {formData.foto && (
                <div style={{ marginTop: '1rem', width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                  <img src={getDirectImageUrl(formData.foto)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <button type="submit" className="btn-green" style={{ alignSelf: 'flex-start', padding: '0.85rem 2rem' }}>
              Simpan Data
            </button>
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Struktur Pengurus</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Kelola data pengurus yang tampil di halaman profil</p>
        </div>
        <button onClick={() => openForm()} className="btn-green" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Tambah Pengurus
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'white', padding: '0.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <button onClick={() => setActiveTab('MA Jateng')} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: activeTab === 'MA Jateng' ? 'var(--hijau-tua)' : 'transparent', color: activeTab === 'MA Jateng' ? 'white' : 'var(--teks-abu)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Struktur MA Jateng</button>
        <button onClick={() => setActiveTab('PWMUSMA Jateng')} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: activeTab === 'PWMUSMA Jateng' ? '#10b981' : 'transparent', color: activeTab === 'PWMUSMA Jateng' ? 'white' : 'var(--teks-abu)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Struktur PWMUSMA Jateng</button>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat struktur...</div>
        ) : (
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th width="10%">Urutan</th>
                <th width="15%">Foto</th>
                <th width="35%">Nama & Jabatan</th>
                <th width="20%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengurusList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Struktur pengurus masih kosong. Tambahkan data pertama Anda.
                  </td>
                </tr>
              ) : (
                pengurusList.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ width: '30px', height: '30px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {p.urutan}
                      </div>
                    </td>
                    <td>
                      {p.foto ? (
                         <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                           <img src={getDirectImageUrl(p.foto)} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                         </div>
                      ) : (
                         <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                           <ImageIcon size={20} />
                         </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--teks)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{p.nama}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--emas)', fontWeight: 700 }}>{p.jabatan}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openForm(p)} className="btn-edit" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Edit2 size={14}/> Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="btn-red" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Trash2 size={14}/> Hapus</button>
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
