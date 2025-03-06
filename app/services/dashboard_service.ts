import TokenTransaction from '#models/token_transaction'
import User from '#models/user'
import TokenTransactions from '#models/token_transaction'
import { DateTime } from 'luxon'
import Verification from '#models/verification'

export default class DashboardService {
    static async getTokenTransactions(userId: string, page: number, perPage: number) {
        return await TokenTransaction.query()
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .paginate(page, perPage)
    }

    static async getTokenBalance(userId: string): Promise<number> {
        const credits = await TokenTransactions.query()
            .where('user_id', userId)
            .where('transactionType', 'credit')
            .where('status', 'success')
            .sum('amount as total')

        const debits = await TokenTransactions.query()
            .where('user_id', userId)
            .where('transactionType', 'debit')
            .where('status', 'success')
            .sum('amount as total')

        const totalCredits = Number(credits[0].$extras.total || 0)
        const totalDebits = Math.abs(Number(debits[0].$extras.total || 0))

        return totalCredits - totalDebits
    }

    static async getTokenBalanceChange(userId: string) {
        const now = DateTime.now()
        const monthAgo = now.minus({ months: 1 })

        const currentBalance = await TokenTransaction.query()
            .where('user_id', userId)
            .where('created_at', '>=', monthAgo.toSQL())
            .sum('amount as total')
            .first()

        const previousBalance = await TokenTransaction.query()
            .where('user_id', userId)
            .where('created_at', '<', monthAgo.toSQL())
            .where('created_at', '>=', monthAgo.minus({ months: 1 }).toSQL())
            .sum('amount as total')
            .first()

        const current = Number(currentBalance?.$extras.total || 0)
        const previous = Number(previousBalance?.$extras.total || 0)

        if (previous === 0) return 0
        return ((current - previous) / previous) * 100
    }

    static async deductTokens(userId: string, amount: number): Promise<void> {
        const user = await User.findOrFail(userId)

        // Create token history record
        await TokenTransactions.create({
            userId: user.id,
            amount: -amount, // negative amount for deduction
            transactionType: 'debit',
            status: 'success',
        })
    }

    static async getVerificationStats(
        userId: string,
        tokenBalance: number,
        tokenBalanceChange: number
    ) {
        const now = DateTime.now()
        const monthAgo = now.minus({ months: 1 })

        const currentMonthStats = await Verification.query()
            .where('user_id', userId)
            .where('created_at', '>=', monthAgo.toSQL())
            .count('* as total')
            .count('* as successful')
            .where('status', 'success')
            .count('* as failed')
            .where('status', 'failed')
            .first()

        const previousMonthStats = await Verification.query()
            .where('user_id', userId)
            .where('created_at', '<', monthAgo.toSQL())
            .where('created_at', '>=', monthAgo.minus({ months: 1 }).toSQL())
            .count('* as total')
            .count('* as successful')
            .where('status', 'success')
            .count('* as failed')
            .where('status', 'failed')
            .first()

        return {
            total_calls: Number(currentMonthStats?.$extras.total || 0),
            successful_calls: Number(currentMonthStats?.$extras.successful || 0),
            failed_calls: Number(currentMonthStats?.$extras.failed || 0),
            token_balance: tokenBalance,
            total_calls_change: this.calculateChange(
                Number(currentMonthStats?.$extras.total || 0),
                Number(previousMonthStats?.$extras.total || 0)
            ),
            successful_calls_change: this.calculateChange(
                Number(currentMonthStats?.$extras.successful || 0),
                Number(previousMonthStats?.$extras.successful || 0)
            ),
            failed_calls_change: this.calculateChange(
                Number(currentMonthStats?.$extras.failed || 0),
                Number(previousMonthStats?.$extras.failed || 0)
            ),
            token_balance_change: tokenBalanceChange,
        }
    }

    static async getVerificationChartData(userId: string) {
        const days = 7
        const labels = Array.from({ length: days }, (_, i) => {
            return DateTime.now().minus({ days: i }).toFormat('MMM dd')
        }).reverse()

        const data = await Promise.all(
            labels.map(async (label) => {
                const date = DateTime.fromFormat(label, 'MMM dd')
                const count = await Verification.query()
                    .where('user_id', userId)
                    .where('created_at', '>=', date.startOf('day').toSQL()!)
                    .where('created_at', '<=', date.endOf('day').toSQL()!)
                    .count('* as total')

                return Number(count[0].$extras.total || 0)
            })
        )

        return {
            labels,
            datasets: [
                {
                    label: 'Verifications',
                    data,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                },
            ],
        }
    }

    private static calculateChange(current: number, previous: number) {
        if (previous === 0) return 0
        return ((current - previous) / previous) * 100
    }

    static async getFilteredVerifications(
        userId: string,
        filters: {
            idNumber?: string
            idType?: string
            fromDate?: string
            toDate?: string
            page: number
            perPage: number
        }
    ) {
        const { idNumber, idType, fromDate, toDate, page, perPage } = filters

        const query = Verification.query().where('user_id', userId).orderBy('created_at', 'desc')

        if (idNumber) {
            query.where('id_number', 'like', `%${idNumber}%`)
        }
        if (idType) {
            query.where('id_type', idType)
        }

        const fromDateObj = DateTime.fromISO(fromDate || '').toSQL()
        const toDateObj = DateTime.fromISO(toDate || '').toSQL()

        if (fromDateObj) {
            query.where('created_at', '>=', fromDateObj)
        }
        if (toDateObj) {
            query.where('created_at', '<=', toDateObj)
        }

        return query.paginate(page, perPage)
    }
}
