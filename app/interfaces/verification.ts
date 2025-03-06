export interface VerificationQuery {
    user_id: string
    id_number?: string
    id_type?: string
    created_at?: string
    status?: 'success' | 'failed'
}

export interface VerificationStats {
    total: number
    successful: number
    failed: number
}
