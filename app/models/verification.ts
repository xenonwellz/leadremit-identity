import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Verification extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number

    @column()
    declare verificationType: string

    @column()
    declare verificationNumber: string

    @column()
    declare responseData: any

    @column()
    declare status: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}
