import { BaseSeeder } from '@adonisjs/lucid/seeders'
import VerificationSetting from '#models/verification_setting'
import verificationConfig from '#config/verification'

export default class extends BaseSeeder {
    async run() {
        // Delete existing records
        await VerificationSetting.query().delete()

        // Create settings for each verification type
        const settings = Object.values(verificationConfig.types).map((type) => ({
            verification_type: type.id,
            code_name: type.name,
            token_cost: type.cost,
            is_enabled: true,
        }))

        await VerificationSetting.createMany(settings)
    }
}
