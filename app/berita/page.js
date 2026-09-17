import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { CalendarDays, Newspaper, Image as ImageIcon } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/image'

export const dynamic = 'force-dynamic'

export default async function BeritaList() {
  const berita = await prisma.berita.findMany({
    where: { diterbitkan: true },
    orderBy: { createdAt: 'desc' }
  })

  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <>
      <Navbar />
      
      {/* Header Halaman */}
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Pusat Informasi
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Berita & Artikel</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Kumpulan berita terbaru, artikel dakwah, dan liputan kegiatan seputar PW Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        {berita.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--teks-abu)' }}>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Newspaper size={64} color="#cbd5e1" /></span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teks)', fontWeight: 700 }}>Belum Ada Berita</h3>
            <p>Pengurus belum mempublikasikan berita apapun.</p>
          </div>
        ) : (
          <div className="grid-3">
            {berita.map(b => (
              <Link key={b.id} href={`/berita/${b.slug}`} className="card">
                {b.thumbnail ? (
                  <img src={getDirectImageUrl(b.thumbnail)} alt={b.judul} className="card-img" />
                ) : (
                  <div className="card-img-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="card-body">
                  <span className="card-tag">{b.kategori}</span>
                  <h2 className="card-title">{b.judul}</h2>
                  <div className="card-date" style={{ display: 'flex', alignItems: 'center' }}><CalendarDays size={14} style={{ marginRight: '0.4rem' }} /> {formatTanggal(b.createdAt)}</div>
                  <p className="card-text">{b.ringkasan}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
