import { defineConfig } from 'drizzle-kit'
import { env } from 'node:process'

export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        host: env.DB_HOST || 'localhost',
        port: Number.parseInt(env.DB_PORT || '5432'),
        user: env.DB_USER || 'postgres',
        password: env.DB_PASSWORD || undefined,
        database: env.DB_DATABASE || 'identity',
        ssl: false,
    },
    verbose: true,
    strict: true,
})
