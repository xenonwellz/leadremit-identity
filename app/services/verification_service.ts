import type { VerificationType } from '#interfaces/verification'
import verificationConfig from '#config/verification'
import Verification from '#models/verification'
import DashboardService from '#services/dashboard_service'
import CIVService from '#services/civ_service'

export default class VerificationService {
    static async verify(userId: string, type: VerificationType, idNumber: string) {
        const verificationTypeConfig = Object.values(verificationConfig.types).find(
            (config) => config.id === type.id
        )

        if (!verificationTypeConfig) {
            throw new Error('Unsupported verification type')
        }

        // Check token balance
        const tokenBalance = await DashboardService.getTokenBalance(userId)
        if (tokenBalance < verificationTypeConfig.cost) {
            throw new Error(
                `Insufficient tokens. Required: ${verificationTypeConfig.cost}, Balance: ${tokenBalance}`
            )
        }

        // Perform verification using CIV service
        let result
        try {
            result = await this.performVerification(type.id, idNumber)
        } catch (error: any) {
            result = {
                success: false,
                error: {
                    code: 'VERIFICATION_FAILED',
                    message: error.message || `${type.name} verification failed`,
                },
            }
        }

        // Create verification record and deduct tokens
        await Verification.create({
            userId,
            verificationType: type.id,
            status: result.success ? 'success' : 'error',
            responseData: result,
            creditsUsed: verificationTypeConfig.cost,
        })

        // Deduct tokens
        if (result.success) {
            await DashboardService.deductTokens(userId, verificationTypeConfig.cost)
        }

        return result
    }

    private static async performVerification(typeId: string, idNumber: string) {
        let response
        switch (typeId) {
            case 'nin-verification':
                response = await CIVService.verifyNIN(idNumber)
                break
            case 'vnin-verification':
                response = await CIVService.verifyVNIN(idNumber)
                break
            case 'phone-verification':
                response = await CIVService.verifyPhoneNumber(idNumber)
                break
            default:
                throw new Error('Unsupported verification type')
        }

        if (response.status !== '00') {
            return {
                success: false,
                error: {
                    code: response.status,
                    message: response.message,
                },
            }
        }

        return {
            success: true,
            data: this.normalizeResponse(typeId, response.data),
        }
    }

    private static normalizeResponse(typeId: string, data: any) {
        switch (typeId) {
            case 'nin-verification':
                return {
                    id: data.nin,
                    name: `${data.firstName} ${data.middleName} ${data.lastName}`.trim(),
                    phone: data.telephoneNo,
                    verified: true,
                    additionalData: {
                        gender: data.gender,
                        birthDate: data.birthDate,
                        photo: data.photograph,
                    },
                }
            case 'bvn-verification':
                return {
                    id: data.DocumentNo,
                    name: `${data.FirstName} ${data.MidleName} ${data.SurName}`.trim(),
                    phone: data.TelephoneNo,
                    verified: true,
                    additionalData: {
                        nin: data.Nin,
                        gender: data.Gender,
                        birthDate: data.BirthDate,
                        photo: data.Photo,
                    },
                }
            case 'vnin-verification':
                return {
                    id: data.DocumentNo,
                    name: `${data.FirstName} ${data.MidleName} ${data.SurName}`.trim(),
                    phone: data.TelephoneNo,
                    verified: true,
                    additionalData: {
                        nin: data.Nin,
                        gender: data.Gender,
                        birthDate: data.BirthDate,
                        photo: data.Photo,
                    },
                }
            case 'phone-verification':
                const firstRecord = Array.isArray(data) && data.length > 0 ? data[0] : data
                return {
                    id: firstRecord.phoneNumber,
                    name: `${firstRecord.firstName} ${firstRecord.middleName} ${firstRecord.lastName}`.trim(),
                    verified: true,
                    additionalData: {
                        birthDate: firstRecord.dateOfBirth,
                    },
                }
            default:
                return data
        }
    }

    static getVerificationType(type: string) {
        return Object.values(verificationConfig.types).find((t) => t.id === `${type}-verification`)
    }

    static getAvailableTypes() {
        return Object.values(verificationConfig.types)
    }

    static async getFilteredHistory(
        userId: string,
        filters: {
            idNumber?: string
            idType?: string
            fromDate?: string
            toDate?: string
            page: number
            perPage: number
        }
    ) {
        const { idNumber, idType, fromDate, toDate, page, perPage } = filters

        const query = Verification.query().where('user_id', userId).orderBy('created_at', 'desc')

        if (idNumber) {
            query.where('id_number', 'like', `%${idNumber}%`)
        }
        if (idType) {
            query.where('id_type', idType)
        }

        if (fromDate) {
            query.where('created_at', '>=', fromDate)
        }
        if (toDate) {
            query.where('created_at', '<=', toDate)
        }

        return query.paginate(page, perPage)
    }

    static handleVerificationError(error: any) {
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
}
