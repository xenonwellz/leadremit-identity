import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class TokenTransaction extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare userId: string

    @column()
    declare amount: number

    @column()
    declare transactionReference: string

    @column()
    declare paymentProvider: string

    @column()
    declare transactionType: 'credit' | 'debit'

    @column()
    declare status: 'pending' | 'success' | 'failed'

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @beforeCreate()
    static generateId(tokenTransaction: TokenTransaction) {
        tokenTransaction.id = uuidv4()
    }

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}
