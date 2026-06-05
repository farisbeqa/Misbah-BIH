import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2'
import { requireAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
const ALLOWED_AUDIO = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/mp4', 'audio/aac', 'audio/webm', 'audio/x-m4a']

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return NextResponse.json({ error: 'Nije autorizovano' }, { status: 401 })

  try {
    // Production: use R2 presigned URL
    if (process.env.R2_ACCOUNT_ID) {
      const { filename, contentType, folder = 'videos' } = await request.json()
      const allowed = folder === 'thumbs' ? ALLOWED_IMAGE : folder === 'audio' ? ALLOWED_AUDIO : [...ALLOWED_VIDEO, ...ALLOWED_IMAGE]
      if (!allowed.includes(contentType))
        return NextResponse.json({ error: 'Nepodržan tip fajla' }, { status: 400 })

      const ext = filename.split('.').pop()?.toLowerCase() ?? 'bin'
      const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType })
      const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 900 })

      return NextResponse.json({ uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}`, key })
    }

    // Development: save to local public/uploads/
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Nije odabran fajl' }, { status: 400 })

    const allowed = [...ALLOWED_VIDEO, ...ALLOWED_IMAGE, ...ALLOWED_AUDIO]
    if (!allowed.includes(file.type))
      return NextResponse.json({ error: 'Nepodržan tip fajla' }, { status: 400 })

    const ext = file.name.split('.').pop() ?? 'bin'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()))

    return NextResponse.json({ publicUrl: `/uploads/${filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Greška pri uploadu' }, { status: 500 })
  }
}
