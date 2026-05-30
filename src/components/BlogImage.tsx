'use client'

interface BlogImageProps {
  src: string
  alt: string
}

export default function BlogImage({ src, alt }: BlogImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="w-full object-cover max-h-80"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
  )
}
