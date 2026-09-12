import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import { Map, MapPin, User, Phone, School, Building2 } from 'lucide-react'

export const revalidate = 60

export default async function LembagaList() {
  const lembaga = await prisma.lembaga.findMany({
    orderBy: [
      { kabupaten: 'asc' },
      { jenjang: 'asc' },
      { nama: 'asc' }
    ]
  })

  // Hitung statistik
  const stats = lembaga.reduce((acc, curr) => {
    acc[curr.jenjang] = (acc[curr.jenjang] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, { total: 0 });

  // Kelompokkan berdasarkan Kabupaten
  const groupedByKabupaten = lembaga.reduce((acc, curr) => {
    if (!acc[curr.kabupaten]) acc[curr.kabupaten] = [];
    acc[curr.kabupaten].push(curr);
    return acc;
  }, {});

  const Badge = ({ children, jenjang }) => {
    let bg = '#e2e8f0';
    let color = '#475569';
    if (jenjang === 'MA' || jenjang === 'SMA') { bg = '#dbeafe'; color = '#1e40af'; }
    if (jenjang === 'MTs' || jenjang === 'SMP') { bg = '#ffedd5'; color = '#c2410c'; }
    if (jenjang === 'MI' || jenjang === 'SD') { bg = '#fee2e2'; color = '#b91c1c'; }
    if (jenjang === 'RA' || jenjang === 'PAUD') { bg = '#fce7f3'; color = '#be185d'; }
    
    return (
      <span style={{ 
        background: bg, color, padding: '0.25rem 0.75rem', 
        borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 
      }}>
        {children}
      </span>
    )
  }

  return (
    <>
      <Navbar />
      
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Pendidikan & Amal Usaha
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Data Lembaga Pendidikan</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Daftar Madrasah, Sekolah, dan Lembaga Pendidikan yang bernaung di bawah PW Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        
        {/* Statistik Bar */}
        <div style={{ 
          background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '4rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-around',
          borderTop: '4px solid var(--emas)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>{stats.total}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--teks-abu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Lembaga</div>
          </div>
          <div style={{ width: '1px', background: '#e2e8f0' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e40af' }}>{stats['MA'] || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Tingkat MA/SMA</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#c2410c' }}>{stats['MTs'] || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Tingkat MTs/SMP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#b91c1c' }}>{stats['MI'] || 0}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Tingkat MI/SD</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#be185d' }}>{(stats['RA'] || 0) + (stats['PAUD'] || 0)}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teks-abu)', fontWeight: 600 }}>Tingkat RA/PAUD</div>
          </div>
        </div>

        {lembaga.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--teks-abu)' }}>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><School size={64} color="#cbd5e1" /></span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teks)', fontWeight: 700 }}>Data Lembaga Masih Kosong</h3>
            <p>Pengurus belum memasukkan data lembaga pendidikan ke dalam sistem.</p>
          </div>
        ) : (
          Object.keys(groupedByKabupaten).map(kabupaten => (
            <div key={kabupaten} style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--teks)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Map size={24} color="var(--hijau-tua)" /> Kabupaten/Kota: <span style={{ color: 'var(--hijau-tua)' }}>{kabupaten}</span>
                </h2>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {groupedByKabupaten[kabupaten].map(item => (
                  <div key={item.id} style={{ 
                    background: 'white', borderRadius: '12px', padding: '1.5rem', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--teks)', lineHeight: 1.4 }}>{item.nama}</h3>
                      <Badge jenjang={item.jenjang}>{item.jenjang}</Badge>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--teks-abu)' }}>
                      {item.kecamatan && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>Kec. {item.kecamatan}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <Building2 size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{item.alamat}</span>
                      </div>
                      {item.kepala && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <User size={14} style={{ flexShrink: 0 }} /> <span>Kepala: {item.kepala}</span>
                        </div>
                      )}
                      {item.telepon && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Phone size={14} style={{ flexShrink: 0 }} /> <span>{item.telepon}</span>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.8rem', fontWeight: 600, color: item.status === 'Aktif' ? '#16a34a' : '#ef4444' }}>
                      Status: {item.status}
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
