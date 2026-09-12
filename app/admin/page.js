import prisma from '@/lib/prisma'
import Link from 'next/link'
import { 
  UsersRound, Trophy, Newspaper, CalendarDays, 
  School, CircleDollarSign, Activity, HelpCircle 
} from 'lucide-react'

// Render dinamis agar statistik selalu baru
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [
    jmlBerita, 
    jmlAgenda, 
    jmlLembaga, 
    jmlAnggotaPending, 
    jmlAnggotaAktif,
    donasiTerkumpul,
    terbaruAnggota,
    terbaruLP3H,
    terbaruTanya
  ] = await Promise.all([
    prisma.berita.count(),
    prisma.agenda.count(),
    prisma.lembaga.count(),
    prisma.anggota.count({ where: { status: 'PENDING' } }),
    prisma.anggota.count({ where: { status: 'DITERIMA' } }),
    prisma.programDonasi.aggregate({ _sum: { terkumpul: true } }),
    prisma.anggota.findMany({ orderBy: { tanggalDaftar: 'desc' }, take: 3, select: { id: true, namaLengkap: true, tanggalDaftar: true, status: true } }),
    prisma.pendaftaranLP3H.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, namaLengkap: true, createdAt: true, status: true, jenisLayanan: true } }),
    prisma.tanyaJawab.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, nama: true, createdAt: true, status: true } })
  ])

  // Gabungkan dan urutkan untuk Aktivitas Terakhir
  const aktivitas = [
    ...terbaruAnggota.map(item => ({ type: 'Pendaftaran Anggota', name: item.namaLengkap, date: item.tanggalDaftar, status: item.status, link: '/admin/anggota' })),
    ...terbaruLP3H.map(item => ({ type: `Layanan ${item.jenisLayanan.replace('_', ' ')}`, name: item.namaLengkap, date: item.createdAt, status: item.status, link: '/admin/lp3h' })),
    ...terbaruTanya.map(item => ({ type: 'Pertanyaan Umat', name: item.nama, date: item.createdAt, status: item.status, link: '/admin/layanan' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(angka))
  }

  const StatCard = ({ title, value, icon, color, link, alert }) => (
    <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card-admin" style={{ position: 'relative', borderTop: `4px solid ${color}`, transition: 'transform 0.2s', cursor: 'pointer' }}>
        {alert && (
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
            {alert}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teks-abu)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teks)', marginTop: '0.5rem' }}>{value}</h3>
          </div>
          <div style={{ color: color, opacity: 0.8, padding: '0.5rem', background: `${color}15`, borderRadius: '12px' }}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Dasbor Ringkasan</h1>
          <p style={{ color: 'var(--teks-abu)' }}>Selamat datang di Panel Admin Mathla&apos;ul Anwar Jawa Tengah</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          title="Anggota KTA Baru" 
          value={jmlAnggotaPending} 
          icon={<UsersRound size={32} />} 
          color="#f59e0b" 
          link="/admin/anggota" 
          alert={jmlAnggotaPending > 0 ? jmlAnggotaPending : null} 
        />
        <StatCard title="Total Anggota Aktif" value={jmlAnggotaAktif} icon={<Trophy size={32} />} color="var(--hijau-muda)" link="/admin/anggota" />
        <StatCard title="Total Berita" value={jmlBerita} icon={<Newspaper size={32} />} color="#3b82f6" link="/admin/berita" />
        <StatCard title="Total Agenda" value={jmlAgenda} icon={<CalendarDays size={32} />} color="#8b5cf6" link="/admin/agenda" />
        <StatCard title="Total Lembaga" value={jmlLembaga} icon={<School size={32} />} color="#06b6d4" link="/admin/lembaga" />
        <StatCard title="Infaq Terkumpul" value={formatRupiah(donasiTerkumpul._sum.terkumpul || 0)} icon={<CircleDollarSign size={32} />} color="#10b981" link="/admin/donasi" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Aktivitas Terakhir */}
        <div className="card-admin">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>Antrean Pelayanan & Aktivitas</h3>
          {aktivitas.length === 0 ? (
            <div style={{ color: 'var(--teks-abu)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Activity size={40} color="#cbd5e1" />
              Belum ada aktivitas umat.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {aktivitas.map((act, i) => (
                <Link key={i} href={act.link} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: act.status === 'PENDING' ? '#fffbeb' : '#f8fafc', borderRadius: '12px', textDecoration: 'none', color: 'inherit', border: act.status === 'PENDING' ? '1px solid #fde68a' : '1px solid transparent' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.25rem' }}>{act.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--hijau-tua)' }}>{act.type}</span>
                      •
                      <span>{new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}</span>
                    </div>
                  </div>
                  <div>
                    {act.status === 'PENDING' ? (
                      <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '99px', fontWeight: 700 }}>Perlu Tindakan</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', background: '#e2e8f0', color: '#64748b', padding: '0.25rem 0.75rem', borderRadius: '99px', fontWeight: 700 }}>Diproses</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bantuan Cepat */}
        <div className="card-admin" style={{ background: 'var(--hijau-tua)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <HelpCircle size={24} color="var(--emas)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emas)' }}>Butuh Bantuan?</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
            Jika Anda mengalami kendala teknis atau memiliki pertanyaan terkait pengelolaan website ini, silakan hubungi tim dukungan MitraSekolah.id.
          </p>
          <a href="https://wa.me/6283176091984" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: 'var(--emas)', color: 'var(--hijau-tua)', textAlign: 'center', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
            Hubungi Teknisi via WA
          </a>
        </div>
      </div>
    </>
  )
}
