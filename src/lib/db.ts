import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { DsqlSigner } from '@aws-sdk/dsql-signer'
import { Pool } from 'pg'

// Aurora DSQL (PostgreSQL-compatible) on AWS with IAM authentication: every new
// connection gets a short-lived token signed with the runtime's AWS credentials
// (the Amplify compute role in production, the developer's AWS profile
// locally). There is no database password.

const HOST = process.env.DSQL_HOST ?? '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws'
const REGION = process.env.DSQL_REGION ?? 'eu-central-1'
/** `misbah_app` (read/write on the tables) in production; `admin` for local maintenance */
const USER = process.env.DSQL_USER ?? 'misbah_app'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient(): PrismaClient {
  const signer = new DsqlSigner({ hostname: HOST, region: REGION })
  const pool = new Pool({
    host: HOST,
    port: 5432,
    database: 'postgres',
    user: USER,
    password: () => (USER === 'admin' ? signer.getDbConnectAdminAuthToken() : signer.getDbConnectAuthToken()),
    ssl: { rejectUnauthorized: true },
    max: 3,
    idleTimeoutMillis: 60_000,
    // DSQL ends connections after an hour; recycle them before that
    maxLifetimeSeconds: 50 * 60,
  })
  return new PrismaClient({ adapter: new PrismaPg(pool) })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
