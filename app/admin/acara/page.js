'use client'
import { useState, useEffect } from 'react'
import { Ticket, Plus, Calendar, MapPin, Trash2, Edit, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminAcara() {
  const [acara, setAcara] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nama: '', tanggal: '', tempat: '', background: '' })

  const fetchAcara = async () => {
    try {
      const res = await fetch('/api/acara')
      const json = await res.json()
      if (json.success) setAcara(json.data)
    } catch (e) {
      toast.error('Gagal memuat acara')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAcara()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const loadId = toast.loading('Menambah acara...')
    try {
      const res = await fetch('/api/acara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Acara berhasil dibuat!', { id: loadId })
        setShowModal(false)
        setFormData({ nama: '', tanggal: '', tempat: '', background: '' })
        fetchAcara()
      } else {
        toast.error('Gagal membuat acara', { id: loadId })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadId })
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="admin-topbar">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Ticket size={28} color="var(--hijau-tua)" /> Kelola Acara & ID Card
          </h1>
          <p style={{ color: 'var(--teks-abu)' }}>Buat acara dan cetak ID Card Lanyard untuk Panitia & Peserta</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-utama" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Buat Acara Baru
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Buat Acara Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Nama Acara</label>
                <input type="text" required placeholder="Contoh: MUSWIL Ke-IV MA Jateng" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Tanggal Acara</label>
                <input type="date" required className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Tempat Pelaksanaan</label>
                <input type="text" required placeholder="Contoh: Hotel Pandanaran, Semarang" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.tempat} onChange={e => setFormData({...formData, tempat: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Background ID Card Custom (URL / GDrive) - Opsional</label>
                <input type="text" placeholder="Biarkan kosong jika pakai template standar" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.background} onChange={e => setFormData({...formData, background: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: 'var(--hijau-utama)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Simpan Acara</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {loading ? (
          <p>Memuat data acara...</p>
        ) : acara.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <Ticket size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--teks)', fontWeight: 700 }}>Belum Ada Acara</h3>
            <p style={{ color: 'var(--teks-abu)', marginBottom: '1rem' }}>Buat acara pertama Anda untuk mulai mencetak ID Card.</p>
            <button onClick={() => setShowModal(true)} className="btn-utama">Buat Acara Sekarang</button>
          </div>
        ) : (
          acara.map(item => (
            <div key={item.id} className="card-admin" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--hijau-tua)' }}>{item.nama}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teks-abu)', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teks-abu)', fontSize: '0.9rem' }}>
                  <MapPin size={16} /> {item.tempat}
                </div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--hijau-utama)', background: '#dcfce7', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                  {item._count.peserta} Peserta terdaftar
                </span>
                <Link href={`/admin/acara/${item.id}`} className="btn-utama" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Kelola <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
