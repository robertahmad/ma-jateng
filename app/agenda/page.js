import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import { Clock, MapPin, User, CalendarDays } from 'lucide-react'

export const revalidate = 60

export default async function AgendaList() {
  const agenda = await prisma.agenda.findMany({
    orderBy: { tanggalMulai: 'asc' }
  })

  // Pisahkan agenda yang akan datang dan yang sudah lewat
  const now = new Date()
  const upcomingAgenda = agenda.filter(a => new Date(a.tanggalMulai) >= now)
  const pastAgenda = agenda.filter(a => new Date(a.tanggalMulai) < now)

  const formatTanggal = (tgl, format) => {
    const d = new Date(tgl)
    if (format === 'hari') return d.getDate()
    if (format === 'bulan') return d.toLocaleDateString('id-ID', { month: 'short' })
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const AgendaCard = ({ item }) => (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '1.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem',
      borderLeft: '5px solid var(--hijau-tua)'
    }}>
      <div style={{
        background: 'var(--hijau-tua)', color: 'white', borderRadius: '12px',
        padding: '1rem', textAlign: 'center', minWidth: '90px'
      }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
          {formatTanggal(item.tanggalMulai, 'hari')}
        </div>
        <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
          {formatTanggal(item.tanggalMulai, 'bulan')}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--teks)', marginBottom: '0.5rem' }}>{item.judul}</h3>
        <p style={{ color: 'var(--teks-abu)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.6 }}>{item.deskripsi}</p>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--teks)', fontWeight: 500, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} /> {formatTanggal(item.tanggalMulai)} {item.tanggalSelesai ? `- Selesai` : 'WIB'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} /> {item.lokasi}
          </span>
          {item.penyelenggara && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> {item.penyelenggara}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Jadwal Kegiatan
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Agenda Organisasi</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Ikuti terus jadwal kegiatan, pertemuan, dan acara resmi PW Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        
        {/* Agenda Mendatang */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: 'var(--emas)' }}></span>
            Agenda Mendatang
          </h2>
          
          {upcomingAgenda.length === 0 ? (
            <div style={{ background: 'var(--abu)', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: 'var(--teks-abu)' }}>
              Tidak ada agenda dalam waktu dekat.
            </div>
          ) : (
            upcomingAgenda.map(a => <AgendaCard key={a.id} item={a} />)
          )}
        </div>

        {/* Agenda Selesai */}
        {pastAgenda.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--teks-abu)', opacity: 0.8, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: '15px', height: '15px', borderRadius: '50%', background: '#cbd5e1' }}></span>
              Agenda Terdahulu
            </h2>
            <div style={{ opacity: 0.7 }}>
              {pastAgenda.map(a => <AgendaCard key={a.id} item={a} />)}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  )
}
