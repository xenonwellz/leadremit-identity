import axios from 'axios'
import { base64Encode } from '#utils/encoding'

interface CIVConfig {
    baseUrl: string
    clientId: string
    clientSecret: string
    apiKey: string
}

export default class CIVService {
    private static config: CIVConfig = {
        baseUrl: process.env.NIBSS_CIV_BASE_URL || 'https://apitest.nibss-plc.com.ng/identity/v2',
        clientId: process.env.NIBSS_CLIENT_ID || '',
        clientSecret: process.env.NIBSS_CLIENT_SECRET || '',
        apiKey: process.env.NIBSS_API_KEY || '',
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

    static async verifyNIN(nin: string) {
        return this.makeRequest('/verifyVNinIndirect', nin)
    }

    static async verifyBVN(bvn: string) {
        return this.makeRequest('/verifyDocumentNumber', bvn)
    }

    static async verifyPhoneNumber(phone: string) {
        return this.makeRequest('/searchMobile', phone)
    }
}
