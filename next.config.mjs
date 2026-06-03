/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma + libsql must run in Node.js runtime, not bundled by webpack
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-libsql', '@libsql/client'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'scontent.cdninstagram.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Cloudflare R2 public bucket / custom domain
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      // Allow any https image (covers custom R2 domains)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
