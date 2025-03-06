import type { HttpContext } from '@adonisjs/core/http'
import VerificationService from '#services/verification_service'

export default class VerificationsController {
    /**
     * Show verification form with available verification types
     */
    async show({ inertia }: HttpContext) {
        const types = VerificationService.getAvailableTypes()
        return inertia.render('verify', { types })
    }

    /**
     * Show verification history with filters
     */
    async history({ inertia, auth, request }: HttpContext) {
        const user = auth.user!
        const page = request.input('page', 1)
        const perPage = 10

        const verifications = await VerificationService.getFilteredHistory(user.id, {
            idNumber: request.input('idNumber'),
            idType: request.input('idType'),
            fromDate: request.input('fromDate'),
            toDate: request.input('toDate'),
            page,
            perPage,
        })

        return inertia.render('history', {
            verifications: verifications.all(),
            pagination: {
                currentPage: verifications.currentPage,
                totalPages: Math.ceil(verifications.total / perPage),
                perPage,
                total: verifications.total,
            },
        })
    }

    /**
     * Handle verification request
     */
    async verify({ request, auth, inertia }: HttpContext) {
        const type = request.input('type')
        const idNumber = request.input('idNumber')
        const user = auth.user!

        try {
            // Find verification type config
            const verificationType = VerificationService.getVerificationType(type)

            if (!verificationType) {
                return this.renderWithError(inertia, {
                    code: 'INVALID_TYPE',
                    message: 'Invalid verification type',
                })
            }

            const result = await VerificationService.verify(user.id, verificationType, idNumber)

            return inertia.render('verify', {
                types: VerificationService.getAvailableTypes(),
                response: result,
            })
        } catch (error) {
            console.error(`Verification error (${type}):`, error)

            const errorResponse = VerificationService.handleVerificationError(error)
            return this.renderWithError(inertia, errorResponse.error)
        }
    }

    private renderWithError(inertia: any, error: any) {
        return inertia.render('verify', {
            types: VerificationService.getAvailableTypes(),
            response: {
                success: false,
                error,
            },
        })
    }
}
