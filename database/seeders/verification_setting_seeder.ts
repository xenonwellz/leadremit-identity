import { BaseSeeder } from '@adonisjs/lucid/seeders'
import VerificationSetting from '#models/verification_setting'
import verificationConfig from '#config/verification'

export default class extends BaseSeeder {
    async run() {
        // Delete existing records
        await VerificationSetting.query().delete()

        // Create settings for each verification type
        const settings = Object.values(verificationConfig.types).map((type) => ({
            verificationType: type.id,
            codeName: type.name,
            tokenCost: type.cost,
            isEnabled: true,
        }))

        await VerificationSetting.createMany(settings)
    }
}
