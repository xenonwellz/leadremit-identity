import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VerificationTable } from '@/components/verification-table'
import { Button } from '@/components/ui/button'
import { Plus, Coins, UserCheck, Clock } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { LineChart } from '@/components/ui/charts'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

interface Stats {
    total_calls: number
    successful_calls: number
    failed_calls: number
    token_balance: number
    total_calls_change: number
    successful_calls_change: number
    failed_calls_change: number
    token_balance_change: number
}

interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        borderColor: string
        backgroundColor: string
        tension: number
    }[]
}

interface Pagination {
    currentPage: number
    totalPages: number
    perPage: number
    total: number
}

interface Filters {
    idNumber: string
    idType: string
    fromDate: string
    toDate: string
}

interface Props {
    stats: Stats
    verifications: any[]
    tokenHistory: any[]
    chartData: ChartData
    verificationPagination: Pagination
    tokenPagination: Pagination
    user: {
        name: string
    }
}

export default function DashboardPage({
    stats,
    verifications,
    chartData,
    verificationPagination,
    user,
}: Props) {
    const [filters, setFilters] = useState<Partial<Filters>>({
        idNumber: '',
        idType: '',
        fromDate: '',
        toDate: '',
    })
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const handleBuyTokens = () => {
        router.visit('/tokens', { only: ['tokenHistory'] })
    }

    const statCards = [
        {
            title: 'Total Calls',
            value: stats.total_calls,
            change: stats.total_calls_change,
            icon: UserCheck,
            color: 'bg-green-500',
            action: null,
        },
        {
            title: 'Successful Calls',
            value: stats.successful_calls,
            change: stats.successful_calls_change,
            icon: Clock,
            color: 'bg-purple-500',
            action: null,
        },
        {
            title: 'Failed Calls',
            value: stats.failed_calls,
            change: stats.failed_calls_change,
            icon: Clock,
            color: 'bg-red-500',
            action: null,
        },
        {
            title: 'Token Balance',
            value: stats.token_balance,
            change: stats.token_balance_change,
            icon: Coins,
            color: 'bg-blue-500',
            action: (
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-8 w-8 p-0 ml-2"
                    onClick={handleBuyTokens}
                    title="Top up balance"
                >
                    <Plus className="h-4 w-4 text-primary" />
                </Button>
            ),
        },
    ]

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <Card className="bg-muted/30 shadow-none pt-6">
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm text-muted-foreground">
                                Welcome in, {user.name}
                            </h2>
                            <h1 className="text-3xl sm:text-5xl font-semibold">Your Dashboard</h1>
                        </div>
                        <Button
                            className="rounded-full text-xs h-auto py-2 mt-4 sm:mt-0"
                            size="sm"
                            onClick={() => router.visit('/verify')}
                        >
                            Verify identity
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Stats section - 2 columns on the left */}
                    <div className="col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                            {statCards.map((card) => (
                                <Card key={card.title} className="bg-muted/30 shadow-none">
                                    <CardHeader className="pb-6 mb-6 border-b">
                                        <CardTitle className="text-base flex items-center justify-between">
                                            {card.title}
                                            {card.action}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <div className="space-y-4 w-full">
                                            <div className="text-2xl font-bold flex items-center justify-between gap-2">
                                                {card.value}
                                                <div className={`p-3 rounded-full ${card.color}`}>
                                                    <card.icon className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                            {card.change !== null && (
                                                <div className="flex items-center gap-1.5">
                                                    <Badge
                                                        variant={
                                                            card.change >= 0 ? 'success' : 'error'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {Math.abs(card.change)}%
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {card.change >= 0 ? 'higher' : 'lower'} than
                                                        last month
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* API Usage chart */}
                    <div className="lg:col-span-2">
                        <Card className="bg-muted/30 shadow-none h-full">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Verifications (Last 7 days)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                <LineChart data={chartData} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex-1">
                    <>
                        {/* Desktop Filter */}
                        <div className="hidden lg:grid grid-cols-5 gap-4 mb-4">
                            <div className="col-span-1">
                                <Input
                                    id="idNumber"
                                    placeholder="Search by ID number"
                                    value={filters.idNumber}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            idNumber: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-span-1">
                                <Select
                                    value={filters.idType}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({ ...prev, idType: value }))
                                    }
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

                            <div className="col-span-1">
                                <Input
                                    id="fromDate"
                                    type="date"
                                    value={filters.fromDate}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            fromDate: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-span-1">
                                <Input
                                    id="toDate"
                                    type="date"
                                    value={filters.toDate}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            toDate: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-span-1">
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        router.visit(window.location.pathname, {
                                            data: {
                                                ...filters,
                                                page: 1,
                                            },
                                            preserveState: true,
                                            only: ['verifications', 'verificationPagination'],
                                            preserveScroll: true,
                                        })
                                    }}
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>

                        <VerificationTable
                            verifications={verifications}
                            filters={filters}
                            setFilters={setFilters}
                            isFilterOpen={isFilterOpen}
                            setIsFilterOpen={setIsFilterOpen}
                            pagination={verificationPagination}
                        />
                    </>
                </div>
            </div>
        </AppLayout>
    )
}
