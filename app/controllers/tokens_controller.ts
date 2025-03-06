import { HttpContext } from '@adonisjs/core/http'
import { PaymentService } from '#services/payment_service'

export default class TokensController {
    async purchase({ request, auth, inertia }: HttpContext) {
        const { amount } = request.body()
        const payment = await PaymentService.initializePayment(auth.user!.id, amount)
        return inertia.location(payment.authorizationUrl)
    }
}
