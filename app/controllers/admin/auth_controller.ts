import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator } from '#validators/admin/auth'
import Admin from '#models/admin'
import { adminRoutes } from '#shared/routes'

@inject()
export default class AdminAuthController {
    /**
     * Display the login page
     */
    async login({ auth, response, inertia }: HttpContext) {
        if (await auth.use('admin').check()) {
            return response.redirect().toPath(adminRoutes.app.dashboard)
        }
        return inertia.render('admin/auth/login', {
            title: 'Admin Login',
        })
    }

    /**
     * Handle login request
     */
    async handleLogin(ctx: HttpContext) {
        const payload = await ctx.request.validateUsing(loginValidator)
        const admin = await Admin.verifyCredentials(payload.email, payload.password)
        await ctx.auth.use('admin').login(admin)
        return ctx.response.redirect().toPath(adminRoutes.app.dashboard)
    }

    /**
     * Handle logout request
     */
    async logout({ auth, response }: HttpContext) {
        await auth.use('admin').logout()
        return response.redirect().toPath(adminRoutes.auth.login)
    }
}
