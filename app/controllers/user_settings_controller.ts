import type { HttpContext } from '@adonisjs/core/http'

export default class UserSettingsController {
    async show({ inertia, auth }: HttpContext) {
        return inertia.render('settings', {
            user: auth.user,
        })
    }

    // async update({ request, response }: HttpContext) {
    async update({ response }: HttpContext) {
        // const data = request.only(['name', 'phone', 'profile_photo'])
        // Update user logic here
        return response.json({ success: true })
    }
}
