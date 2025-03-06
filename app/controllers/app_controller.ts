import { appRoutes } from '#shared/routes'
import type { HttpContext } from '@adonisjs/core/http'
import DashboardService from '#services/dashboard_service'
import verificationConfig from '#config/verification'

export default class AppController {
    async dashboard({ inertia, auth, request }: HttpContext) {
        const user = auth.user!
        const page = request.input('page', 1)
        const perPage = 10

        // Get filtered verifications
        const verifications = await DashboardService.getFilteredVerifications(user.id, {
            idNumber: request.input('idNumber'),
            idType: request.input('idType'),
            fromDate: request.input('fromDate'),
            toDate: request.input('toDate'),
            page,
            perPage,
        })

        // Get token history with pagination and balance
        const tokenHistory = await DashboardService.getTokenTransactions(user.id, page, perPage)
        const tokenBalance = await DashboardService.getTokenBalance(user.id)
        const tokenBalanceChange = await DashboardService.getTokenBalanceChange(user.id)

        // Get stats and chart data
        const stats = await DashboardService.getVerificationStats(
            user.id,
            tokenBalance,
            tokenBalanceChange
        )
        const chartData = await DashboardService.getVerificationChartData(user.id)

        return inertia.render('dashboard', {
            stats,
            verifications: verifications.all(),
            tokenHistory: tokenHistory.all(),
            chartData,
            verificationPagination: {
                currentPage: verifications.currentPage,
                totalPages: Math.ceil(verifications.total / perPage),
                perPage,
                total: verifications.total,
            },
            tokenPagination: {
                currentPage: tokenHistory.currentPage,
                totalPages: Math.ceil(tokenHistory.total / perPage),
                perPage,
                total: tokenHistory.total,
            },
        })
    }

    async verify({ inertia }: HttpContext) {
        const types = Object.values(verificationConfig.types)
        return inertia.render('verify', { types })
    }

    async tokens(ctx: HttpContext) {
        const user = ctx.auth.user!
        const page = ctx.request.input('page', 1)
        const perPage = 10

        const tokenHistory = await DashboardService.getTokenTransactions(user.id, page, perPage)
        const tokenBalance = await DashboardService.getTokenBalance(user.id)

        return ctx.inertia.render('tokens', {
            token_history: tokenHistory.all(),
            token_balance: tokenBalance,
            pagination: {
                currentPage: tokenHistory.currentPage,
                totalPages: Math.ceil(tokenHistory.total / perPage),
                perPage,
                total: tokenHistory.total,
            },
        })
    }

    async history({ inertia, auth, request }: HttpContext) {
        const user = auth.user!
        const page = request.input('page', 1)
        const perPage = 10

        const verifications = await DashboardService.getFilteredVerifications(user.id, {
            idNumber: request.input('idNumber'),
            idType: request.input('idType'),
            fromDate: request.input('fromDate'),
            toDate: request.input('toDate'),
            page,
            perPage,
        })

        return inertia.render('history', {
            verifications: verifications.all(),
            pagination: {
                currentPage: verifications.currentPage,
                totalPages: Math.ceil(verifications.total / perPage),
                perPage,
                total: verifications.total,
            },
        })
    }

    async settings(ctx: HttpContext) {
        return ctx.inertia.render('settings', {
            user: ctx.auth.user,
        })
    }

    async updateSettings({ request, response }: HttpContext) {
        const data = request.only(['name', 'phone', 'profile_photo'])
        console.log(data)
        // Update user logic here
        return response.json({ success: true })
    }

    async logout(ctx: HttpContext) {
        await ctx.auth.use('user').logout()
        return ctx.response.redirect().toPath(appRoutes.auth.login)
    }
}
