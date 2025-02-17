import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Scan, Coins } from 'lucide-react'
import { VerificationTable } from '@/components/verification-table'
import AppLayout from '@/layouts/app.layout'

export default function Home() {
    // Data for the dashboard statistic cards.
    const verificationStats = [
        {
            cardVariant: 'default',
            title: 'Total Verification',
            count: 41,
            footerText: 'From Jan 21, 2024',
            Icon: Scan,
        },
        {
            cardVariant: 'primary',
            title: 'Successful Verification',
            count: 50,
            footerText: 'From Feb 1, 2024',
            Icon: Scan,
        },
        {
            cardVariant: 'destructive',
            title: 'Failed Verification',
            count: 5,
            footerText: 'From Mar 1, 2024',
            Icon: Scan,
        },
    ]

    // Mapping each card variant to its corresponding Tailwind CSS classes.
    const cardVariantStyles = {
        default: {
            cardBg: 'bg-card',
            iconBg: 'bg-muted',
            footerBg: 'bg-black/70',
            footerText: 'text-primary-foreground',
        },
        primary: {
            cardBg: 'bg-card',
            iconBg: 'bg-muted text-primary/70',
            footerBg: 'bg-primary/70',
            footerText: 'text-white',
        },
        destructive: {
            cardBg: 'bg-card',
            iconBg: 'bg-muted text-destructive',
            footerBg: 'bg-destructive',
            footerText: 'text-white',
        },
    }

    return (
        <AppLayout>
            {/* Dashboard Header */}
            <header className="space-y-2">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </header>

            {/* Render statistic cards */}
            <div className="grid grid-cols-4 gap-4">
                {verificationStats.map((stat, idx) => {
                    const cardStyles =
                        cardVariantStyles[stat.cardVariant as keyof typeof cardVariantStyles]
                    return (
                        <div
                            key={idx}
                            className={`${cardStyles.cardBg} rounded-xl flex flex-col gap-4 border justify-between overflow-hidden p-4`}
                        >
                            <div className="text-sm text-muted-foreground font-normal">
                                {stat.title}
                            </div>
                            <div className="text-3xl font-bold flex items-center gap-4">
                                <div className={`${cardStyles.iconBg} p-3 border rounded-md`}>
                                    <stat.Icon />
                                </div>
                                {stat.count}
                            </div>
                        </div>
                    )
                })}

                <div className="bg-primary text-background p-6 rounded-xl flex flex-col gap-4 relative">
                    <div className="text-sm text-muted font-normal">Token Balance</div>

                    <div className="text-3xl font-bold flex items-center gap-4">
                        <div className={`p-3 border rounded-md bg-white/20`}>
                            <Coins />
                        </div>
                        1000
                    </div>
                </div>
            </div>

            {/* Credit Balance */}

            {/* Verification History Table */}
            <Card className="flex-1 overflow-auto flex flex-col">
                <CardHeader className="sticky top-0 z-20 bg-background">
                    <CardTitle>Verification History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    <VerificationTable />
                </CardContent>
            </Card>

            {/* Settings Button */}
            <div>
                <Button>Settings</Button>
            </div>
        </AppLayout>
    )
}
