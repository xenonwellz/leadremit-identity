import type { HttpContext } from '@adonisjs/core/http'
import VerificationService from '#services/verification_service'
import verificationConfig from '#config/verification'

export default class VerificationController {
    async verify({ request, auth, inertia }: HttpContext) {
        const type = request.input('type')
        const idNumber = request.input('idNumber')
        const user = auth.user!

        try {
            // Find verification type config
            const verificationType = this.getVerificationType(type)

            if (!verificationType) {
                return this.renderWithError(inertia, {
                    code: 'INVALID_TYPE',
                    message: 'Invalid verification type',
                })
            }

            const result = await VerificationService.verify(user.id, verificationType, idNumber)

            return inertia.render('verify', {
                types: Object.values(verificationConfig.types),
                response: result,
            })
        } catch (error) {
            console.error(`Verification error (${type}):`, error)

            const errorResponse = this.handleVerificationError(error)
            return this.renderWithError(inertia, errorResponse.error)
        }
    }

    async getTypes({ inertia }: HttpContext) {
        return inertia.render('verify', {
            types: Object.values(verificationConfig.types),
        })
    }

    private getVerificationType(type: string) {
        return Object.values(verificationConfig.types).find((t) => t.id === `${type}-verification`)
    }

    private handleVerificationError(error: any) {
        if (error.message.includes('Insufficient tokens')) {
            return {
                success: false,
                error: {
                    code: 'INSUFFICIENT_TOKENS',
                    message: error.message,
                },
            }
        }

        return {
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred during verification',
            },
        }
    }

    private renderWithError(inertia: any, error: any) {
        return inertia.render('verify', {
            types: Object.values(verificationConfig.types),
            response: {
                success: false,
                error,
            },
        })
    }
}
