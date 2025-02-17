import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'token_transactions'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
            table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
            table.decimal('credits', 10, 4)
            table.string('transaction_type')
            table.string('transaction_reference').nullable()
            table.string('payment_provider').nullable()
            table.decimal('amount', 10, 4).nullable()
            table.string('status')
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
