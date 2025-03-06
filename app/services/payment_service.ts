import { PaymentException } from '#exceptions/custom_exceptions'
import TokenTransaction from '#models/token_transaction'
import User from '#models/user'
import env from '#start/env'
import axios from 'axios'
import logger from '@adonisjs/core/services/logger'

export class PaymentService {
    private static baseUrl = 'https://merchants.leadremitpayments.com/api/v1'
    private static apiKey = env.get('LEADREMIT_API_KEY')

    private static async makeRequest(endpoint: string, method: string, data?: any) {
        try {
            const response = await axios({
                method,
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                },
                data,
            })
            return response.data
        } catch (error) {
            logger.error('Payment API Error:')
            logger.error(error.response.data)
            throw new PaymentException('Payment service is currently unavailable')
        }
    }

    static async createPaymentLink(amount: number, reference: string) {
        const payload = {
            name: `Token Purchase [${reference}]`,
            description: 'Purchase tokens for identity verification',
            amount: amount.toString(),
            currency: 'NGN',
            reference,
            usage: 'one-time',
            metadata: {
                showSuccessBtnOnDone: false,
            },
        }

        const response = await this.makeRequest('/paymentlink', 'POST', payload)
        return response.data
    }

    static async initializePaymentLink(userId: string, reference: string, amount: number) {
        const user = await User.findOrFail(userId)

        // Create pending transaction record
        const transaction = await TokenTransaction.create({
            userId: user.id,
            amount,
            transactionType: 'credit',
            transactionReference: reference,
            paymentProvider: 'leadremit',
            status: 'pending',
        })

        const payload = {
            first_name: user.fullName.split(' ')[0],
            last_name: user.fullName.split(' ').slice(1).join(' '),
            email: user.email,
        }

        const response = await this.makeRequest(
            `/paymentlink/initialize/${reference}`,
            'POST',
            payload
        )
        return {
            authorizationUrl: response.data.authorization_url,
            reference: response.data.reference,
            transaction,
        }
    }

    static async verifyPayment(payload: any) {
        // Extract reference from webhook payload or direct payload
        const reference = payload.data?.metadata?.reference || payload.reference
        const status = payload.data?.status

        if (!reference || !status) {
            throw new PaymentException('Payment reference or status not found')
        }

        const transaction = await TokenTransaction.findByOrFail('transactionReference', reference)

        if (status === 'successful') {
            transaction.status = 'success'
            await transaction.save()
        }

        if (status === 'failed') {
            transaction.status = 'failed'
            await transaction.save()
        }
        return true
    }

    static async initializePayment(userId: string, amount: number) {
        const rand = Math.random().toString(36).substring(2, 6)
        const reference = `TKN-${rand}-${Date.now()}`.toUpperCase()

        const paymentLink = await PaymentService.createPaymentLink(amount, reference)
        const payment = await PaymentService.initializePaymentLink(
            userId,
            paymentLink.reference,
            amount
        )

        return {
            authorizationUrl: payment.authorizationUrl,
            reference: payment.reference,
            transaction: payment.transaction,
        }
    }
}
