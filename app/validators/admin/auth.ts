import vine from '@vinejs/vine'

/**
 * Validator for login form
 */
export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(6),
    })
)

/**
 * Validator for admin creation/update
 */
export const adminValidator = vine.compile(
    vine.object({
        fullName: vine.string().minLength(3),
        email: vine.string().email(),
        password: vine.string().minLength(6).optional(),
        role: vine.string().optional(),
    })
)

/**
 * Validator for admin password update
 */
export const adminPasswordValidator = vine.compile(
    vine.object({
        currentPassword: vine.string().minLength(6),
        password: vine.string().minLength(6),
        passwordConfirmation: vine.string().minLength(6),
    })
)
