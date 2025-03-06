import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from './ui/button'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
import { VerificationFilters, VerificationTableProps } from '@/interfaces/verification'
import { useState } from 'react'
import Verification from '#models/verification'
interface FilterContentProps {
    setFilters: (filters: any) => void
    filters: VerificationFilters
}

interface VerificationTableHeaderProps {
    filters: VerificationFilters
    clearFilters: () => void
    isFilterOpen: boolean
    setIsFilterOpen: (isOpen: boolean) => void
}

interface VerificationDetailsProps {
    responseData: Record<string, any>
}

interface DetailRowProps {
    label: string
    value: string | number | boolean | null
}

interface VerificationRowProps {
    verification: Verification
    isExpanded: boolean
    onToggle: (id: string) => void
}

export const FilterContent = ({ setFilters, filters }: FilterContentProps) => (
    <div className="grid gap-4">
        <div>
            <Input
                id="idNumber"
                placeholder="Search by ID number"
                value={filters.idNumber}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        idNumber: e.target.value,
                    }))
                }
            />
        </div>

        <div>
            <Select
                value={filters.idType}
                onValueChange={(value) => setFilters((prev: any) => ({ ...prev, idType: value }))}
            >
                <SelectTrigger id="idType">
                    <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="driving">Driving License</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div>
            <Input
                id="fromDate"
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        fromDate: e.target.value,
                    }))
                }
            />
        </div>

        <div>
            <Input
                id="toDate"
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        toDate: e.target.value,
                    }))
                }
            />
        </div>
    </div>
)

// New components to extract
const VerificationTableHeader = ({
    filters,
    clearFilters,
    isFilterOpen,
    setIsFilterOpen,
}: VerificationTableHeaderProps) => (
    <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Verifications</h2>
        <div className="flex items-center gap-2">
            {(filters.idNumber || filters.idType || filters.fromDate || filters.toDate) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" /> Clear filters
                </Button>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden"
            >
                <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
        </div>
    </div>
)

const VerificationDetails = ({ responseData }: VerificationDetailsProps) => (
    <div className="mt-2 space-y-3 bg-muted/50 rounded-lg text-xs border p-3">
        {Object.entries(responseData).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div
                        key={key}
                        className="space-y-2 border-b border-border/50 last:border-0 pb-3 last:pb-0 p-2 border"
                    >
                        <div className="font-semibold text-primary capitalize">
                            {key.replace(/_/g, ' ')}
                        </div>
                        <div className="ml-4 grid gap-1.5 border p-2">
                            {Object.entries(value).map(([subKey, subValue]) => (
                                <DetailRow
                                    key={`${key}-${subKey}`}
                                    label={subKey}
                                    value={subValue as string | number | boolean | null}
                                />
                            ))}
                        </div>
                    </div>
                )
            }
            return (
                <div key={key} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
                    <DetailRow label={key} value={value} />
                </div>
            )
        })}
    </div>
)

const DetailRow = ({ label, value }: DetailRowProps) => (
    <div className="flex justify-between">
        <span className="text-muted-foreground capitalize">{label.replace(/_/g, ' ')}</span>
        <span className="font-medium">
            {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
        </span>
    </div>
)

const VerificationRow = ({ verification, isExpanded, onToggle }: VerificationRowProps) => (
    <TableRow>
        <TableCell>{verification.id}</TableCell>
        <TableCell className="capitalize">
            {verification.verificationType.split('-').join(' ').toUpperCase()}
        </TableCell>
        <TableCell>
            <Badge variant={verification.status === 'success' ? 'success' : 'error'}>
                {verification.status}
            </Badge>
        </TableCell>
        <TableCell>{format(new Date(verification.createdAt.toString()), 'MMM d, yyyy')}</TableCell>
        <TableCell>{format(new Date(verification.createdAt.toString()), 'h:mm a')}</TableCell>
        <TableCell className="w-[400px]">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(verification.id)}
                className="flex items-center gap-1"
            >
                View Details
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </Button>
            {isExpanded && <VerificationDetails responseData={verification.responseData} />}
        </TableCell>
    </TableRow>
)

export function VerificationTable({
    verifications,
    filters,
    setFilters,
    isFilterOpen,
    setIsFilterOpen,
    pagination,
}: VerificationTableProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    const handlePageChange = (page: number) => {
        router.visit(window.location.pathname, {
            data: { ...filters, page },
            preserveState: true,
            preserveScroll: true,
            only: ['verifications', 'verificationPagination'],
        })
    }

    const handleFilterSubmit = () => {
        router.visit(window.location.pathname, {
            data: {
                ...filters,
                page: 1,
            },
            preserveState: true,
            only: ['verifications', 'pagination'],
            preserveScroll: true,
        })
        setIsFilterOpen(false)
    }

    const clearFilters = () => {
        const emptyFilters = {
            idNumber: '',
            idType: '',
            fromDate: '',
            toDate: '',
        }
        setFilters(emptyFilters)
        router.visit(window.location.pathname, {
            data: {
                ...emptyFilters,
                page: 1,
            },
            preserveState: true,
            only: ['verifications', 'pagination'],
            preserveScroll: true,
        })
    }

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <div className="space-y-4">
            <VerificationTableHeader
                filters={filters}
                clearFilters={clearFilters}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
            />

            {isFilterOpen && <FilterContent setFilters={setFilters} filters={filters} />}

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Verification Date</TableHead>
                            <TableHead>Verification Time</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {verifications.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No verification records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            verifications.map((verification) => (
                                <VerificationRow
                                    key={verification.id}
                                    verification={verification}
                                    isExpanded={expandedRows[verification.id]}
                                    onToggle={toggleRow}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
