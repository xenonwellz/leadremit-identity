import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'users'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
            table.string('full_name').nullable()
            table.string('email', 254).notNullable().unique()
            table.string('username', 254).notNullable().unique()
            table.string('password').notNullable()
            table.string('email_verified_at').nullable()

            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').nullable()
        })

        this.schema.createTable('email_verifications', (table) => {
            table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
            table.string('email', 254).notNullable()
            table.string('type', 25).notNullable()
            table.string('token').notNullable()
            table.timestamp('created_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable('email_verifications')
        this.schema.dropTable(this.tableName)
    }
}
