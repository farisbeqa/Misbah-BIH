// The translator worker (AWS Lambda "misbah-translator", code in lambda/translator).
//
//   npm run translator:deploy                     – build and upload the code (creates the function the first time)
//   npm run translator -- invoke '{"sweep":true}' – translate everything missing/outdated now (in the background)
//   npm run translator -- invoke '{"entity":"blog","id":83}' --wait
//
// Needs AWS credentials, e.g. AWS_PROFILE=AdministratorAccess-770324276704.
// One-time AWS setup (already done): IAM role misbah-translator (Lambda basic
// execution + dsql:DbConnect + bedrock:InvokeModel*), permission for
// the website's compute role to invoke the function, the daily EventBridge rule
// misbah-translator-daily (03:00 UTC, event {"sweep":true}), and
// scripts/aws/add-translation-table.js.
import { build } from 'esbuild'
import { mkdirSync, readFileSync } from 'node:fs'
import { deflateRawSync, crc32 } from 'node:zlib'
import {
  LambdaClient,
  GetFunctionCommand,
  CreateFunctionCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
  InvokeCommand,
  waitUntilFunctionUpdatedV2,
  waitUntilFunctionActiveV2,
} from '@aws-sdk/client-lambda'

const FUNCTION = 'misbah-translator'
const REGION = 'eu-central-1'
const ROLE_ARN = 'arn:aws:iam::770324276704:role/misbah-translator'
const ENV = {
  DSQL_HOST: '2nuhddmmzudvhgj2wsbw5k52ze.dsql.eu-central-1.on.aws',
  DSQL_REGION: 'eu-central-1',
  DSQL_USER: 'misbah_app',
  BEDROCK_REGION: 'eu-central-1',
  TRANSLATOR_MODEL: process.env.TRANSLATOR_MODEL || 'global.anthropic.claude-haiku-5-5',
}

const lambda = new LambdaClient({ region: REGION })

/** Minimal zip writer (one deflated file) — Lambda takes code as a zip archive */
function zipOne(name: string, data: Buffer): Buffer {
  const compressed = deflateRawSync(data, { level: 9 })
  const crc = crc32(data) >>> 0
  const nameBuf = Buffer.from(name)
  const now = new Date()
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()

  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4)
  local.writeUInt16LE(0, 6)
  local.writeUInt16LE(8, 8)
  local.writeUInt16LE(time, 10)
  local.writeUInt16LE(date, 12)
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(compressed.length, 18)
  local.writeUInt32LE(data.length, 22)
  local.writeUInt16LE(nameBuf.length, 26)
  local.writeUInt16LE(0, 28)

  const central = Buffer.alloc(46)
  central.writeUInt32LE(0x02014b50, 0)
  central.writeUInt16LE(0x031e, 4) // made by: Unix
  central.writeUInt16LE(20, 6)
  central.writeUInt16LE(0, 8)
  central.writeUInt16LE(8, 10)
  central.writeUInt16LE(time, 12)
  central.writeUInt16LE(date, 14)
  central.writeUInt32LE(crc, 16)
  central.writeUInt32LE(compressed.length, 20)
  central.writeUInt32LE(data.length, 24)
  central.writeUInt16LE(nameBuf.length, 28)
  central.writeUInt16LE(0, 30)
  central.writeUInt16LE(0, 32)
  central.writeUInt16LE(0, 34)
  central.writeUInt16LE(0, 36)
  central.writeUInt32LE((0o100644 << 16) >>> 0, 38)
  central.writeUInt32LE(0, 42)

  const localSize = local.length + nameBuf.length + compressed.length
  const centralSize = central.length + nameBuf.length
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(1, 8)
  end.writeUInt16LE(1, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(localSize, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([local, nameBuf, compressed, central, nameBuf, end])
}

async function exists(): Promise<boolean> {
  try {
    await lambda.send(new GetFunctionCommand({ FunctionName: FUNCTION }))
    return true
  } catch (err) {
    if ((err as { name?: string }).name === 'ResourceNotFoundException') return false
    throw err
  }
}

async function deploy() {
  mkdirSync('node_modules/.cache/translator', { recursive: true })
  const outfile = 'node_modules/.cache/translator/index.js'
  await build({
    entryPoints: ['lambda/translator/index.ts'],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    minify: true,
    external: ['pg-native'],
    logLevel: 'warning',
  })
  const code = readFileSync(outfile)
  const zip = zipOne('index.js', code)
  console.log(`Bundle ${(code.length / 1024).toFixed(0)} KB, zip ${(zip.length / 1024).toFixed(0)} KB`)

  const config = {
    FunctionName: FUNCTION,
    Runtime: 'nodejs22.x' as const,
    Handler: 'index.handler',
    Role: ROLE_ARN,
    Timeout: 900,
    MemorySize: 512,
    Environment: { Variables: ENV },
    Description: 'Misbah EDU: translates website content (Bosnian -> en/ar/de/tr) with Claude on Amazon Bedrock',
  }

  if (await exists()) {
    await lambda.send(new UpdateFunctionCodeCommand({ FunctionName: FUNCTION, ZipFile: zip }))
    await waitUntilFunctionUpdatedV2({ client: lambda, maxWaitTime: 120 }, { FunctionName: FUNCTION })
    await lambda.send(new UpdateFunctionConfigurationCommand(config))
    await waitUntilFunctionUpdatedV2({ client: lambda, maxWaitTime: 120 }, { FunctionName: FUNCTION })
    console.log(`Updated ${FUNCTION}.`)
  } else {
    await lambda.send(new CreateFunctionCommand({ ...config, Code: { ZipFile: zip }, Architectures: ['arm64'] }))
    await waitUntilFunctionActiveV2({ client: lambda, maxWaitTime: 120 }, { FunctionName: FUNCTION })
    console.log(`Created ${FUNCTION}.`)
  }
}

async function invoke(payload: string, wait: boolean) {
  JSON.parse(payload) // validate
  const res = await lambda.send(new InvokeCommand({
    FunctionName: FUNCTION,
    InvocationType: wait ? 'RequestResponse' : 'Event',
    Payload: Buffer.from(payload),
  }))
  if (wait) {
    console.log(res.FunctionError ? `Error: ${res.FunctionError}` : 'OK', res.Payload ? Buffer.from(res.Payload).toString() : '')
  } else {
    console.log(`Queued (status ${res.StatusCode}). Follow progress in CloudWatch logs: /aws/lambda/${FUNCTION}`)
  }
}

const [command, payload] = process.argv.slice(2)
const run = command === 'deploy' ? deploy() : command === 'invoke' ? invoke(payload ?? '{"sweep":true}', process.argv.includes('--wait')) : null
if (!run) {
  console.error('usage: translator.ts deploy | invoke <json> [--wait]')
  process.exit(1)
}
run.catch(err => {
  console.error(err)
  process.exit(1)
})
