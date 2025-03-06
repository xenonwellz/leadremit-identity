import type { HttpContext } from '@adonisjs/core/http'
import DashboardService from '#services/dashboard_service'
import { PaymentService } from '#services/payment_service'
import crypto from 'node:crypto'
import env from '#start/env'
import vine from '@vinejs/vine'

const PurchaseValidator = vine.compile(
    vine.object({
        amount: vine.number().min(500).max(50000),
    })
)

export default class TokensController {
    async index({ inertia, auth, request }: HttpContext) {
        const user = auth.user!
        const page = request.input('page', 1)
        const perPage = 10

        const tokenHistory = await DashboardService.getTokenTransactions(user.id, page, perPage)
        const tokenBalance = await DashboardService.getTokenBalance(user.id)

        return inertia.render('tokens', {
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

    async purchase({ request, auth, inertia }: HttpContext) {
        const payload = await request.validateUsing(PurchaseValidator)
        const payment = await PaymentService.initializePayment(auth.user!.id, payload.amount)
        return inertia.location(payment.authorizationUrl)
    }

    async webhook({ request, response }: HttpContext) {
        // Validate webhook signature
        const signature = request.header('signature')
        const payload = request.body()
        const hash = crypto
            .createHmac('sha512', env.get('LEADREMIT_API_KEY'))
            .update(JSON.stringify(payload))
            .digest('hex')

        if (hash !== signature) {
            return response.status(400).send('Invalid signature')
        }

        await PaymentService.verifyPayment(payload)
        return response.status(200).send('OK')
    }
}
