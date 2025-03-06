import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class Verification extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare userId: string

    @column()
    declare verificationType: string

    @column()
    declare responseData: any

    @column()
    declare status: string

    @column()
    declare creditsUsed: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @beforeCreate()
    static generateId(verification: Verification) {
        verification.id = uuidv4()
    }
}
