'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Trash2, Clock, Filter, MessageSquare, PhoneForwarded } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLayananInbox() {
  const [inbox, setInbox] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL, PENDING, DIJAWAB

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tanyajawab')
      const json = await res.json()
      if (json.success) setInbox(json.data)
    } catch (e) {
      toast.error('Gagal mengambil data kotak masuk')
    } finally {
      setLoading(false)
    }
  }

  const ubahStatus = async (id, statusBaru) => {
    const loadingId = toast.loading('Memproses tiket...')
    try {
      const res = await fetch(`/api/tanyajawab/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusBaru })
      })
      if (res.ok) {
        toast.success(statusBaru === 'DIJAWAB' ? 'Tiket diselesaikan!' : 'Tiket dipending', { id: loadingId })
        fetchData()
      } else {
        toast.error('Gagal memproses', { id: loadingId })
      }
    } catch (e) {
      toast.error('Kesalahan jaringan', { id: loadingId })
    }
  }

  const hapusPesan = async (id) => {
    if (!confirm('Peringatan: Yakin ingin menghapus pesan ini secara permanen dari sistem?')) return
    const loadingId = toast.loading('Menghapus data...')
    try {
      const res = await fetch(`/api/tanyajawab/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Pesan terhapus!', { id: loadingId })
        fetchData()
      } else {
        toast.error('Gagal menghapus', { id: loadingId })
      }
    } catch (e) {
      toast.error('Kesalahan jaringan', { id: loadingId })
    }
  }

  // Fungsi pintar memformat nomor telepon menjadi tautan WhatsApp API
  const hubungiWA = (kontak) => {
    let nomor = kontak.replace(/[^0-9]/g, '') // Bersihkan semua karakter selain angka
    if (nomor.startsWith('0')) {
      nomor = '62' + nomor.substring(1) // Ubah 0 menjadi 62
    }
    // Jika masih terlalu pendek, mungkin bukan no HP
    if (nomor.length < 9) {
      alert('Tampaknya kontak yang dimasukkan jamaah bukan nomor telepon yang valid. (' + kontak + ')')
      return
    }
    window.open(`https://wa.me/${nomor}?text=Assalamu'alaikum%20Wr.%20Wb.%20Ini%20dengan%20pengurus%20Mathla'ul%20Anwar%20Jawa%20Tengah%20merespon%20pertanyaan%20Anda%20di%20website...`, '_blank')
  }

  const formatWaktu = (tgl) => {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const filteredInbox = inbox.filter(item => filter === 'ALL' ? true : item.status === filter)

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat Kotak Masuk...</div>

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div className="admin-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Kotak Masuk Layanan Umat</h1>
          <p style={{ color: 'var(--teks-abu)', maxWidth: '600px' }}>
            Daftar pertanyaan dari jamaah. Tekan <strong>Balas via WhatsApp</strong> untuk mengirim jawaban langsung ke HP jamaah, lalu klik <strong>Tandai Telah Dijawab</strong> untuk menyelesaikan tiket.
          </p>
        </div>
        
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setFilter('ALL')}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'ALL' ? '#f1f5f9' : 'transparent', color: filter === 'ALL' ? 'var(--teks)' : 'var(--teks-abu)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >Semua</button>
          <button 
            onClick={() => setFilter('PENDING')}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'PENDING' ? '#fffbeb' : 'transparent', color: filter === 'PENDING' ? '#d97706' : 'var(--teks-abu)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >Menunggu ({inbox.filter(i => i.status === 'PENDING').length})</button>
          <button 
            onClick={() => setFilter('DIJAWAB')}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'DIJAWAB' ? '#ecfdf5' : 'transparent', color: filter === 'DIJAWAB' ? 'var(--hijau-tua)' : 'var(--teks-abu)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >Selesai</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {filteredInbox.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <MessageSquare size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--teks)', marginBottom: '0.5rem' }}>Kotak Masuk Kosong</h3>
            <p style={{ color: 'var(--teks-abu)' }}>Belum ada pesan yang masuk di kategori ini.</p>
          </div>
        ) : (
          filteredInbox.map((tiket) => (
            <div key={tiket.id} style={{ 
              background: 'white', borderRadius: '16px', padding: '1.5rem', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0',
              borderLeft: tiket.status === 'PENDING' ? '4px solid #f59e0b' : '4px solid var(--hijau-tua)',
              display: 'flex', flexDirection: 'column', gap: '1.25rem'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {tiket.nama}
                    {tiket.status === 'PENDING' ? (
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: '#fffbeb', color: '#d97706', borderRadius: '999px', fontWeight: 700, border: '1px solid #fde68a' }}>MENUNGGU</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: '#ecfdf5', color: 'var(--hijau-tua)', borderRadius: '999px', fontWeight: 700, border: '1px solid #a7f3d0' }}>SELESAI</span>
                    )}
                  </h3>
                  <div style={{ color: 'var(--teks-abu)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><PhoneForwarded size={14} /> {tiket.kontak}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Masuk: {formatWaktu(tiket.createdAt)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {tiket.status === 'PENDING' ? (
                    <button onClick={() => ubahStatus(tiket.id, 'DIJAWAB')} className="btn-green" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} /> Tandai Telah Dijawab
                    </button>
                  ) : (
                    <button onClick={() => ubahStatus(tiket.id, 'PENDING')} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} /> Kembalikan ke Antrean
                    </button>
                  )}
                  <button onClick={() => hapusPesan(tiket.id)} className="btn-outline" style={{ padding: '0.5rem 1rem', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <p style={{ margin: 0, color: 'var(--teks)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  "{tiket.pertanyaan}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button onClick={() => hubungiWA(tiket.kontak)} style={{ 
                  background: '#25D366', color: 'white', border: 'none', padding: '0.75rem 1.5rem', 
                  borderRadius: '99px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)'
                }}>
                  Balas Langsung via WhatsApp
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  )
}
