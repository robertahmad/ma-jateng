'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminLembaga() {
  const [lembagaList, setLembagaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') 
  
  const [formData, setFormData] = useState({ 
    id: null, nama: '', jenjang: 'MA', kabupaten: '', kecamatan: '', 
    alamat: '', telepon: '', kepala: '', status: 'Aktif' 
  })

  const [filterKabupaten, setFilterKabupaten] = useState('')

  const fetchLembaga = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lembaga')
      const data = await res.json()
      setLembagaList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data lembaga')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLembaga()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/lembaga/${formData.id}` : '/api/lembaga'
    const method = isEdit ? 'PUT' : 'POST'

    const loadingToast = toast.loading('Menyimpan data lembaga...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Data diperbarui!' : 'Lembaga berhasil ditambahkan!', { id: loadingToast })
        setView('list')
        fetchLembaga()
      } else {
        toast.error('Gagal menyimpan data', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus data lembaga ini secara permanen?')) return
    try {
      const res = await fetch(`/api/lembaga/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Data dihapus')
        fetchLembaga()
      }
    } catch (e) {
      toast.error('Gagal menghapus data')
    }
  }

  const openForm = (item = null) => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({ 
        id: null, nama: '', jenjang: 'MA', kabupaten: '', kecamatan: '', 
        alamat: '', telepon: '', kepala: '', status: 'Aktif' 
      })
    }
    setView('form')
  }

  const uniqueKabupaten = [...new Set(lembagaList.map(l => l.kabupaten))]
  const filteredList = filterKabupaten ? lembagaList.filter(l => l.kabupaten === filterKabupaten) : lembagaList

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Data Lembaga' : 'Tambah Lembaga Pendidikan'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Lengkapi informasi profil madrasah/sekolah.</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ color: 'var(--teks)', borderColor: '#e2e8f0' }}>
            Batal
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Lembaga</label>
                <input type="text" className="form-input" required
                  value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} 
                  placeholder="Cth: MA Mathla'ul Anwar Demak"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Jenjang Pendidikan</label>
                <select className="form-select" value={formData.jenjang} onChange={e => setFormData({...formData, jenjang: e.target.value})}>
                  <option value="MA">Madrasah Aliyah (MA/SMA)</option>
                  <option value="MTs">Madrasah Tsanawiyah (MTs/SMP)</option>
                  <option value="MI">Madrasah Ibtidaiyah (MI/SD)</option>
                  <option value="RA">Raudhatul Athfal (RA)</option>
                  <option value="PAUD">PAUD / TK</option>
                  <option value="Pesantren">Pondok Pesantren</option>
                  <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Kabupaten / Kota</label>
                <input type="text" className="form-input" required
                  value={formData.kabupaten} onChange={e => setFormData({...formData, kabupaten: e.target.value})} 
                  placeholder="Cth: Kota Semarang" list="kabupaten-list"
                />
                <datalist id="kabupaten-list">
                  {uniqueKabupaten.map(k => <option key={k} value={k} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Kecamatan (Opsional)</label>
                <input type="text" className="form-input"
                  value={formData.kecamatan || ''} onChange={e => setFormData({...formData, kecamatan: e.target.value})} 
                  placeholder="Cth: Pedurungan"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              <textarea className="form-textarea" required style={{ minHeight: '80px' }}
                value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} 
                placeholder="Jalan, RT/RW, Kelurahan/Desa..."
              ></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Kepala / Mudir</label>
                <input type="text" className="form-input"
                  value={formData.kepala || ''} onChange={e => setFormData({...formData, kepala: e.target.value})} 
                  placeholder="Nama Lengkap & Gelar"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nomor Telepon</label>
                <input type="text" className="form-input"
                  value={formData.telepon || ''} onChange={e => setFormData({...formData, telepon: e.target.value})} 
                  placeholder="08..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status Operasional</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif / Tutup</option>
                  <option value="Persiapan">Persiapan / Pembangunan</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-green">💾 Simpan Data Lembaga</button>
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
          <h1>Kelola Data Lembaga</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Pangkalan data amal usaha dan pendidikan MA Jateng</p>
        </div>
        <button onClick={() => openForm()} className="btn-green">
          + Tambah Lembaga
        </button>
      </div>

      <div className="card-admin" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc' }}>
        <span style={{ fontWeight: 600, color: 'var(--teks-abu)' }}>Filter Wilayah:</span>
        <select className="form-select" style={{ maxWidth: '250px' }} value={filterKabupaten} onChange={e => setFilterKabupaten(e.target.value)}>
          <option value="">Semua Kabupaten / Kota</option>
          {uniqueKabupaten.map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--teks-abu)' }}>
          Total Data: <strong>{filteredList.length}</strong> Lembaga
        </span>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat pangkalan data...</div>
        ) : (
          <table style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th width="30%">Nama Lembaga & Jenjang</th>
                <th width="20%">Wilayah</th>
                <th width="20%">Kepala & Kontak</th>
                <th width="15%">Status</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Tidak ada data lembaga yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredList.map(l => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.2rem' }}>{l.nama}</div>
                      <span className="card-tag" style={{ background: '#e2e8f0', color: '#475569' }}>{l.jenjang}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--hijau-tua)' }}>{l.kabupaten}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)' }}>Kec. {l.kecamatan || '-'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--teks)', fontWeight: 600 }}>👤 {l.kepala || '-'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--teks-abu)' }}>📞 {l.telepon || '-'}</div>
                    </td>
                    <td>
                      {l.status === 'Aktif' 
                        ? <span className="badge-aktif">Aktif</span>
                        : l.status === 'Nonaktif' ? <span className="badge-nonaktif">Nonaktif</span>
                        : <span className="badge-aktif" style={{ background: '#fef9c3', color: '#854d0e' }}>Persiapan</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openForm(l)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(l.id)} className="btn-red">Hapus</button>
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
