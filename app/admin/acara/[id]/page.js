'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, Users, Printer, Plus, Trash2, Edit, CheckSquare, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { getDirectImageUrl } from '@/lib/image'

export default function DetailAcara() {
  const { id } = useParams()
  const [acara, setAcara] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    peran: 'PESERTA',
    pasFoto: ''
  })

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/acara/${id}`)
      const json = await res.json()
      if (json.success) setAcara(json.data)
    } catch (e) {
      toast.error('Gagal memuat detail acara')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchDetail()
  }, [id])

  const handleAddPeserta = async (e) => {
    e.preventDefault()
    const loadId = toast.loading('Menambahkan peserta...')
    try {
      const res = await fetch(`/api/acara/${id}/peserta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Peserta ditambahkan!', { id: loadId })
        setShowModal(false)
        setFormData({ nama: '', instansi: '', peran: 'PESERTA', pasFoto: '' })
        fetchDetail()
      } else {
        toast.error('Gagal menambah peserta', { id: loadId })
      }
    } catch (err) {
      toast.error('Terjadi kesalahan', { id: loadId })
    }
  }

  const handleDeletePeserta = async (pesertaId) => {
    if (!confirm('Hapus peserta ini?')) return
    try {
      const res = await fetch(`/api/peserta/${pesertaId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Peserta dihapus')
        fetchDetail()
      }
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat data acara...</div>
  if (!acara) return <div style={{ padding: '3rem', textAlign: 'center' }}>Data acara tidak ditemukan.</div>

  return (
    <>
      <Toaster position="top-right" />
      <div className="admin-topbar">
        <div>
          <Link href="/admin/acara" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--hijau-tua)', textDecoration: 'none', fontWeight: 600, marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Kembali ke Daftar Acara
          </Link>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckSquare size={28} color="var(--hijau-tua)" /> {acara.nama}
          </h1>
          <p style={{ color: 'var(--teks-abu)' }}>Kelola peserta dan cetak ID Card untuk acara ini</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowModal(true)} className="btn-utama" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f59e0b', color: 'white' }}>
            <Plus size={18} /> Tambah Peserta
          </button>
          <Link href={`/admin/acara/${id}/cetak`} target="_blank" className="btn-utama" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Printer size={18} /> Cetak Semua ID Card
          </Link>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Tambah Peserta Acara</h2>
            <form onSubmit={handleAddPeserta} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Nama Lengkap & Gelar</label>
                <input type="text" required placeholder="Contoh: Dr. H. Fulan, M.Pd" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Asal Instansi / Utusan / PD</label>
                <input type="text" required placeholder="Contoh: PD Purbalingga" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.instansi} onChange={e => setFormData({...formData, instansi: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Peran / Jabatan di Acara</label>
                <select className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.peran} onChange={e => setFormData({...formData, peran: e.target.value})}>
                  <option value="PESERTA">Peserta</option>
                  <option value="PANITIA">Panitia</option>
                  <option value="PENGISI ACARA">Pengisi Acara</option>
                  <option value="VIP">Tamu Undangan (VIP)</option>
                  <option value="OBSERVER">Observer (Peninjau)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Link Pas Foto (Opsional)</label>
                <input type="text" placeholder="Link Google Drive / URL Foto" className="form-input" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} value={formData.pasFoto} onChange={e => setFormData({...formData, pasFoto: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: 'var(--hijau-utama)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Simpan Peserta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-admin">
        <h3 style={{ marginBottom: '1rem', color: 'var(--hijau-tua)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} /> Daftar Peserta ({acara.peserta.length} Orang)
        </h3>
        
        {acara.peserta.length === 0 ? (
          <p style={{ color: 'var(--teks-abu)', fontStyle: 'italic' }}>Belum ada peserta yang ditambahkan.</p>
        ) : (
          <div className="admin-table">
            <table style={{ minWidth: '800px', width: '100%' }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Foto</th>
                  <th>Nama & Instansi</th>
                  <th>Peran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {acara.peserta.map((p, index) => (
                  <tr key={p.id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center' }}>
                      {p.pasFoto ? (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto', border: '1px solid #e2e8f0' }}>
                          <img src={getDirectImageUrl(p.pasFoto)} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--teks)' }}>{p.nama}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--teks-abu)' }}>{p.instansi}</div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                        background: p.peran === 'PANITIA' ? '#fee2e2' : p.peran === 'VIP' || p.peran === 'PENGISI ACARA' ? '#fef3c7' : '#e0e7ff',
                        color: p.peran === 'PANITIA' ? '#b91c1c' : p.peran === 'VIP' || p.peran === 'PENGISI ACARA' ? '#b45309' : '#4338ca'
                      }}>
                        {p.peran}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDeletePeserta(p.id)} className="btn-hapus" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
