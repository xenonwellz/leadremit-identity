export interface TokenHistory {
    id: number
    amount: number
    type: 'credit' | 'debit'
    description: string
    created_at: string
}

export interface TokenHistoryTableProps {
    tokenHistory: TokenHistory[]
    pagination: PaginationData
}
