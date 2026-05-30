'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, Facebook, Instagram } from 'lucide-react'

interface VideoEmbedProps {
  platform: string
  embedUrl: string
  isShortForm: boolean
  originalUrl: string
  title: string
}

export default function VideoEmbed({ platform, embedUrl, isShortForm, originalUrl, title }: VideoEmbedProps) {
  useEffect(() => {
    if (platform === 'instagram') {
      const existing = document.getElementById('ig-embed-script')
      if (!existing) {
        const script = document.createElement('script')
        script.id = 'ig-embed-script'
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        document.body.appendChild(script)
      } else if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process()
      }
    }
  }, [platform, embedUrl])

  if (!embedUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 bg-zinc-50 rounded-2xl">
        <p className="text-zinc-500 text-sm">Video nije dostupan za prikaz</p>
        <a href={originalUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm hover:bg-zinc-700 transition-colors">
          <ExternalLink size={14} />
          Otvori na izvoru
        </a>
      </div>
    )
  }

  // ── YouTube (landscape) ──────────────────────────────────────────────────
  if (platform === 'youtube' && !isShortForm) {
    return (
      <div className="space-y-3">
        <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-2xl shadow-lg"
            style={{ border: 'none' }}
          />
        </div>
        <OriginalLink href={originalUrl} platform={platform} />
      </div>
    )
  }

  // ── YouTube Shorts ───────────────────────────────────────────────────────
  if (platform === 'youtube' && isShortForm) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-full" style={{ maxWidth: 360 }}>
          <div className="relative w-full" style={{ paddingBottom: '177.78%', height: 0 }}>
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-2xl shadow-lg"
              style={{ border: 'none' }}
            />
          </div>
        </div>
        <OriginalLink href={originalUrl} platform={platform} />
      </div>
    )
  }

  // ── Instagram — blockquote embed ─────────────────────────────────────────
  if (platform === 'instagram') {
    const shortcode = embedUrl.match(/\/p\/([A-Za-z0-9_-]+)\//)?.[1]
    const postUrl = shortcode ? `https://www.instagram.com/p/${shortcode}/` : originalUrl
    return (
      <div className="flex flex-col items-center gap-3">
        <div style={{ maxWidth: 540, width: '100%' }}>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={postUrl}
            data-instgrm-version="14"
            style={{
              background: '#fff',
              border: '0',
              borderRadius: 12,
              boxShadow: '0 0 1px rgba(0,0,0,0.08),0 1px 5px rgba(0,0,0,0.1)',
              margin: '0 auto',
              maxWidth: 540,
              minWidth: 326,
              padding: 0,
              width: '100%',
            }}
          >
            <div style={{ padding: '16px' }}>
              <a href={postUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none', color: '#3d3d4e' }}>
                <p style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: 14, margin: 0, padding: '8px 0 7px' }}>
                  {title || 'Pogledaj ovu objavu na Instagramu'}
                </p>
              </a>
            </div>
          </blockquote>
        </div>
        <a href={originalUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-85"
          style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
          <Instagram size={15} />
          Otvori na Instagramu
        </a>
      </div>
    )
  }

  // ── Uploaded video — HTML5 player ────────────────────────────────────────
  if (platform === 'upload') {
    return (
      <div className={`flex ${isShortForm ? 'justify-center' : ''}`}>
        <div className={isShortForm ? 'w-full' : 'w-full'} style={isShortForm ? { maxWidth: 380 } : undefined}>
          <video
            controls
            className="w-full rounded-2xl shadow-lg bg-black"
            style={{ aspectRatio: isShortForm ? '9/16' : '16/9' }}
            preload="metadata"
          >
            <source src={embedUrl} />
            <p className="text-zinc-400 text-sm p-4">Vaš pretraživač ne podržava video prikaz.</p>
          </video>
        </div>
      </div>
    )
  }

  // ── TikTok ───────────────────────────────────────────────────────────────
  if (platform === 'tiktok') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div style={{ maxWidth: 340, width: '100%' }}>
          <iframe
            src={embedUrl}
            title={title}
            allow="encrypted-media"
            allowFullScreen
            style={{
              width: '100%',
              height: 740,
              borderRadius: 16,
              border: 'none',
              display: 'block',
            }}
          />
        </div>
        <OriginalLink href={originalUrl} platform="TikTok" />
      </div>
    )
  }

  // ── Facebook — direktni link jer embed zahtijeva whitelist domene ─────────
  if (platform === 'facebook') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-full rounded-2xl overflow-hidden bg-[#1877f2]/5 border border-[#1877f2]/20"
          style={{ maxWidth: 560 }}>
          <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={embedUrl}
              title={title}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
            />
          </div>
        </div>
        <a href={originalUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-85"
          style={{ background: '#1877f2' }}>
          <Facebook size={16} />
          Gledaj na Facebooku
        </a>
        <p className="text-xs text-zinc-400 text-center max-w-sm">
          Ako video nije dostupan ovdje, klikni dugme iznad da ga gledaš direktno na Facebooku.
        </p>
      </div>
    )
  }

  return null
}

function OriginalLink({ href, platform }: { href: string; platform: string }) {
  return (
    <div className="flex justify-center">
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 text-xs transition-colors">
        <ExternalLink size={12} />
        Otvori na {platform}
      </a>
    </div>
  )
}
