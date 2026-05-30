import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const runtime = 'nodejs'

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500 MB
const MAX_THUMB_SIZE = 10 * 1024 * 1024  // 10 MB

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('video') as File | null
    const title = (formData.get('title') as string | null)?.trim()
    const description = (formData.get('description') as string | null)?.trim() || null
    const isShortForm = formData.get('isShortForm') === 'true'
    const thumbnailFile = formData.get('thumbnail') as File | null

    if (!file || file.size === 0)
      return NextResponse.json({ error: 'Video fajl je obavezan' }, { status: 400 })
    if (!title)
      return NextResponse.json({ error: 'Naslov je obavezan' }, { status: 400 })
    if (file.size > MAX_VIDEO_SIZE)
      return NextResponse.json({ error: 'Video je prevelik (max 500 MB)' }, { status: 400 })
    if (!ALLOWED_VIDEO_TYPES.includes(file.type))
      return NextResponse.json({ error: 'Nepodržani format. Koristite MP4, WebM ili MOV.' }, { status: 400 })

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const videoExt = file.name.split('.').pop()?.toLowerCase() || 'mp4'
    const videoFilename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${videoExt}`
    await writeFile(path.join(uploadsDir, videoFilename), Buffer.from(await file.arrayBuffer()))
    const videoUrl = `/uploads/${videoFilename}`

    let thumbnailUrl: string | null = null
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (thumbnailFile.size > MAX_THUMB_SIZE)
        return NextResponse.json({ error: 'Thumbnail je prevelik (max 10 MB)' }, { status: 400 })
      if (!ALLOWED_IMAGE_TYPES.includes(thumbnailFile.type))
        return NextResponse.json({ error: 'Thumbnail mora biti JPG, PNG ili WebP' }, { status: 400 })
      const thumbExt = thumbnailFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      const thumbFilename = `thumb-${Date.now()}-${Math.random().toString(36).slice(2)}.${thumbExt}`
      await writeFile(path.join(uploadsDir, thumbFilename), Buffer.from(await thumbnailFile.arrayBuffer()))
      thumbnailUrl = `/uploads/${thumbFilename}`
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url: videoUrl,
        platform: 'upload',
        embedUrl: videoUrl,
        thumbnailUrl,
        isShortForm,
        published: true,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Greška pri uploadu fajla' }, { status: 500 })
  }
}
