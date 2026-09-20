'use client'

import { useEffect, useRef } from 'react'

export default function ViewTracker({ slug }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true
      // Call the track endpoint without waiting for the response
      fetch(`/api/berita/${slug}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'view' })
      }).catch(err => console.error('Failed to track view:', err))
    }
  }, [slug])

  return null
}
