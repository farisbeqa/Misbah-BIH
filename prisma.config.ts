// @ts-nocheck
import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.TURSO_DATABASE_URL
      ? `${process.env.TURSO_DATABASE_URL}?authToken=${process.env.TURSO_AUTH_TOKEN ?? ''}`
      : `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
  },
})
