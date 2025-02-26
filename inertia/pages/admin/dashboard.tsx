import { Coins, ShieldCheck, Users } from 'lucide-react'
import AdminLayout from '@/layouts/admin.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VerificationTrendChart } from '@/components/admin/verification-trend-chart'

interface DashboardProps {
    admin: {
        fullName: string
        email: string
        role: string
    }
    stats: {
        users: number
        verifications: number
        transactions: number
    }
}

export default function Dashboard({ stats }: DashboardProps) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Verifications',
            value: stats.verifications,
            icon: ShieldCheck,
            color: 'bg-green-500',
        },
        {
            title: 'Transactions',
            value: stats.transactions,
            icon: Coins,
            color: 'bg-purple-500',
        },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <p className="text-gray-500">Overview of your application</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((card) => (
                        <Card key={card.title} className="bg-muted/30 shadow-none">
                            <CardHeader className="pb-6 mb-6 border-b">
                                <CardTitle className="text-base">{card.title}</CardTitle>
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

                <VerificationTrendChart />
            </div>
        </AdminLayout>
    )
}
