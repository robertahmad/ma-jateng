'use client'
import { useState, useEffect } from 'react'
import { CheckCircle2, ShieldCheck, Clock, FileBadge, Store, BookOpenCheck, PhoneForwarded, Edit3, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLP3H() {
  const [inbox, setInbox] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL') // ALL, PENDING, PROSES_BERKAS, SELESAI

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/lp3h')
      const json = await res.json()
      if (json.success) setInbox(json.data)
    } catch (e) { toast.error('Gagal memuat data LP3H') } 
    finally { setLoading(false) }
  }

  const ubahStatus = async (id, statusBaru) => {
    const loadingId = toast.loading('Merubah status...')
    try {
      const res = await fetch(`/api/lp3h/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusBaru })
      })
      if (res.ok) {
        toast.success(`Berhasil dipindah ke: ${statusBaru.replace('_', ' ')}`, { id: loadingId })
        fetchData()
      } else toast.error('Gagal', { id: loadingId })
    } catch (e) { toast.error('Error jaringan', { id: loadingId }) }
  }

  const hubungiWA = (kontak, nama, jenis) => {
    let nomor = kontak.replace(/[^0-9]/g, '')
    if (nomor.startsWith('0')) nomor = '62' + nomor.substring(1)
    
    let pesan = `Assalamu'alaikum Sdr/i ${nama}, ini dengan admin LP3H Mathla'ul Anwar Jateng.`
    if (jenis === 'SERTIFIKASI_HALAL') pesan += ` Kami menerima pengajuan Sertifikasi Halal Anda. Mohon dapat melampirkan foto KTP dan Foto Produknya.`
    if (jenis === 'PEMBUATAN_NIB') pesan += ` Terkait permohonan NIB, mohon siapkan KTP dan NPWP (jika ada).`
    
    window.open(`https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`, '_blank')
  }

  const formatLayanan = (jenis) => {
    switch(jenis) {
      case 'SERTIFIKASI_HALAL': return { label: 'Sertifikasi Halal', icon: <Store size={14} />, color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
      case 'PEMBUATAN_NIB': return { label: 'Pembuatan NIB', icon: <FileBadge size={14} />, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' }
      case 'PELATIHAN_P3H': return { label: 'Pelatihan P3H', icon: <BookOpenCheck size={14} />, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
      default: return { label: jenis, icon: null, color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' }
    }
  }

  const filteredInbox = inbox.filter(item => filter === 'ALL' ? true : item.status === filter)

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat Antrean LP3H...</div>

  return (
    <div style={{ maxWidth: '1100px' }}>
      
      {/* Header & Filter */}
      <div className="admin-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={28} color="var(--hijau-tua)" /> Dasbor LP3H (Halal & NIB)</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Kelola antrean permohonan UMKM. Minta berkas secara manual via WhatsApp agar server hemat kapasitas.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button onClick={() => setFilter('ALL')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'ALL' ? '#f1f5f9' : 'transparent', fontWeight: 600, cursor: 'pointer' }}>Semua</button>
          <button onClick={() => setFilter('PENDING')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'PENDING' ? '#fffbeb' : 'transparent', color: filter === 'PENDING' ? '#d97706' : 'inherit', fontWeight: 600, cursor: 'pointer' }}>Masuk ({inbox.filter(i=>i.status==='PENDING').length})</button>
          <button onClick={() => setFilter('PROSES_BERKAS')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'PROSES_BERKAS' ? '#eff6ff' : 'transparent', color: filter === 'PROSES_BERKAS' ? '#2563eb' : 'inherit', fontWeight: 600, cursor: 'pointer' }}>Pemberkasan</button>
          <button onClick={() => setFilter('SELESAI')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === 'SELESAI' ? '#ecfdf5' : 'transparent', color: filter === 'SELESAI' ? '#059669' : 'inherit', fontWeight: 600, cursor: 'pointer' }}>Selesai</button>
        </div>
      </div>

      {/* Grid Data */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredInbox.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: 'var(--teks-abu)' }}>Tidak ada data pada kategori ini.</p>
          </div>
        ) : (
          filteredInbox.map(item => {
            const layanan = formatLayanan(item.jenisLayanan)
            return (
              <div key={item.id} style={{ 
                background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', 
                borderLeft: item.status === 'PENDING' ? '4px solid #f59e0b' : item.status === 'PROSES_BERKAS' ? '4px solid #3b82f6' : '4px solid #10b981',
                display: 'grid', gridTemplateColumns: '1fr 250px', gap: '2rem', alignItems: 'center'
              }}>
                
                {/* Info Utama */}
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', background: layanan.bg, color: layanan.color, border: `1px solid ${layanan.border}`, padding: '0.2rem 0.6rem', borderRadius: '99px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {layanan.icon} {layanan.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{item.namaLengkap}</h3>
                  {item.namaUsaha && (
                    <div style={{ fontSize: '1rem', color: 'var(--emas)', fontWeight: 700, marginBottom: '0.5rem' }}>Usaha: {item.namaUsaha}</div>
                  )}
                  <p style={{ fontSize: '0.9rem', color: 'var(--teks-abu)', margin: 0, display: 'flex', alignItems: 'center' }}><MapPin size={14} style={{ marginRight: '0.3rem' }} /> {item.alamat}</p>
                </div>

                {/* Panel Aksi */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={() => hubungiWA(item.kontak, item.namaLengkap, item.jenisLayanan)} style={{ 
                    background: '#25D366', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}>
                    <PhoneForwarded size={18} /> Chat WhatsApp
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {item.status === 'PENDING' && (
                      <button onClick={() => ubahStatus(item.id, 'PROSES_BERKAS')} className="btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', gap: '0.4rem', borderColor: '#bfdbfe', color: '#2563eb', background: '#eff6ff' }}>
                        <Edit3 size={14} /> Minta Berkas
                      </button>
                    )}
                    {item.status === 'PROSES_BERKAS' && (
                      <button onClick={() => ubahStatus(item.id, 'SELESAI')} className="btn-green" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={14} /> Selesai
                      </button>
                    )}
                    {item.status === 'SELESAI' && (
                      <div style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center', fontWeight: 700, color: '#059669', background: '#ecfdf5', borderRadius: '8px' }}>
                        <CheckCircle2 size={16} style={{ marginRight: '0.4rem', marginBottom: '-3px', display: 'inline-block' }} /> Berkas Rampung
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
