'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminAgenda() {
  const [agendaList, setAgendaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') 
  
  const [formData, setFormData] = useState({ 
    id: null, judul: '', deskripsi: '', 
    tanggalMulai: '', tanggalSelesai: '', 
    lokasi: '', penyelenggara: '' 
  })

  const fetchAgenda = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/agenda?limit=100')
      const data = await res.json()
      setAgendaList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data agenda')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAgenda()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const isEdit = formData.id !== null
    const url = isEdit ? `/api/agenda/${formData.id}` : '/api/agenda'
    const method = isEdit ? 'PUT' : 'POST'

    // Format data sebelum dikirim
    const payload = {
      ...formData,
      tanggalMulai: new Date(formData.tanggalMulai).toISOString(),
      tanggalSelesai: formData.tanggalSelesai ? new Date(formData.tanggalSelesai).toISOString() : null,
    }

    const loadingToast = toast.loading('Menyimpan jadwal agenda...')
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        toast.success(isEdit ? 'Agenda diperbarui!' : 'Agenda ditambahkan!', { id: loadingToast })
        setView('list')
        fetchAgenda()
      } else {
        toast.error('Gagal menyimpan agenda', { id: loadingToast })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus jadwal kegiatan ini?')) return
    try {
      const res = await fetch(`/api/agenda/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Agenda dihapus')
        fetchAgenda()
      }
    } catch (e) {
      toast.error('Gagal menghapus agenda')
    }
  }

  // Format date untuk mengisi value input datetime-local HTML (YYYY-MM-DDThh:mm)
  const formatForInput = (isoString) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    // Offset local timezone
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0,16)
  }

  const openForm = (agenda = null) => {
    if (agenda) {
      setFormData({
        ...agenda,
        tanggalMulai: formatForInput(agenda.tanggalMulai),
        tanggalSelesai: formatForInput(agenda.tanggalSelesai),
        penyelenggara: agenda.penyelenggara || ''
      })
    } else {
      setFormData({ id: null, judul: '', deskripsi: '', tanggalMulai: '', tanggalSelesai: '', lokasi: '', penyelenggara: '' })
    }
    setView('form')
  }

  if (view === 'form') {
    return (
      <>
        <div className="admin-topbar">
          <div>
            <h1>{formData.id ? 'Edit Agenda' : 'Tambah Jadwal Kegiatan'}</h1>
            <p style={{ color: 'var(--teks-abu)' }}>Masukkan detail jadwal dan lokasi secara akurat.</p>
          </div>
          <button onClick={() => setView('list')} className="btn-outline" style={{ color: 'var(--teks)', borderColor: '#e2e8f0' }}>
            Batal
          </button>
        </div>

        <div className="card-admin" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nama Kegiatan / Acara</label>
              <input type="text" className="form-input" required
                value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} 
                placeholder="Cth: Musyawarah Wilayah 2026..."
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Tanggal & Waktu Mulai</label>
                <input type="datetime-local" className="form-input" required
                  value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Selesai (Opsional)</label>
                <input type="datetime-local" className="form-input"
                  value={formData.tanggalSelesai} onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Lokasi / Tempat</label>
                <input type="text" className="form-input" required
                  value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} 
                  placeholder="Cth: Aula Kantor PW MA Jateng"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Penyelenggara (Opsional)</label>
                <input type="text" className="form-input"
                  value={formData.penyelenggara} onChange={e => setFormData({...formData, penyelenggara: e.target.value})} 
                  placeholder="Cth: Panitia Wilayah"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi Singkat Acara</label>
              <textarea className="form-textarea" required style={{ minHeight: '120px' }}
                value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
                placeholder="Jelaskan secara ringkas tentang acara ini..."
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-green">💾 Simpan Jadwal</button>
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
          <h1>Kelola Agenda</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Daftar seluruh jadwal kegiatan MA Jateng</p>
        </div>
        <button onClick={() => openForm()} className="btn-green">
          + Tambah Agenda
        </button>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat kalender...</div>
        ) : (
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th width="15%">Waktu Mulai</th>
                <th width="35%">Nama Kegiatan</th>
                <th width="20%">Lokasi</th>
                <th width="15%">Penyelenggara</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {agendaList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Tidak ada agenda kegiatan.
                  </td>
                </tr>
              ) : (
                agendaList.map(a => {
                  const tgl = new Date(a.tanggalMulai)
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--hijau-tua)' }}>
                          {tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)' }}>
                          Pukul {tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--teks)', marginBottom: '0.2rem' }}>{a.judul}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--teks-abu)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{a.deskripsi}</div>
                      </td>
                      <td><span style={{ fontSize: '0.85rem' }}>📍 {a.lokasi}</span></td>
                      <td>{a.penyelenggara || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openForm(a)} className="btn-edit">Edit</button>
                          <button onClick={() => handleDelete(a.id)} className="btn-red">Hapus</button>
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
