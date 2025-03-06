export type VerificationType = 'bvn' | 'nin'

export interface VerificationResult {
    success: boolean
    data?: {
        id: string
        name: string
        phone: string
        verified: boolean
    }
    error?: {
        code: string
        message: string
    }
}
