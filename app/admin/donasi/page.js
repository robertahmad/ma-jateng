'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminDonasi() {
  const [programList, setProgramList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') 
  
  const [formData, setFormData] = useState({ 
    id: null, judul: '', deskripsi: '', targetDana: 0, terkumpul: 0, 
    status: 'AKTIF', gambar: '', kategori: 'UMUM' 
  })

  const fetchProgram = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/donasi')
      const data = await res.json()
      setProgramList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data program donasi')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProgram()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/donasi/${formData.id}` : '/api/donasi'
    const method = isEdit ? 'PUT' : 'POST'

    // Parsing number untuk target dan terkumpul
    const payload = {
      ...formData,
      targetDana: Number(formData.targetDana),
      terkumpul: Number(formData.terkumpul)
    }

    const loadingToast = toast.loading('Menyimpan program donasi...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Program diperbarui!' : 'Program donasi dibuat!', { id: loadingToast })
        setView('list')
        fetchProgram()
      } else {
        toast.error('Gagal menyimpan program', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program donasi ini? (Tindakan ini tidak bisa dibatalkan)')) return
    try {
      const res = await fetch(`/api/donasi/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Program dihapus')
        fetchProgram()
      }
    } catch (e) {
      toast.error('Gagal menghapus program')
    }
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
  }

  const openForm = (item = null) => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({ 
        id: null, judul: '', deskripsi: '', targetDana: 0, terkumpul: 0, 
        status: 'AKTIF', gambar: '', kategori: 'UMUM' 
      })
    }
    setView('form')
  }

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Program Donasi' : 'Buat Program Donasi Baru'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Atur penggalangan dana umat (Infaq & Sedekah).</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ color: 'var(--teks)', borderColor: '#e2e8f0' }}>
            Batal
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Nama Program / Kampanye</label>
                  <input type="text" className="form-input" required
                    value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} 
                    placeholder="Cth: Pembangunan Gedung Dakwah MA Jateng"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori (ZISWAF)</label>
                  <select className="form-select" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})}>
                    <option value="UMUM">Donasi Umum</option>
                    <option value="ZAKAT">Zakat</option>
                    <option value="INFAQ">Infaq / Sedekah</option>
                    <option value="WAKAF">Wakaf</option>
                    <option value="HIBAH">Hibah</option>
                  </select>
                </div>
              </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Target Dana (Rp)</label>
                <input type="number" className="form-input" required min="0"
                  value={formData.targetDana} onChange={e => setFormData({...formData, targetDana: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Dana Terkumpul Saat Ini (Rp)</label>
                <input type="number" className="form-input" required min="0"
                  value={formData.terkumpul} onChange={e => setFormData({...formData, terkumpul: e.target.value})} 
                />
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>*Bisa diisi manual jika donasi via transfer/tunai.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Status Program</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="AKTIF">AKTIF (Menerima Donasi)</option>
                  <option value="SELESAI">SELESAI (Ditutup)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gambar Poster/Banner (URL)</label>
                <input type="url" className="form-input"
                  value={formData.gambar || ''} onChange={e => setFormData({...formData, gambar: e.target.value})} 
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi & Ajakan Donasi</label>
              <textarea className="form-textarea" required style={{ minHeight: '120px' }}
                value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
                placeholder="Tuliskan alasan mengapa umat perlu berdonasi pada program ini..."
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-green">💾 Simpan Program</button>
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
          <h1>Program Donasi</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Manajemen penggalangan dana infaq dan sedekah umat</p>
        </div>
        <button onClick={() => openForm()} className="btn-green">
          + Buat Program Donasi
        </button>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat data donasi...</div>
        ) : (
          <table style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th width="35%">Nama Program</th>
                <th width="20%">Pencapaian Dana</th>
                <th width="15%">Progress</th>
                <th width="15%">Status</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {programList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Belum ada program penggalangan dana.
                  </td>
                </tr>
              ) : (
                programList.map(p => {
                  const target = Number(p.targetDana)
                  const terkumpul = Number(p.terkumpul)
                  const persen = target === 0 ? 0 : Math.min(Math.round((terkumpul / target) * 100), 100)
                  
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.2rem' }}>{p.judul}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)' }}>/{p.slug}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--hijau-tua)', fontSize: '1.05rem' }}>{formatRupiah(terkumpul)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)' }}>Target: {formatRupiah(target)}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>{persen}%</div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${persen}%`, height: '100%', background: 'var(--emas)', borderRadius: '999px' }}></div>
                        </div>
                      </td>
                      <td>
                        {p.status === 'AKTIF' 
                          ? <span className="badge-aktif" style={{ background: '#dcfce7', color: '#16a34a' }}>🚀 AKTIF</span>
                          : <span className="badge-nonaktif">🔒 SELESAI</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openForm(p)} className="btn-edit">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="btn-red">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
