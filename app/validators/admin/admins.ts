import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
    required: 'The {{ field }} field is required',
}

const fields = {
    fullName: 'full name',
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields)
vine.convertEmptyStringsToNull = true

/**
 * Validator for creating a new admin
 */
export const createAdminValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        fullName: vine.string().minLength(3),
        password: vine.string().minLength(6),
        role: vine.string().optional(),
    })
)

/**
 * Validator for updating an admin
 */
export const updateAdminValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        fullName: vine.string().minLength(3),
        password: vine.string().minLength(6).optional(),
        role: vine.string().optional(),
    })
)
