import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import Verification from '#models/verification'
import TokenTransaction from '#models/token_transaction'

@inject()
export default class AdminDashboardController {
    /**
     * Display the admin dashboard
     */
    async index({ inertia, auth }: HttpContext) {
        const admin = auth.use('admin').user!

        // Get counts for dashboard stats
        const usersCount = await User.query().count('* as total')
        const verificationsCount = await Verification.query().count('* as total')
        const transactionsCount = await TokenTransaction.query().count('* as total')

        return inertia.render('admin/dashboard', {
            title: 'Admin Dashboard',
            admin,
            stats: {
                users: usersCount[0].$extras.total,
                verifications: verificationsCount[0].$extras.total,
                transactions: transactionsCount[0].$extras.total,
            },
        })
    }

    /**
     * Display the users list
     */
    async users({ inertia }: HttpContext) {
        const users = await User.query().orderBy('created_at', 'desc')

        return inertia.render('admin/users/index', {
            title: 'Manage Users',
            users,
        })
    }
    /**
     * Display the verifications list
     */
    async verifications({ inertia, request }: HttpContext) {
        const page = request.input('page', 1)
        const perPage = 10

        const verifications = await Verification.query()
            .preload('user')
            .orderBy('created_at', 'desc')
            .paginate(page, perPage)

        return inertia.render('admin/verifications', {
            title: 'Manage Verifications',
            verifications: verifications.all(),
            pagination: {
                currentPage: verifications.currentPage,
                totalPages: Math.ceil(verifications.total / perPage),
                perPage,
                total: verifications.total,
            },
        })
    }

    /**
     * Display the transactions list
     */
    async transactions({ inertia, request }: HttpContext) {
        const page = request.input('page', 1)
        const perPage = 10

        const transactions = await TokenTransaction.query()
            .preload('user')
            .orderBy('created_at', 'desc')
            .paginate(page, perPage)

        return inertia.render('admin/transactions', {
            title: 'Manage Transactions',
            transactions: transactions.all(),
            pagination: {
                currentPage: transactions.currentPage,
                totalPages: Math.ceil(transactions.total / perPage),
                perPage,
                total: transactions.total,
            },
        })
    }
}
