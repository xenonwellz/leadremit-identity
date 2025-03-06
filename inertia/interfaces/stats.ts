export interface Stats {
    total_calls: number
    successful_calls: number
    failed_calls: number
    token_balance: number
    total_calls_change: number
    successful_calls_change: number
    failed_calls_change: number
    token_balance_change: number
}

export interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        borderColor: string
        backgroundColor: string
        tension: number
    }[]
}
