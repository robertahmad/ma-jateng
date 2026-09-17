'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Users, User, X, Clock, CheckCircle2, XCircle, Phone } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/image'

export default function AdminAnggota() {
  const [anggotaList, setAnggotaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('') // PENDING, DITERIMA, DITOLAK
  const [viewDetail, setViewDetail] = useState(null)

  const fetchAnggota = async () => {
    setLoading(true)
    try {
      const query = filterStatus ? `?status=${filterStatus}` : ''
      const res = await fetch(`/api/anggota${query}`)
      const data = await res.json()
      setAnggotaList(data.data || [])
    } catch (e) {
      toast.error('Gagal mengambil data anggota')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAnggota()
  }, [filterStatus])

  const handleVerifikasi = async (id, status, kabupaten) => {
    const aksi = status === 'DITERIMA' ? 'menerima' : 'menolak'
    if (!confirm(`Apakah Anda yakin ingin ${aksi} pendaftaran ini?`)) return

    const loadingToast = toast.loading('Memproses verifikasi...')
    try {
      const res = await fetch(`/api/anggota/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, kabupaten })
      })
      
      if (res.ok) {
        toast.success(`Pendaftaran berhasil ${status.toLowerCase()}`, { id: loadingToast })
        setViewDetail(null)
        fetchAnggota()
      } else {
        toast.error('Gagal memproses', { id: loadingToast })
      }
    } catch (e) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus data anggota ini permanen? Data tidak dapat dikembalikan.')) return
    try {
      const res = await fetch(`/api/anggota/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Data anggota dihapus')
        fetchAnggota()
      }
    } catch (e) {
      toast.error('Gagal menghapus data')
    }
  }

  const handleUpdateKTA = async (id, editData) => {
    const loadingToast = toast.loading('Menyimpan perubahan...')
    try {
      const res = await fetch(`/api/anggota/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      if (res.ok) {
        toast.success('Data KTA berhasil diperbarui', { id: loadingToast })
        setViewDetail(null)
        fetchAnggota()
      } else {
        toast.error('Gagal memperbarui data', { id: loadingToast })
      }
    } catch (e) {
      toast.error('Terjadi kesalahan', { id: loadingToast })
    }
  }

  const DetailModal = ({ a }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState({ pasFoto: a.pasFoto || '', ktaMode: a.ktaMode || 'MA' })

    return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--teks)' }}>Detail Pendaftar KTA</h2>
          <button onClick={() => setViewDetail(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Kolom Kiri: Foto & Status */}
          <div>
            <div style={{ width: '100%', aspectRatio: '3/4', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {a.pasFoto ? (
                <img src={getDirectImageUrl(a.pasFoto)} alt="Pas Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={64} color="#cbd5e1" />
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', marginBottom: '0.5rem', fontWeight: 700 }}>STATUS PENDAFTARAN</div>
              {a.status === 'PENDING' && <div style={{ color: '#d97706', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><Clock size={18} /> MENUNGGU REVIEW</div>}
              {a.status === 'DITERIMA' && <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><CheckCircle2 size={18} /> DITERIMA</div>}
              {a.status === 'DITOLAK' && <div style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}><XCircle size={18} /> DITOLAK</div>}
              
              {a.nomorKTA && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--teks-abu)', marginBottom: '0.2rem' }}>NOMOR KTA RESMI</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hijau-tua)' }}>{a.nomorKTA}</div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Data Diri */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>NIK (Nomor Induk Kependudukan)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--teks)' }}>{a.nik}</div>
            </div>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Nama Lengkap</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--teks)' }}>{a.namaLengkap}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Tempat, Tgl Lahir</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--teks)' }}>{a.tempatLahir}, {new Date(a.tanggalLahir).toLocaleDateString('id-ID')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Jenis Kelamin</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--teks)' }}>{a.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Alamat Domisili / KTP</div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--teks)' }}>{a.alamatLengkap}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Pengurus Cabang Wilayah</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hijau-tua)' }}>{a.kabupaten}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Kontak (WhatsApp)</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--teks)' }}>
                  <a href={`https://wa.me/${a.noWhatsApp.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={16} /> {a.noWhatsApp}
                  </a>
                </div>
              </div>
            </div>

            {/* Aksi Verifikasi */}
            {a.status === 'PENDING' && (
              <div style={{ marginTop: 'auto', background: '#fffbeb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', marginBottom: '1rem' }}>Aksi Verifikasi Admin</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleVerifikasi(a.id, 'DITERIMA', a.kabupaten)} style={{ flex: 1, background: '#16a34a', color: 'white', padding: '0.85rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={18} /> TERIMA & TERBITKAN KTA
                  </button>
                  <button onClick={() => handleVerifikasi(a.id, 'DITOLAK', a.kabupaten)} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '0.85rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <XCircle size={18} /> TOLAK PENDAFTARAN
                  </button>
                </div>
              </div>
            )}

            {/* Panel Edit KTA (Jika Diterima) */}
            {a.status === 'DITERIMA' && (
              <div style={{ marginTop: 'auto', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--teks)' }}>Pengaturan KTA</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleVerifikasi(a.id, 'DITERIMA', a.kabupaten)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }} title="Klik untuk mengupdate format nomor KTA ke versi terbaru">
                      Update Nomor KTA
                    </button>
                    <button onClick={() => setIsEdit(!isEdit)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                      {isEdit ? 'Batal Edit' : 'Edit KTA'}
                    </button>
                  </div>
                </div>
                
                {isEdit && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teks-abu)' }}>Link Foto (Google Drive / URL)</label>
                      <input type="text" style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }} placeholder="Paste link foto..." value={editData.pasFoto} onChange={e => setEditData({...editData, pasFoto: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teks-abu)' }}>Desain / Mode KTA</label>
                      <select style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }} value={editData.ktaMode} onChange={e => setEditData({...editData, ktaMode: e.target.value})}>
                        <option value="MA">Standar (MA Jateng)</option>
                        <option value="MUSMA">Muslimat (MUSMA)</option>
                      </select>
                    </div>
                    <button onClick={() => handleUpdateKTA(a.id, editData)} style={{ background: '#16a34a', color: 'white', padding: '0.75rem', borderRadius: '6px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    )
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users size={28} color="var(--hijau-tua)" /> Verifikasi Anggota & KTA</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Pusat data kader dan pencetakan Kartu Tanda Anggota</p>
        </div>
      </div>

      {viewDetail && <DetailModal a={viewDetail} />}

      <div className="card-admin" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc' }}>
        <span style={{ fontWeight: 600, color: 'var(--teks-abu)' }}>Filter Status:</span>
        <select className="form-select" style={{ maxWidth: '250px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Semua Pendaftar</option>
          <option value="PENDING">Menunggu Review</option>
          <option value="DITERIMA">Disetujui (KTA Aktif)</option>
          <option value="DITOLAK">Ditolak</option>
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--teks-abu)' }}>
          Total Data: <strong>{anggotaList.length}</strong> Orang
        </span>
      </div>

      <div className="admin-table">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--teks-abu)' }}>Memuat basis data kader...</div>
        ) : (
          <table style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                <th width="25%">Nama & NIK</th>
                <th width="20%">Cabang Wilayah</th>
                <th width="20%">Kontak</th>
                <th width="20%">Status & KTA</th>
                <th width="15%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {anggotaList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--teks-abu)' }}>
                    Belum ada data pendaftar pada filter ini.
                  </td>
                </tr>
              ) : (
                anggotaList.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--teks)' }}>{a.namaLengkap}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontFamily: 'monospace' }}>NIK: {a.nik}</div>
                    </td>
                    <td>
                      <span className="card-tag" style={{ background: '#f1f5f9', color: 'var(--teks-abu)' }}>{a.kabupaten}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--teks)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={14} color="#16a34a" /> {a.noWhatsApp}
                      </div>
                    </td>
                    <td>
                      {a.status === 'PENDING' && <span className="badge-aktif" style={{ background: '#fef3c7', color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> Menunggu</span>}
                      {a.status === 'DITERIMA' && (
                        <div>
                          <span className="badge-aktif" style={{ background: '#dcfce7', color: '#16a34a', marginBottom: '0.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={12} /> Diterima</span>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>{a.nomorKTA}</div>
                        </div>
                      )}
                      {a.status === 'DITOLAK' && <span className="badge-nonaktif" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><XCircle size={12} /> Ditolak</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setViewDetail(a)} className="btn-edit" style={{ background: '#3b82f6' }}>Review</button>
                        <button onClick={() => handleDelete(a.id)} className="btn-red">Hapus</button>
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
