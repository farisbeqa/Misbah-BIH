'use client'

import { useState } from 'react'

/** Picture shown when a card has no image, or its image cannot be loaded (Misbah lantern) */
export const FALLBACK_IMAGE = '/card-fallback.jpg'

/**
 * The image of a card (blog post, story, video, activity, …). Without an image,
 * or when the image link is broken, it shows the Misbah lantern instead of an
 * empty box.
 */
export default function CardImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const fallback = !src || failed
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallback ? FALLBACK_IMAGE : src}
      alt={fallback ? '' : alt}
      loading="lazy"
      className={`${className ?? ''}${fallback ? ' card-fallback' : ''}`}
      onError={() => setFailed(true)}
    />
  )
}
