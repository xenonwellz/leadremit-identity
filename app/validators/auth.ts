import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { InferInput } from '@vinejs/vine/types'

const messages = {
    required: 'The {{ field }} field is required',
}

const fields = {
    password_confirmation: 'password confirmation',
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields)
vine.convertEmptyStringsToNull = true

export const LoginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string(),
    })
)

export const RegisterValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        username: vine.string().minLength(5),
        password: vine.string().minLength(8).confirmed(),
        full_name: vine.string().minLength(3),
    })
)

export const ForgotPasswordValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
    })
)

export const ResetPasswordValidator = vine.compile(
    vine.object({
        password: vine.string().minLength(8).confirmed(),
        token: vine.string().minLength(64),
    })
)

export interface LoginInputInterface extends InferInput<typeof LoginValidator> {}
export interface RegisterInputInterface extends InferInput<typeof RegisterValidator> {
    password_confirmation: string
}
export interface ForgotPasswordInputInterface extends InferInput<typeof ForgotPasswordValidator> {}
export interface ResetPasswordInputInterface extends InferInput<typeof ResetPasswordValidator> {}
