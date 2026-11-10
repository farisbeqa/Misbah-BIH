import { S3Client } from '@aws-sdk/client-s3'

// Uploaded media lives in a private S3 bucket and is served through CloudFront.
// Credentials come from the runtime's AWS role (Amplify compute role in
// production, the developer's AWS profile locally) — no keys in env vars.

export const MEDIA_BUCKET = process.env.MEDIA_BUCKET ?? 'misbah-edu-media-770324276704'
export const MEDIA_PUBLIC_URL = process.env.MEDIA_PUBLIC_URL ?? 'https://d39iz2jyquc1uh.cloudfront.net'

export const s3 = new S3Client({ region: process.env.MEDIA_REGION ?? 'eu-central-1' })
