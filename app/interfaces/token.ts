export interface TokenTransaction {
    user_id: string
    amount: number
    type: 'credit' | 'debit'
    description: string
}

export interface TokenBalance {
    balance: number
    change: number
}
