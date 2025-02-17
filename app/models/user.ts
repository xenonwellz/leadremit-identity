import { DateTime } from 'luxon'
import { column, BaseModel, hasMany } from '@adonisjs/lucid/orm'
import Verification from '#models/verification'
import TokenTransaction from '#models/token_transaction'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @column()
    declare fullName: string

    @column()
    declare profilePhoto: string | null

    @column()
    declare tokenBalance: number

    @column()
    declare isSuspended: boolean

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @hasMany(() => Verification)
    declare verifications: HasMany<typeof Verification>

    @hasMany(() => TokenTransaction)
    declare tokenTransactions: HasMany<typeof TokenTransaction>

    static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
