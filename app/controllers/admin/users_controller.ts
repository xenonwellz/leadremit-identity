import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import TokenTransaction from '#models/token_transaction'
import DashboardService from '#services/dashboard_service'

@inject()
export default class AdminUsersController {
    /**
     * Display user details
     */
    async show({ inertia, params, request }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const perPage = 10

        // Get page numbers from query params
        const verificationPage = request.input('verification_page', 1)
        const transactionPage = request.input('transaction_page', 1)

        // Load paginated verifications and transactions
        const verifications = await user
            .related('verifications')
            .query()
            .orderBy('created_at', 'desc')
            .paginate(verificationPage, perPage)

        const tokenTransactions = await user
            .related('tokenTransactions')
            .query()
            .orderBy('created_at', 'desc')
            .paginate(transactionPage, perPage)

        return inertia.render('admin/users/show', {
            title: `User: ${user.fullName}`,
            user,
            tokenBalance: await DashboardService.getTokenBalance(user.id),
            verifications: verifications.all(),
            tokenTransactions: tokenTransactions.all(),
            verificationPagination: {
                currentPage: verifications.currentPage,
                totalPages: Math.ceil(verifications.total / perPage),
                perPage,
                total: verifications.total,
            },
            transactionPagination: {
                currentPage: tokenTransactions.currentPage,
                totalPages: Math.ceil(tokenTransactions.total / perPage),
                perPage,
                total: tokenTransactions.total,
            },
        })
    }

    /**
     * Toggle user suspension status
     */
    async toggleSuspension({ params, response }: HttpContext) {
        const user = await User.findOrFail(params.id)

        // Toggle suspension status
        user.isSuspended = !user.isSuspended
        await user.save()

        return response.redirect().back()
    }

    /**
     * Add tokens to user balance
     */
    async addTokens({ request, params, response, session }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const amount = request.input('amount', 0)

        if (amount <= 0) {
            session.flash('error', 'Amount must be greater than zero')
            return response.redirect().back()
        }

        // Create token transaction record
        await TokenTransaction.create({
            userId: user.id,
            amount: Number(amount),
            transactionType: 'credit',
            transactionReference: `ADMIN_CREDIT_${Date.now()}`,
            paymentProvider: 'admin',
            status: 'success',
        })

        session.flash('success', `Added ${amount} tokens to ${user.fullName}'s balance`)
        return response.redirect().back()
    }
}
