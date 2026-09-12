'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'

export default function KalkulatorZakat() {
  const [jenis, setJenis] = useState('penghasilan') // penghasilan, maal
  const [pendapatan, setPendapatan] = useState('')
  const [bonus, setBonus] = useState('')
  const [tabungan, setTabungan] = useState('')
  const [emas, setEmas] = useState('')

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0)
  }

  let totalZakat = 0
  let isWajib = false
  
  if (jenis === 'penghasilan') {
    const totalPendapatan = Number(pendapatan) + Number(bonus)
    // Asumsi Nisab per bulan = 85 gram emas / 12 (kisaran Rp 7.000.000 / bln)
    isWajib = totalPendapatan >= 7000000
    if (isWajib) {
      totalZakat = totalPendapatan * 0.025
    }
  } else if (jenis === 'maal') {
    const totalHarta = Number(tabungan) + Number(emas)
    // Asumsi Nisab 85 gram emas = kisaran Rp 85.000.000 per tahun
    isWajib = totalHarta >= 85000000
    if (isWajib) {
      totalZakat = totalHarta * 0.025
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ background: 'var(--hijau-tua)', color: 'white', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Calculator size={28} color="var(--emas)" />
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--emas)' }}>Kalkulator Zakat</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Hitung kewajiban zakat Anda secara akurat</p>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setJenis('penghasilan')} 
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 700, border: 'none', background: jenis === 'penghasilan' ? '#fef3c7' : '#f1f5f9', color: jenis === 'penghasilan' ? '#b45309' : '#64748b', cursor: 'pointer' }}>
            Zakat Penghasilan
          </button>
          <button 
            onClick={() => setJenis('maal')} 
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 700, border: 'none', background: jenis === 'maal' ? '#fef3c7' : '#f1f5f9', color: jenis === 'maal' ? '#b45309' : '#64748b', cursor: 'pointer' }}>
            Zakat Maal
          </button>
        </div>

        {jenis === 'penghasilan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Pendapatan / Gaji per Bulan (Rp)</label>
              <input type="number" className="form-input" placeholder="Contoh: 8000000" value={pendapatan} onChange={e => setPendapatan(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Bonus / THR / Lainnya (Rp)</label>
              <input type="number" className="form-input" placeholder="Opsional" value={bonus} onChange={e => setBonus(e.target.value)} />
            </div>
          </div>
        )}

        {jenis === 'maal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Tabungan / Deposito (Rp)</label>
              <input type="number" className="form-input" placeholder="Telah mengendap 1 tahun (Haul)" value={tabungan} onChange={e => setTabungan(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Nilai Emas / Perak / Perhiasan (Rp)</label>
              <input type="number" className="form-input" placeholder="Opsional" value={emas} onChange={e => setEmas(e.target.value)} />
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: isWajib ? '#fefce8' : '#f8fafc', border: isWajib ? '1px solid #fde047' : '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--teks-abu)', marginBottom: '0.5rem' }}>
            Status: <strong>{isWajib ? 'Wajib Zakat' : 'Belum Wajib Zakat (Di Bawah Nisab)'}</strong>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: isWajib ? 'var(--hijau-tua)' : '#94a3b8' }}>
            {formatRupiah(totalZakat)}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', marginBottom: 0 }}>
            {jenis === 'penghasilan' ? 'Nisab berasumsi setara 85 gr emas/tahun dibagi 12 bulan (Rp 7 juta/bulan).' : 'Nisab berasumsi setara 85 gr emas per tahun (Rp 85 juta).'}
          </p>
        </div>
      </div>
    </div>
  )
}
