import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VerificationTable } from '@/components/verification-table'
import { LineChart } from '@/components/ui/charts'
import { Button } from '@/components/ui/button'
import { Plus, Coins, UserCheck, Clock } from 'lucide-react'
import { router } from '@inertiajs/react'

interface Stats {
    total_calls: number
    successful_calls: number
    failed_calls: number
    token_balance: number
}

interface Props {
    stats: Stats
    recent_verifications: any[]
}

export default function DashboardPage({ stats }: Props) {
    const handleBuyTokens = () => {
        router.visit('/tokens', { only: ['token_history'] })
    }

    const statCards = [
        {
            title: 'Token Balance',
            value: stats.token_balance,
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
        {
            title: 'Verifications',
            value: stats.total_calls,
            icon: UserCheck,
            color: 'bg-green-500',
            action: null,
        },
        {
            title: 'Transactions',
            value: stats.successful_calls,
            icon: Clock,
            color: 'bg-purple-500',
            action: null,
        },
    ]

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Stats section - 2 columns on the left */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {statCards.map((card) => (
                                <Card key={card.title} className="bg-muted/30 shadow-none">
                                    <CardHeader className="pb-6 mb-6 border-b">
                                        <CardTitle className="text-base flex items-center justify-between">
                                            {card.title}
                                            {card.action}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold">{card.value}</h3>
                                        <div className={`p-3 rounded-full ${card.color}`}>
                                            <card.icon className="h-4 w-4 text-white" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* API Usage chart on the right */}
                    <div className="lg:col-span-1">
                        <Card className="bg-muted/30 shadow-none h-full">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Verifications (Last 7 days)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                <LineChart />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex-1">
                    <VerificationTable />
                </div>
            </div>
        </AppLayout>
    )
}
