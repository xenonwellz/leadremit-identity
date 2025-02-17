import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Coins } from 'lucide-react'

interface TokenHistory {
    id: number
    amount: number
    tokens: number
    status: string
    date: string
    time: string
    reference: string
}

interface Props {
    token_history: TokenHistory[]
}

export default function TokensPage({ token_history }: Props) {
    return (
        <AppLayout>
            <div className="space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Tokens</h1>
                    <Button>Purchase Tokens</Button>
                </header>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg">
                                    <Coins className="h-6 w-6" />
                                </div>
                                <span className="text-2xl font-bold">5,000 Tokens</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col h-full">
                            {token_history.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center p-6">
                                    <p>No purchase history available.</p>
                                </div>
                            ) : (
                                <Table className="border-separate border-spacing-y-3 flex-1">
                                    <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>S/N</TableHead>
                                            <TableHead>REFERENCE</TableHead>
                                            <TableHead>AMOUNT</TableHead>
                                            <TableHead>TOKENS</TableHead>
                                            <TableHead>TIME</TableHead>
                                            <TableHead>DATE</TableHead>
                                            <TableHead>STATUS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {token_history.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-gray-50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-gray-100"
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.reference}</TableCell>
                                                <TableCell>₦{item.amount}</TableCell>
                                                <TableCell>{item.tokens}</TableCell>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`capitalize ${
                                                            item.status === 'completed'
                                                                ? 'text-green-600'
                                                                : 'text-yellow-600'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
