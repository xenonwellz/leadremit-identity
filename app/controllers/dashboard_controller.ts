import type { HttpContext } from '@adonisjs/core/http'
import DashboardService from '#services/dashboard_service'

export default class DashboardController {
    async index({ inertia, auth, request }: HttpContext) {
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
}
