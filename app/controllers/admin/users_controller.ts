import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import TokenTransaction from '#models/token_transaction'

@inject()
export default class AdminUsersController {
    /**
     * Display user details
     */
    async show({ inertia, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.load('verifications')
        await user.load('tokenTransactions')

        return inertia.render('admin/users/show', {
            title: `User: ${user.fullName}`,
            user,
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
            status: 'completed',
        })

        session.flash('success', `Added ${amount} tokens to ${user.fullName}'s balance`)
        return response.redirect().back()
    }
}
