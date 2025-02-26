import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types'

const authConfig = defineConfig({
    default: 'user',
    guards: {
        user: sessionGuard({
            useRememberMeTokens: false,
            provider: sessionUserProvider({
                model: () => import('#models/user'),
            }),
        }),
        admin: sessionGuard({
            useRememberMeTokens: false,
            provider: sessionUserProvider({
                model: () => import('#models/admin'),
            }),
        }),
    },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
    export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
    interface EventsList extends InferAuthEvents<Authenticators> {}
}
