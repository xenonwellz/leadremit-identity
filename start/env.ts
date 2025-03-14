import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.string(),

    /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

    /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */

    DATABASE_URL: Env.schema.string(),

    /*
  |----------------------------------------------------------
  | Variables for configuring NIBSS API
  |----------------------------------------------------------
  */
    NIBSS_BVN_BASE_URL: Env.schema.string(),
    NIBSS_CIV_BASE_URL: Env.schema.string(),

    NIBSS_CLIENT_ID: Env.schema.string(),
    NIBSS_CLIENT_SECRET: Env.schema.string(),
    NIBSS_API_KEY: Env.schema.string(),

    DOMAIN: Env.schema.string(),
    ADMIN_DOMAIN: Env.schema.string(),
    LEADREMIT_API_KEY: Env.schema.string(),
})
