import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Profil() {
  const settingsData = await prisma.pengaturan.findMany()
  const pengaturan = {}
  settingsData.forEach(item => { pengaturan[item.kunci] = item.nilai })

  const pengurus = await prisma.pengurus.findMany({
    orderBy: { urutan: 'asc' }
  })

  return (
    <>
      <Navbar />
      
      {/* Header Halaman */}
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Profil Organisasi
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Mengenal Mathla&apos;ul Anwar</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Berdiri sejak 1916, berkhidmat untuk pendidikan, dakwah, dan sosial di tengah masyarakat Indonesia.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>
          
          {/* Sejarah */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '4px', background: 'var(--emas)' }}></div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>Sejarah Singkat</h2>
            </div>
            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--teks-abu)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                Mathla&apos;ul Anwar (MA) yang berarti "Terbitnya Cahaya" adalah salah satu organisasi kemasyarakatan Islam tertua dan terbesar di Indonesia. Organisasi ini didirikan pada tanggal 10 Juli 1916 (bertepatan dengan 10 Syawal 1334 H) di Kampung Kananga, Menes, Pandeglang, Banten.
              </p>
              <p>
                Pendirian Mathla&apos;ul Anwar diprakarsai oleh KH. Mas Abdurrahman bersama sejumlah ulama Banten lainnya. Berdirinya organisasi ini dilatarbelakangi oleh keprihatinan para ulama terhadap kondisi masyarakat Banten saat itu yang mengalami tekanan penjajahan Belanda dan keterbatasan akses pendidikan.
              </p>
              <p>
                Sejak awal berdirinya, Mathla&apos;ul Anwar memfokuskan gerakannya pada bidang pendidikan, mulai dari tingkat dasar hingga menengah, dengan memadukan ilmu agama dan pengetahuan umum guna membentengi umat dari pengaruh sekularisasi.
              </p>
              <p>
                Kini, Pengurus Wilayah Mathla&apos;ul Anwar Jawa Tengah hadir untuk meneruskan estafet perjuangan tersebut, menyebarkan "cahaya" pendidikan dan dakwah Islam yang rahmatan lil alamin di seluruh penjuru Jawa Tengah.
              </p>
            </div>
          </section>

          {/* Visi & Misi */}
          <section style={{ background: 'var(--abu)', padding: '3rem', borderRadius: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>Visi & Misi</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ color: 'var(--emas)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Visi</div>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--hijau-tua)', lineHeight: 1.6 }}>
                  "Terwujudnya masyarakat Islam yang berilmu, beriman, dan berakhlak mulia dalam ridha Allah SWT demi kejayaan agama, nusa, dan bangsa."
                </p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ color: 'var(--emas)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Misi</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    'Menyelenggarakan sistem pendidikan Islam yang terpadu dan berkualitas tinggi.',
                    'Melaksanakan dakwah Islamiyah yang sejuk, inklusif, dan rahmatan lil alamin.',
                    'Memberdayakan ekonomi dan sosial umat untuk mengentaskan kemiskinan dan kebodohan.',
                    'Menjalin sinergi dan ukhuwah Islamiyah dengan berbagai elemen bangsa.',
                  ].map((misi, i) => (
                    <li key={i} style={{ display: 'flex', gap: '1rem', fontSize: '1.05rem', color: 'var(--teks-abu)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--emas)', fontWeight: 800, fontSize: '1.2rem' }}>{i + 1}.</span>
                      {misi}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Sambutan Ketua */}
          {(pengaturan.nama_ketua || pengaturan.sambutan_ketua) && (
            <section style={{ background: 'linear-gradient(135deg, var(--hijau-tua), #2d8a45)', padding: '3rem', borderRadius: '16px', color: 'white' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem', alignItems: 'center' }}>
                <div style={{ background: '#cbd5e1', width: '100%', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                  {pengaturan.foto_ketua ? (
                    <img src={pengaturan.foto_ketua} alt={pengaturan.nama_ketua} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <User size={80} />
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', color: 'var(--emas)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Sambutan Ketua PW</div>
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2rem', opacity: 0.9 }}>
                    &quot;{pengaturan.sambutan_ketua || 'Selamat datang di website resmi Mathla\'ul Anwar Jawa Tengah.'}&quot;
                  </p>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{pengaturan.nama_ketua || 'Ketua Umum'}</h3>
                  <div style={{ color: 'var(--emas)', fontWeight: 600, fontSize: '0.9rem' }}>Ketua PW Mathla&apos;ul Anwar Jawa Tengah</div>
                </div>
              </div>
            </section>
          )}

          {/* Struktur Organisasi */}
          <section>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '0.5rem' }}>Struktur Pengurus Wilayah</h2>
              <p style={{ color: 'var(--teks-abu)' }}>Masa Khidmat Berjalan</p>
            </div>
            
            {pengurus.length > 0 ? (
              <>
                {/* Ketua Umum (Urutan 1) */}
                {pengurus.filter(p => p.urutan === 1).map(ketua => (
                  <div key={ketua.id} style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                    <div style={{ textAlign: 'center', width: '250px' }}>
                      {ketua.foto ? (
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden', border: '3px solid var(--emas)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                          <img src={ketua.foto} alt={ketua.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--hijau-muda), var(--hijau-tua))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <User size={48} />
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--teks)' }}>{ketua.nama}</h3>
                      <p style={{ color: 'var(--emas)', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{ketua.jabatan}</p>
                    </div>
                  </div>
                ))}

                {/* Pengurus Lainnya */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                  {pengurus.filter(p => p.urutan > 1).map((p) => (
                    <div key={p.id} style={{ textAlign: 'center', width: '200px' }}>
                      {p.foto ? (
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden', border: '2px solid #cbd5e1' }}>
                          <img src={p.foto} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <User size={40} />
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--teks)' }}>{p.nama}</h3>
                      <p style={{ color: 'var(--hijau-tua)', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>{p.jabatan}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>
                Struktur kepengurusan sedang dalam proses pembaruan.
              </div>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </>
  )
}
