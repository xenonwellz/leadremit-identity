import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VerificationSetting extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare verification_type: string

    @column()
    declare code_name: string

    @column()
    declare is_enabled: boolean

    @column()
    declare token_cost: number

    @column.dateTime({ autoCreate: true })
    declare created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updated_at: DateTime
}
