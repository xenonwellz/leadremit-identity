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
import { useState } from 'react'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'

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

const ITEMS_PER_PAGE = 5

export default function TokensPage({ token_history }: Props) {
    const [currentPage, setCurrentPage] = useState(1)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = token_history.slice(startIndex, endIndex)
    const totalPages = Math.ceil(token_history.length / ITEMS_PER_PAGE)

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Tokens</h1>
                    <Button>Purchase Tokens</Button>
                </header>

                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-muted/30 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base">Available Balance</CardTitle>
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

                <div className="flex flex-col flex-1 bg-muted/30 rounded-lg border">
                    {token_history.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center p-6">
                            <p>No purchase history available.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-base font-medium mb-4 p-4 py-6 border-b">
                                Purchase History
                            </h2>
                            <div className="overflow-auto flex-1 p-4">
                                <Table className="border-separate border-spacing-y-3 w-full min-w-[800px]">
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
                                        {currentItems.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-muted/50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-muted/60"
                                            >
                                                <TableCell>{startIndex + index + 1}</TableCell>
                                                <TableCell>{item.reference}</TableCell>
                                                <TableCell>₦{item.amount}</TableCell>
                                                <TableCell>{item.tokens}</TableCell>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            item.status === 'completed'
                                                                ? 'success'
                                                                : 'warning'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="p-4 py-6 border-t mt-auto">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
