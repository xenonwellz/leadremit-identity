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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { router } from '@inertiajs/react'
import type TokenTransaction from '#models/token_transaction'
import { format } from 'date-fns'

interface Props {
    token_history: TokenTransaction[]
    token_balance: number
}

const ITEMS_PER_PAGE = 10

const STATUS_BADGE_VARIANTS = {
    success: 'success',
    pending: 'warning',
    failed: 'error',
    default: 'default',
} as const

// Separate components for better organization
const BalanceCard = ({ balance }: { balance: number }) => (
    <Card className="bg-muted/30 shadow-none">
        <CardHeader>
            <CardTitle className="text-base">Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                    <Coins className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold">{balance} Tokens</span>
            </div>
        </CardContent>
    </Card>
)

const PurchaseDialog = ({
    isOpen,
    onOpenChange,
    amount,
    setAmount,
    isLoading,
}: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    amount: string
    setAmount: (value: string) => void
    isLoading: boolean
}) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Purchase Tokens</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                        Amount (NGN)
                    </label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>
                <Button
                    onClick={() => {
                        router.post('/tokens/purchase', { amount: Number(amount) })
                    }}
                    disabled={!amount || isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
)

const TransactionTable = ({
    transactions,
    currentPage,
    startIndex,
}: {
    transactions: TokenTransaction[]
    currentPage: number
    startIndex: number
}) => (
    <Table className="border-separate border-spacing-y-3 w-full min-w-[800px] mt-4">
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
            {transactions.map((item, index) => (
                <TableRow
                    key={item.id}
                    className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-muted/50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-muted/60"
                >
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{item.transactionReference || '---'}</TableCell>
                    <TableCell>
                        <Badge variant={item.amount < 0 ? 'error' : 'default'}>
                            {item.amount < 0 ? '-₦' : '₦'}
                            {Math.abs(item.amount).toFixed(2)}
                        </Badge>
                    </TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{format(new Date(item.createdAt.toString()), 'h:mm a')}</TableCell>
                    <TableCell>
                        {format(new Date(item.createdAt.toString()), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                        <Badge
                            variant={
                                STATUS_BADGE_VARIANTS[
                                    item.status as keyof typeof STATUS_BADGE_VARIANTS
                                ] || STATUS_BADGE_VARIANTS.default
                            }
                        >
                            {item.status || 'unknown'}
                        </Badge>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export default function TokensPage({ token_history, token_balance }: Props) {
    const [currentPage, setCurrentPage] = useState(1)
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = token_history.slice(startIndex, endIndex)
    const totalPages = Math.ceil(token_history.length / ITEMS_PER_PAGE)

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Tokens</h1>
                    <Button onClick={() => setIsPurchaseOpen(true)}>Purchase Tokens</Button>
                </header>

                <div className="grid md:grid-cols-2 gap-4">
                    <BalanceCard balance={token_balance} />
                </div>

                <div className="flex flex-col flex-1 bg-muted/30 rounded-lg border">
                    <h2 className="text-base font-medium p-4 py-6 border-b">Purchase History</h2>
                    <div className="overflow-auto flex-1 p-4">
                        {token_history.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center w-full p-4 text-sm">
                                <p className="text-muted-foreground">
                                    No purchase history available.
                                </p>
                            </div>
                        ) : (
                            <TransactionTable
                                transactions={currentItems}
                                currentPage={currentPage}
                                startIndex={startIndex}
                            />
                        )}
                    </div>
                    {token_history.length > 0 && (
                        <div className="p-4 py-6 border-t mt-auto">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>

                <PurchaseDialog
                    isOpen={isPurchaseOpen}
                    onOpenChange={setIsPurchaseOpen}
                    amount={amount}
                    setAmount={setAmount}
                    isLoading={isLoading}
                />
            </div>
        </AppLayout>
    )
}
