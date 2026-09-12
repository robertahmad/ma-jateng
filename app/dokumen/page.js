import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import RuangKader from '@/components/RuangKader'

export const revalidate = 60

export default async function DokumenList() {
  const dokumen = await prisma.dokumen.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Pisahkan dokumen umum dan rahasia (Ruang Kader)
  const umum = dokumen.filter(d => !d.rahasia)
  const rahasia = dokumen.filter(d => d.rahasia)

  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const FileIcon = () => (
    <div style={{ width: '50px', height: '60px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b91c1c', fontSize: '1.5rem', fontWeight: 800 }}>
      PDF
    </div>
  )

  const LockIcon = () => (
    <div style={{ width: '50px', height: '60px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '1.5rem', fontWeight: 800 }}>
      🔒
    </div>
  )

  return (
    <>
      <Navbar />
      
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Pusat Unduhan
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Dokumen & SK Resmi</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Arsip digital dokumen publik dan ruang tertutup bagi kader Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        
        {/* Dokumen Umum */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '0.5rem' }}>Dokumen Publik</h2>
          <p style={{ color: 'var(--teks-abu)', marginBottom: '2rem' }}>Dapat diunduh oleh masyarakat umum secara bebas.</p>
          
          {umum.length === 0 ? (
            <div style={{ background: 'var(--abu)', padding: '2rem', borderRadius: '12px', textAlign: 'center', color: 'var(--teks-abu)' }}>
              Belum ada dokumen publik yang diunggah.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {umum.map(doc => (
                <div key={doc.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
                  <FileIcon />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--hijau-tua)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{doc.kategori}</div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--teks)', marginBottom: '0.3rem', lineHeight: 1.3 }}>{doc.judul}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)' }}>{doc.ukuran || 'Unknown Size'} • {formatTanggal(doc.createdAt)}</div>
                  </div>
                  <a href={doc.file} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--hijau-tua)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }}>
                    ⬇️
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ruang Kader Tertutup */}
        <div>
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '3rem', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🛡️</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Ruang Kader (Tertutup)</h2>
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '600px' }}>
              Area ini berisi dokumen internal seperti AD/ART, Surat Edaran Khusus, dan Modul Pelatihan. Silakan masukkan kata sandi rahasia cabang untuk membuka gembok.
            </p>
            
            <RuangKader dokumen={rahasia} />
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
