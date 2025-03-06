import axios from 'axios'

interface BVNConfig {
    baseUrl: string
    clientId: string
    clientSecret: string
    apiKey: string
}

interface BVNResponse {
    responseCode: string | number
    responseDescription: string
    [key: string]: any
}

export default class BVNService {
    private static config: BVNConfig = {
        baseUrl: env.get('NIBSS_BVN_BASE_URL'),
        clientId: env.get('NIBSS_CLIENT_ID'),
        clientSecret: env.get('NIBSS_CLIENT_SECRET'),
        apiKey: env.get('NIBSS_API_KEY'),
    }

    private static async makeRequest<T extends BVNResponse>(
        endpoint: string,
        method: 'GET' | 'POST' = 'POST',
        data?: any
    ): Promise<T> {
        try {
            const response = await axios({
                method,
                url: `${this.config.baseUrl}${endpoint}`,
                data,
                headers: {
                    api_key: this.config.apiKey,
                },
            })
            return response.data
        } catch (error: any) {
            throw new Error(
                error.response?.data?.responseDescription || 'BVN verification request failed'
            )
        }
    }

    static async retrieveBvnByDateOfBirth(phoneNumber: string, dateOfBirth: string) {
        return this.makeRequest<{
            bvn: string
            responseCode: string
            responseDescription: string
        }>('/retrieveBvnByDateofBirth', 'POST', {
            PhoneNumber: phoneNumber,
            DateOfBirth: dateOfBirth,
        })
    }

    static async retrieveNameByBvn(phoneNumber: string, bvn: string) {
        return this.makeRequest<{
            Name: string
            responseCode: string
            responseDescription: string
        }>('/retrieveBvn', 'POST', {
            PhoneNumber: phoneNumber,
            bvn: bvn,
        })
    }

    static async retrieveAccounts(
        phoneNumber: string,
        dateOfBirth: string,
        pageNumber?: string,
        pageSize?: string
    ) {
        const params = new URLSearchParams({
            PhoneNumber: phoneNumber,
            DateOfBirth: dateOfBirth,
            ...(pageNumber && { pageNumber }),
            ...(pageSize && { pageSize }),
        })

        return this.makeRequest<{
            responseData: string[]
            responseCode: number
            responseDescription: string
        }>(`/retrieveAccounts?${params.toString()}`, 'GET')
    }

    static async retrieveAcronymDescription(accountStatus?: string, bankShortName?: string) {
        if (!accountStatus && !bankShortName) {
            throw new Error('Either accountStatus or bankShortName must be provided')
        }

        if (accountStatus && bankShortName) {
            throw new Error(
                'Only one parameter (accountStatus or bankShortName) should be provided'
            )
        }

        const params = new URLSearchParams(
            accountStatus ? { accountStatus } : { bankShortName: bankShortName! }
        )

        return this.makeRequest<{
            responseData: string
            responseCode: number
            responseDescription: string
        }>(`/retrieveAcronymDescription?${params.toString()}`, 'GET')
    }
}
