import { DateTime } from 'luxon'
import { column, BaseModel } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import { compose } from '@adonisjs/core/helpers'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class Admin extends compose(BaseModel, AuthFinder) {
    static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    declare id: string

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @column()
    declare fullName: string

    @column()
    declare profilePhoto: string | null

    @column()
    declare role: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    static rememberMeTokens = DbRememberMeTokensProvider.forModel(Admin)
}
