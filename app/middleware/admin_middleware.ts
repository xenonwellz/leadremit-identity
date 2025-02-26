import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { adminRoutes } from '#shared/routes'
/**
 * Admin middleware is used to authenticate HTTP requests for admin routes
 * and deny access to non-admin users.
 */
export default class AdminMiddleware {
    /**
     * The URL to redirect to, when authentication fails
     */
    redirectTo = adminRoutes.auth.login

    async handle(
        ctx: HttpContext,
        next: NextFn,
        options: {
            guards?: (keyof Authenticators)[]
        } = {}
    ) {
        // Default to admin guard if not specified
        const guards = options.guards || ['admin']

        await ctx.auth.authenticateUsing(guards, { loginRoute: this.redirectTo })
        return next()
    }
}
