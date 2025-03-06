import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'

export default class VerificationSetting extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare verificationType: string

    @column()
    declare codeName: string

    @column()
    declare isEnabled: boolean

    @column()
    declare tokenCost: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @beforeCreate()
    static generateId(verificationSetting: VerificationSetting) {
        verificationSetting.id = uuidv4()
    }
}
