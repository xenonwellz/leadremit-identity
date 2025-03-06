import AppLayout from '@/layouts/app.layout'
import { VerificationTable } from '@/components/verification-table'
import { useState } from 'react'
import { VerificationFilters } from '@/interfaces/verification'
import { PaginationData } from '@/interfaces/pagination'
import type Verification from '#models/verification'

interface Props {
    verifications: Verification[]
    pagination: PaginationData
}

export default function HistoryPage({ verifications, pagination }: Props) {
    const [filters, setFilters] = useState({
        idNumber: '',
        idType: '',
        fromDate: '',
        toDate: '',
    } as VerificationFilters)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header className="mb-6">
                    <h1 className="text-xl font-semibold">Verification History</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        View and search through all your past verifications
                    </p>
                </header>

                <div className="flex-1">
                    <VerificationTable
                        verifications={verifications}
                        filters={filters}
                        setFilters={setFilters}
                        isFilterOpen={isFilterOpen}
                        setIsFilterOpen={setIsFilterOpen}
                        pagination={pagination}
                    />
                </div>
            </div>
        </AppLayout>
    )
}
