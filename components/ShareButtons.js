'use client'

import { MessageCircle } from 'lucide-react'

export default function ShareButtons({ slug, judul }) {
  const urlBase = `https://ma-jateng.vercel.app/berita/${slug}`
  
  const handleShare = (platform) => {
    // Fire and forget share tracking
    fetch(`/api/berita/${slug}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'share' })
    }).catch(err => console.error('Failed to track share:', err))
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <a 
        href={`https://wa.me/?text=${encodeURIComponent(judul + ' - Baca selengkapnya di: ' + urlBase + '?utm_source=whatsapp')}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => handleShare('whatsapp')}
        style={{ background: '#25D366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(37,211,102,0.2)' }}
      >
        <MessageCircle size={18} /> WhatsApp
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlBase + '?utm_source=facebook')}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => handleShare('facebook')}
        style={{ background: '#1877F2', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(24,119,242,0.2)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(urlBase + '?utm_source=twitter')}&text=${encodeURIComponent(judul)}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => handleShare('twitter')}
        style={{ background: '#1DA1F2', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(29,161,242,0.2)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> Twitter
      </a>
    </div>
  )
}
