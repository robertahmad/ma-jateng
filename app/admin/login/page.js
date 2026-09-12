'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(`Selamat datang, ${data.nama}!`)
        router.push('/admin')
        router.refresh()
      } else {
        toast.error(data.error || 'Login gagal. Periksa kembali username & password.')
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--hijau-tua)' }}>
      {/* Pattern Background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'url("/pattern-islami.svg")', zIndex: 0 }}></div>
      
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-ma.png" alt="Logo MA" style={{ height: '70px', borderRadius: '8px', margin: '0 auto 1rem', display: 'block' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hijau-tua)' }}>Ruang Kendali Pengurus</h1>
          <p style={{ color: 'var(--teks-abu)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Mathla&apos;ul Anwar Jawa Tengah</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Masukkan username..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Sistem'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Diberdayakan oleh</span>
          <img src="/logo-mitrasekolah.png" alt="MitraSekolah.id" style={{ height: '30px' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MitraSekolah.id</span>
        </div>
      </div>
    </div>
  )
}
