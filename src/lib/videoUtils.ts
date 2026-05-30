export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'upload' | 'unknown'

export interface VideoInfo {
  platform: Platform
  embedUrl: string
  thumbnailUrl: string | null
  videoId: string | null
  isShortForm: boolean
}

export function detectPlatform(url: string): Platform {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) return 'facebook'
  return 'unknown'
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#\n]+)/,
    /youtu\.be\/([^?&#\n]+)/,
    /youtube\.com\/embed\/([^?&#\n]+)/,
    /youtube\.com\/shorts\/([^?&#\n]+)/,
    /youtube\.com\/v\/([^?&#\n]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : null
}

export function extractTikTokId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/)
  return match ? match[1] : null
}

export function parseVideoUrl(url: string): VideoInfo {
  const platform = detectPlatform(url)

  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeId(url)
      const isShortForm = url.includes('/shorts/')
      if (!videoId) return unknownVideo()
      return {
        platform,
        videoId,
        isShortForm,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      }
    }
    case 'instagram': {
      const shortcode = extractInstagramShortcode(url)
      const isShortForm = url.includes('/reel') || url.includes('/reels')
      if (!shortcode) return unknownVideo()
      const cleanUrl = url.split('?')[0].replace(/\/$/, '')
      return {
        platform,
        videoId: shortcode,
        isShortForm,
        embedUrl: `https://www.instagram.com/p/${shortcode}/embed/`,
        thumbnailUrl: null,
      }
    }
    case 'tiktok': {
      const videoId = extractTikTokId(url)
      if (!videoId) return unknownVideo()
      return {
        platform,
        videoId,
        isShortForm: true,
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        thumbnailUrl: null,
      }
    }
    case 'facebook': {
      const encodedUrl = encodeURIComponent(url)
      return {
        platform,
        videoId: null,
        isShortForm: false,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560&autoplay=false`,
        thumbnailUrl: null,
      }
    }
    default:
      return unknownVideo()
  }
}

function unknownVideo(): VideoInfo {
  return {
    platform: 'unknown',
    videoId: null,
    isShortForm: false,
    embedUrl: '',
    thumbnailUrl: null,
  }
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    upload: 'Upload',
    unknown: 'Nepoznato',
  }
  return labels[platform] || platform
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: 'bg-red-600 text-white',
    instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white',
    tiktok: 'bg-black text-white',
    facebook: 'bg-blue-600 text-white',
    unknown: 'bg-gray-500 text-white',
  }
  return colors[platform] || 'bg-gray-500 text-white'
}

export async function fetchYouTubeOEmbed(url: string): Promise<{ title?: string; thumbnailUrl?: string } | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
    }
  } catch {
    return null
  }
}

export async function fetchTikTokOEmbed(url: string): Promise<{ title?: string; thumbnailUrl?: string } | null> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
    }
  } catch {
    return null
  }
}
