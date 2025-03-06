import { HttpContext } from '@adonisjs/core/http'
import VerificationSetting from '#models/verification_setting'

export default class VerificationSettingsController {
    /**
     * Display verification settings page
     */
    async index({ inertia }: HttpContext) {
        const settings = await VerificationSetting.all()

        return inertia.render('admin/verification-settings/index', {
            settings: settings,
        })
    }

    /**
     * Update a verification setting
     */
    async update({ params, request, response }: HttpContext) {
        const setting = await VerificationSetting.findOrFail(params.id)

        const data = request.only(['tokenCost', 'isEnabled'])
        await setting.merge(data).save()

        return response.redirect().back()
    }
}
