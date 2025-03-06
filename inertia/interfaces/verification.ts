import { PaginationData } from '#interfaces/pagination'
import Verification from '#models/verification'

export interface VerificationType {
    id: string
    name: string
    description: string
    cost: number
}

export interface VerificationFilters {
    idNumber?: string
    idType?: string
    fromDate?: string
    toDate?: string
}

export interface VerificationTableProps {
    verifications: Verification[]
    filters: VerificationFilters
    setFilters: React.Dispatch<React.SetStateAction<Partial<VerificationFilters>>>
    isFilterOpen: boolean
    setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
    pagination: PaginationData
}
