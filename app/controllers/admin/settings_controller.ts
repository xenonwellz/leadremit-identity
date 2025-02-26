import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import Admin from '#models/admin'
import { adminPasswordValidator } from '#validators/admin/auth'

@inject()
export default class AdminSettingsController {
    /**
     * Display the settings page
     */
    async index({ inertia, auth }: HttpContext) {
        const admin = auth.user!

        return inertia.render('admin/settings/index', {
            title: 'Settings',
            admin,
        })
    }

    /**
     * Update admin password
     */
    async updatePassword({ request, response, auth, session }: HttpContext) {
        const admin = await Admin.findOrFail(auth.user!.id)

        const payload = await request.validateUsing(adminPasswordValidator)

        // Verify current password
        const isValidPassword = await hash.verify(admin.password, payload.currentPassword)
        if (!isValidPassword) {
            session.flash('errors', { currentPassword: 'Current password is incorrect' })
            return response.redirect().back()
        }

        // Update password
        admin.password = payload.password
        await admin.save()

        session.flash('success', 'Password updated successfully')
        return response.redirect().back()
    }
}
