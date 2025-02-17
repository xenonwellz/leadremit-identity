import { PaymentException } from '#exceptions/custom_exceptions'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import axios, { AxiosRequestConfig } from 'axios'

export default class PaystackService {
    private static secret = env.get('PAYSTACK_SECRET_KEY')

    private static getOptions(
        url: string,
        data: any = {},
        config: AxiosRequestConfig = {}
    ): {
        url: string
        data: any
        config: AxiosRequestConfig
    } {
        return {
            url,
            config: {
                ...config,
                headers: {
                    'authorization': `Bearer ${this.secret}`,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache',
                },
            },
            data,
        }
    }
    static async initializePayment(data: any) {
        try {
            const options = this.getOptions('https://api.paystack.co/transaction/initialize', data)
            const response = await axios.post(options.url, options.data, options.config)
            return response.data
        } catch (error) {
            logger.error('Paystack Error:', error)
            throw new PaymentException('We could not process your payment')
        }
    }

    static async verifyPayment(ref: string) {
        try {
            const options = this.getOptions(
                'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref)
            )
            const response = await axios.get(options.url, options.config)
            return response.data
        } catch (error) {
            logger.error('Paystack Error:')
            logger.error(error)
            throw new PaymentException('We could not process your payment')
        }
    }

    static getBanks = async () => {
        try {
            const options = this.getOptions('https://api.paystack.co/bank')
            const response = await axios.get(options.url, options.config)
            return response.data
        } catch (error) {
            logger.error('Paystack Error:', error)
            throw new PaymentException('Unable to fetch banks')
        }
    }

    static resolveAccountDetails = async (bank_code: string, account_number: string) => {
        try {
            const options = this.getOptions(
                `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`
            )
            const response = await axios.get(options.url, options.config)
            return response.data
        } catch (error) {
            logger.error('Paystack Error:')
            logger.error(error?.response?.data)
            throw new PaymentException('We could not verify the account number')
        }
    }

    static async getRecipient(account_number: string, bank_code: string) {
        try {
            const options = this.getOptions(`https://api.paystack.co/transferrecipient`, {
                type: 'nuban',
                account_number: account_number,
                bank_code: bank_code,
            })
            const response = await axios.post(options.url, options.data, options.config)
            return response.data
        } catch (error) {
            logger.error('Paystack Error:')
            logger.error(error)
            throw new PaymentException('We could not get the recipient')
        }
    }

    static transfer = async (data: any) => {
        try {
            const options = this.getOptions('https://api.paystack.co/transfer', data)
            const response = await axios.post(options.url, options.data, options.config)
            return response.data
        } catch (error) {
            logger.error('Paystack Error:')
            logger.error(error)
            throw new PaymentException('We could not process your transfer')
        }
    }
}
