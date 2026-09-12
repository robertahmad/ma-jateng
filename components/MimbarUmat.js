'use client'

import { BookOpen, HelpCircle, DownloadCloud, FileText, MessageCircle, ShieldCheck } from 'lucide-react'

export default function MimbarUmat({ kutipan }) {
  const jenis = kutipan?.kutipan_jenis || 'Ayat Al-Quran'
  const teks = kutipan?.kutipan_teks || '"Sesungguhnya bersama kesulitan ada kemudahan."'
  const sumber = kutipan?.kutipan_sumber || 'QS. Al-Insyirah: 6'
  const tanggal = kutipan?.kutipan_tanggal || 'Belum diupdate'

  return (
    <div style={{
      background: 'rgba(15, 45, 20, 0.65)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '1.5rem',
      width: '100%',
      maxWidth: '450px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      color: 'white'
    }}>
      
      {/* HEADER PANEL */}
      <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '1rem', marginBottom: '0.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--emas)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          <MessageCircle size={18} />
          Mimbar Umat
        </h3>
      </div>
      
      {/* KUTIPAN HARI INI */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emas)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <BookOpen size={16} />
            {jenis}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
            {tanggal.split(' ')[0]} {/* Hari/Tanggal */}
          </div>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid var(--emas)' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'white', fontWeight: 600, fontStyle: 'italic', marginBottom: '0.75rem' }}>
            {teks}
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--emas)', fontWeight: 800 }}>
            — {sumber}
          </div>
        </div>
      </div>

      {/* TOMBOL AKSI CEPAT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
        <a href="/layanan-umat" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.85rem 1.25rem', background: 'var(--emas)', color: 'var(--hijau-tua)',
          borderRadius: '12px', textDecoration: 'none', fontWeight: 800, transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(200, 169, 81, 0.3)'
        }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HelpCircle size={18} /> Tanya Jawab Agama
          </div>
          <span style={{ fontSize: '1.2rem' }}>→</span>
        </a>

        <a href="/khutbah" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.06)', color: 'white',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, transition: 'background 0.2s'
        }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={18} color="var(--emas)" /> Download Khutbah Jum&apos;at
          </div>
          <DownloadCloud size={16} color="rgba(255,255,255,0.5)" />
        </a>

        <a href="/cetak-imsakiyah" target="_blank" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.06)', color: 'white',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', boxSizing: 'border-box'
        }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={18} color="var(--emas)" /> Jadwal Imsakiyah Resmi
          </div>
          <DownloadCloud size={16} color="rgba(255,255,255,0.5)" />
        </a>

        <a href="/lp3h" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.06)', color: 'white',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', boxSizing: 'border-box'
        }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} color="var(--emas)" /> Sertifikasi Halal & NIB
          </div>
          <ShieldCheck size={16} color="rgba(255,255,255,0.5)" />
        </a>
      </div>
      
    </div>
  )
}
