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
    pagination: {
        currentPage: number
        totalPages: number
        perPage: number
        total: number
    }
}

const STATUS_BADGE_VARIANTS = {
    success: 'success',
    pending: 'warning',
    failed: 'error',
    default: 'default',
} as const

const MIN_PURCHASE_AMOUNT = 500

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
                        min={MIN_PURCHASE_AMOUNT}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Enter amount (minimum ₦${MIN_PURCHASE_AMOUNT})`}
                    />
                    <p className="text-sm text-muted-foreground">
                        1 Token = ₦1. Minimum purchase is ₦{MIN_PURCHASE_AMOUNT}.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        router.post('/tokens/purchase', { amount: Number(amount) })
                    }}
                    disabled={!amount || Number(amount) < MIN_PURCHASE_AMOUNT || isLoading}
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
    pagination,
}: {
    transactions: TokenTransaction[]
    pagination: Props['pagination']
}) => {
    const handlePageChange = (page: number) => {
        router.visit(window.location.pathname, {
            data: { page },
            preserveState: true,
            preserveScroll: true,
            only: ['token_history', 'pagination'],
        })
    }

    return (
        <>
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
                            <TableCell>
                                {(pagination.currentPage - 1) * pagination.perPage + index + 1}
                            </TableCell>
                            <TableCell>{item.transactionReference || '---'}</TableCell>
                            <TableCell>
                                <Badge variant={item.amount < 0 ? 'error' : 'default'}>
                                    {item.amount < 0 ? '-₦' : '₦'}
                                    {Math.abs(item.amount).toFixed(2)}
                                </Badge>
                            </TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                                {format(new Date(item.createdAt.toString()), 'h:mm a')}
                            </TableCell>
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

            {pagination.totalPages > 1 && (
                <div className="p-4 py-6 border-t mt-auto">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    )
}

export default function TokensPage({ token_history, token_balance, pagination }: Props) {
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)
    const [amount, setAmount] = useState('')
    const [isLoading, _setIsLoading] = useState(false)

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold">Tokens</h1>
                        <p className="text-sm text-muted-foreground">
                            Purchase tokens to verify identities
                        </p>
                    </div>
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
                                transactions={token_history}
                                pagination={pagination}
                            />
                        )}
                    </div>
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
