import '@tanstack/react-start/server-only'

import { PrismaClient } from './generated/prisma/client.js'
import { PrismaNeon } from '@prisma/adapter-neon'

import { getDatabaseUrl } from './database-url.js'

const adapter = new PrismaNeon({
  connectionString: getDatabaseUrl(),
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
