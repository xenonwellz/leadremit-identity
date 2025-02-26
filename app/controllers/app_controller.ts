import { appRoutes } from '#shared/routes'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppController {
    // Mock data
    private mockStats = {
        total_calls: 1250,
        successful_calls: 1100,
        failed_calls: 150,
        token_balance: 5000,
    }

    private mockVerificationHistory = [
        {
            id: 1,
            type: 'BVN',
            number: '12345678901',
            status: 'success',
            date: '2024-03-20',
            response: { name: 'John Doe', dob: '1990-01-01' },
        },
        // ... more entries
    ]

    private mockTokenHistory = [
        {
            id: 1,
            amount: 1000,
            tokens: 1000,
            status: 'completed',
            date: '2024-03-19',
            reference: 'TXN-123456',
        },
        // ... more entries
    ]

    async dashboard(ctx: HttpContext) {
        return ctx.inertia.render('dashboard', {
            stats: this.mockStats,
            recent_verifications: this.mockVerificationHistory.slice(0, 5),
        })
    }

    async verify(ctx: HttpContext) {
        return ctx.inertia.render('verify')
    }

    async verifyBvn({ request, response }: HttpContext) {
        const bvn = request.input('bvn')
        console.log(bvn)
        // Mock verification response
        return response.json({
            success: true,
            data: {
                name: 'John Doe',
                dob: '1990-01-01',
                phone: '08012345678',
            },
        })
    }

    async verifyNin({ request, response }: HttpContext) {
        const nin = request.input('nin')
        console.log(nin)
        // Mock verification response
        return response.json({
            success: true,
            data: {
                name: 'Jane Doe',
                dob: '1992-05-15',
                phone: '08087654321',
            },
        })
    }

    async tokens(ctx: HttpContext) {
        return ctx.inertia.render('tokens', {
            token_history: this.mockTokenHistory,
        })
    }

    async history(ctx: HttpContext) {
        return ctx.inertia.render('history', {
            verification_history: this.mockVerificationHistory,
        })
    }

    async settings(ctx: HttpContext) {
        return ctx.inertia.render('settings', {
            user: ctx.auth.user,
        })
    }

    async updateSettings({ request, response }: HttpContext) {
        const data = request.only(['name', 'phone', 'profile_photo'])
        console.log(data)
        // Update user logic here
        return response.json({ success: true })
    }

    async logout(ctx: HttpContext) {
        await ctx.auth.use('user').logout()
        return ctx.response.redirect().toPath(appRoutes.auth.login)
    }
}
