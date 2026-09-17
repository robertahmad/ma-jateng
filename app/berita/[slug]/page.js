import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDirectImageUrl } from '@/lib/image'
import { CalendarDays, PenLine, MessageCircle, Image as ImageIcon } from 'lucide-react'

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
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CalendarDays size={16} /> {formatTanggal(berita.createdAt)}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><PenLine size={16} /> Admin MA Jateng</span>
          </div>
        </div>

        {berita.thumbnail ? (
          <img src={getDirectImageUrl(berita.thumbnail)} alt={berita.judul} style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '3rem' }} />
        ) : (
          <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, var(--hijau-tua), var(--hijau-muda))', borderRadius: '12px', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)' }}>
            <ImageIcon size={64} />
          </div>
        )}

        <div className="article-content" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--teks)' }}>
          {/* Untuk sementara kita render teks biasa (nanti admin akan pakai HTML editor) */}
          {berita.isi.split('\n').map((paragraph, i) => (
            <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
          ))}
        </div>

        {/* Share Buttons */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--hijau-tua)' }}>Bagikan Berita Ini</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(berita.judul + ' - Baca selengkapnya di: https://ma-jateng.vercel.app/berita/' + berita.slug)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(37,211,102,0.2)' }}>
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://ma-jateng.vercel.app/berita/' + berita.slug)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#1877F2', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(24,119,242,0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://ma-jateng.vercel.app/berita/' + berita.slug)}&text=${encodeURIComponent(berita.judul)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#1DA1F2', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(29,161,242,0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> Twitter
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
