import axios from 'axios'
import { base64Encode } from '#utils/encoding'
import env from '#start/env'

interface CIVConfig {
    baseUrl: string
    clientId: string
    clientSecret: string
    apiKey: string
}

export default class CIVService {
    private static config: CIVConfig = {
        baseUrl: env.get('NIBSS_CIV_BASE_URL'),
        clientId: env.get('NIBSS_CLIENT_ID'),
        clientSecret: env.get('NIBSS_CLIENT_SECRET'),
        apiKey: env.get('NIBSS_API_KEY'),
    }

    private static async getAuthToken(): Promise<string> {
        try {
            const response = await axios.post(`${this.config.baseUrl}/reset`, null, {
                headers: {
                    'Client-Id': this.config.clientId,
                    'Client-Secret': this.config.clientSecret,
                    'Api-Key': this.config.apiKey,
                },
            })
            return response.data.token
        } catch (error) {
            throw new Error('Failed to obtain authentication token')
        }
    }

    private static async makeRequest(endpoint: string, validationNumber: string) {
        const token = await this.getAuthToken()
        const signature = base64Encode(this.config.clientId)

        try {
            const response = await axios.post(
                `${this.config.baseUrl}${endpoint}`,
                {
                    validationNumber,
                    signature,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Verification request failed')
        }
    }

    static async verifyVNIN(vnin: string) {
        return this.makeRequest('/verifyVNinIndirect', vnin)
    }

    static async verifyNIN(nin: string) {
        return this.makeRequest('/verifyDocumentNumber', nin)
    }

    static async verifyPhoneNumber(phone: string) {
        return this.makeRequest('/searchMobile', phone)
    }
}
