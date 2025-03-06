import User from '#models/user'
import { LoginValidator, RegisterValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { appPages } from '#shared/pages'
import { appRoutes } from '#shared/routes'

export default class AuthController {
    async login(ctx: HttpContext) {
        return ctx.inertia.render(appPages.auth.login)
    }

    async register(ctx: HttpContext) {
        return ctx.inertia.render(appPages.auth.register)
    }

    async handleLogin(ctx: HttpContext) {
        const payload = await ctx.request.validateUsing(LoginValidator)
        const user = await User.verifyCredentials(payload.email, payload.password)
        await ctx.auth.use('user').login(user)
        return ctx.response.redirect().toPath(appRoutes.app.home)
    }

    async handleRegister(ctx: HttpContext) {
        const payload = await ctx.request.validateUsing(RegisterValidator)
        const user = await User.create(payload)
        await ctx.auth.use('user').login(user)
        return ctx.response.redirect().toPath(appRoutes.app.home)
    }

    async handleLogout(ctx: HttpContext) {
        await ctx.auth.use('user').logout()
        return ctx.response.redirect().toPath(appRoutes.auth.login)
    }
}
