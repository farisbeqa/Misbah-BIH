// @ts-nocheck
import { defineConfig } from 'prisma/config'

// The app connects to Aurora DSQL with IAM tokens (src/lib/db.ts), so the CLI
// only needs a URL for offline commands like `prisma migrate diff`. Tables are
// created with scripts/aws/schema.sql.
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/postgres',
  },
})
