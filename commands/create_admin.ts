import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import Admin from '#models/admin'
import vine from '@vinejs/vine'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class CreateAdmin extends BaseCommand {
    static commandName = 'create:admin'
    static description = 'Create a new admin user'

    static options: CommandOptions = {
        startApp: true,
        staysAlive: false,
    }

    @args.string({ description: 'Email address for the admin' })
    declare email: string

    @args.string({ description: 'Full name of the admin' })
    declare fullName: string

    @args.string({ description: 'Password for the admin' })
    declare password: string

    @flags.string({ description: 'Role for the admin (default: admin)', alias: 'r' })
    declare role: string

    async run() {
        this.logger.info('Creating a new admin user')

        try {
            // Validate input
            const schema = vine.object({
                email: vine.string().email(),
                fullName: vine.string().minLength(3),
                password: vine.string().minLength(6),
                role: vine.string().optional(),
            })

            const validator = vine.compile(schema)
            await validator.validate({
                email: this.email,
                fullName: this.fullName,
                password: this.password,
                role: this.role || 'admin',
            })

            // Check if admin already exists
            const existingAdmin = await Admin.findBy('email', this.email)
            if (existingAdmin) {
                this.logger.error(`Admin with email ${this.email} already exists`)
                return
            }

            console.log(this.email, this.fullName, this.password, this.role)

            // Create admin
            const admin = await Admin.create({
                email: this.email,
                fullName: this.fullName,
                password: this.password,
                role: this.role || 'admin',
            })

            this.logger.success(`Admin created successfully with ID: ${admin.id}`)
            this.logger.info(`Email: ${admin.email}`)
            this.logger.info(`Role: ${admin.role}`)
        } catch (error) {
            this.logger.error('Failed to create admin user')
            this.logger.error(error)
            console.log(error)
        }
    }
}
