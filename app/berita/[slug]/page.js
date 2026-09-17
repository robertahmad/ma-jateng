import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDirectImageUrl } from '@/lib/image'

export const revalidate = 60

export default async function BeritaDetail({ params }) {
  const { slug } = await params
  
  const berita = await prisma.berita.findUnique({
    where: { slug }
  })

  if (!berita || !berita.diterbitkan) {
    notFound()
  }

  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <Navbar />
      
      <div className="container" style={{ padding: '8rem 2rem 4rem', maxWidth: '800px' }}>
        <Link href="/berita" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--hijau-tua)', textDecoration: 'none', fontWeight: 600 }}>
          ← Kembali ke Indeks Berita
        </Link>
        
        <div style={{ marginBottom: '2rem' }}>
          <span className="card-tag">{berita.kategori}</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--teks)', marginTop: '1rem', lineHeight: 1.3 }}>
            {berita.judul}
          </h1>
          <div style={{ color: 'var(--teks-abu)', fontSize: '0.9rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📅 {formatTanggal(berita.createdAt)}</span>
            <span>•</span>
            <span>✍️ Admin MA Jateng</span>
          </div>
        </div>

        {berita.thumbnail ? (
          <img src={getDirectImageUrl(berita.thumbnail)} alt={berita.judul} style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '3rem' }} />
        ) : (
          <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, var(--hijau-tua), var(--hijau-muda))', borderRadius: '12px', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
            📰
          </div>
        )}

        <div className="article-content" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--teks)' }}>
          {/* Untuk sementara kita render teks biasa (nanti admin akan pakai HTML editor) */}
          {berita.isi.split('\n').map((paragraph, i) => (
            <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
