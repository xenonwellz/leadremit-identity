import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'verifications'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
            table.string('verification_type')
            table.decimal('credits_used', 10, 4)
            table.json('response_data')
            table.string('status')
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
