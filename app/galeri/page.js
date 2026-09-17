import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import { Image as ImageIcon } from 'lucide-react'
import { getDirectImageUrl } from '@/lib/image'

export const revalidate = 60

export default async function GaleriList() {
  const galeri = await prisma.galeri.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Dapatkan daftar album unik
  const albums = [...new Set(galeri.map(g => g.album))]

  return (
    <>
      <Navbar />
      
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Dokumentasi
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Galeri Foto</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Kumpulan dokumentasi visual dari berbagai kegiatan dan program PW Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        
        {galeri.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--teks-abu)' }}>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><ImageIcon size={64} color="#cbd5e1" /></span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teks)', fontWeight: 700 }}>Galeri Kosong</h3>
            <p>Belum ada foto yang diunggah oleh pengurus.</p>
          </div>
        ) : (
          albums.map(album => (
            <div key={album} style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>Album: {album}</h2>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {galeri.filter(g => g.album === album).map(item => (
                  <div key={item.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', background: '#f1f5f9', position: 'relative' }}>
                      {item.jenis === 'Video' && item.linkVideo ? (
                        <iframe 
                          src={`https://www.youtube.com/embed/${item.linkVideo.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[1]}`}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <>
                          <img 
                            src={getDirectImageUrl(item.foto)} 
                            alt={item.judul} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { 
                              e.target.style.display = 'none'; 
                              e.target.nextSibling.style.display = 'flex'; 
                            }} 
                          />
                          <div style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={48} color="#cbd5e1" />
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--teks)', marginBottom: '0.25rem' }}>{item.judul}</h3>
                      {item.keterangan && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--teks-abu)', lineHeight: 1.5 }}>{item.keterangan}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

      </div>

      <Footer />
    </>
  )
}
