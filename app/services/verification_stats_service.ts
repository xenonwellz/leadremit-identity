import { DateTime } from 'luxon'
import Verification from '#models/verification'
import db from '@adonisjs/lucid/services/db'

export default class VerificationStatsService {
    static async getStats(userId: string, tokenBalance: number, tokenBalanceChange: number) {
        const now = DateTime.now()
        const monthAgo = now.minus({ months: 1 })

        const currentMonthStats = await Verification.query()
            .select(
                db.raw('COUNT(*) as total'),
                db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as successful', ['success']),
                db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as failed', ['failed'])
            )
            .where('user_id', userId)
            .where('created_at', '>=', monthAgo.toSQL())
            .first()

        const previousMonthStats = await Verification.query()
            .select(
                db.raw('COUNT(*) as total'),
                db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as successful', ['success']),
                db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as failed', ['failed'])
            )
            .where('user_id', userId)
            .where('created_at', '<', monthAgo.toSQL())
            .where('created_at', '>=', monthAgo.minus({ months: 1 }).toSQL())
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

    static async getChartData(userId: string) {
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
}
