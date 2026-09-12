import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Phone, Mail, Send } from 'lucide-react'

export default function Kontak() {
  return (
    <>
      <Navbar />
      
      {/* Header Halaman */}
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '8rem 2rem 4rem', textAlign: 'center' }}>
        <div className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--emas)', border: '1px solid var(--emas)' }}>
          Hubungi Kami
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem' }}>Sekretariat & Layanan</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          Kami siap melayani dan bersinergi. Jangan ragu untuk menghubungi sekretariat PW Mathla&apos;ul Anwar Jawa Tengah.
        </p>
      </div>

      <div className="container" style={{ padding: '5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          
          {/* Info Kontak */}
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--hijau-tua)', marginBottom: '1.5rem' }}>
              Informasi Kontak
            </h2>
            <p style={{ color: 'var(--teks-abu)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Silakan hubungi kami melalui saluran di bawah ini atau kunjungi sekretariat kami pada jam kerja (Senin-Jum&apos;at, 08.00 - 16.00 WIB).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: 'rgba(200,169,81,0.15)', color: 'var(--emas)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.2rem' }}>Alamat Sekretariat</div>
                  <div style={{ color: 'var(--teks-abu)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Gedung PW MA Jawa Tengah<br />
                    Jl. Contoh Alamat No. 123, Kecamatan Kota,<br />
                    Kota Semarang, Jawa Tengah 50123
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: 'rgba(200,169,81,0.15)', color: 'var(--emas)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.2rem' }}>Telepon & WhatsApp</div>
                  <div style={{ color: 'var(--teks-abu)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Telepon: (024) 123-4567<br />
                    WA Center: +62 812-3456-7890
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '10px', background: 'rgba(200,169,81,0.15)', color: 'var(--emas)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--teks)', marginBottom: '0.2rem' }}>Email Resmi</div>
                  <div style={{ color: 'var(--teks-abu)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    pw@mathlaularwanjateng.id<br />
                    humas.majateng@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Kirim Pesan */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--teks)', marginBottom: '1.5rem' }}>
              Kirim Pesan Cepat
            </h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-input" placeholder="Masukkan nama Anda" />
              </div>
              <div>
                <label className="form-label">Alamat Email</label>
                <input type="email" className="form-input" placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="form-label">Subjek/Keperluan</label>
                <input type="text" className="form-input" placeholder="Cth: Silaturahmi / Undangan Acara" />
              </div>
              <div>
                <label className="form-label">Pesan Anda</label>
                <textarea className="form-textarea" placeholder="Tuliskan pesan Anda dengan jelas..."></textarea>
              </div>
              <button type="button" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem', border: 'none', cursor: 'pointer' }}>
                Kirim Pesan Sekarang <Send size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          </div>

        </div>

        {/* Peta Lokasi */}
        <div style={{ marginTop: '4rem', width: '100%', height: '400px', background: '#f1f5f9', borderRadius: '16px', overflow: 'hidden' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.60965032596!2d110.33878546198897!3d-6.993215286292374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d024d%3A0x1e0432b9da5cb9f2!2sSemarang%2C%20Kota%20Semarang%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1680000000000!5m2!1sid!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <Footer />
    </>
  )
}
