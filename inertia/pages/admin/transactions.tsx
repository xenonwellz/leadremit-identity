import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Coins, Eye, Search } from 'lucide-react'
import AdminLayout from '@/layouts/admin.layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
    id: string
    fullName: string
    email: string
}

interface Transaction {
    id: string
    amount: number
    status: string
    paymentProvider: string
    transactionReference: string
    createdAt: string
    user: User
}

interface TransactionsProps {
    transactions: Transaction[]
}

export default function Transactions({ transactions }: TransactionsProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.paymentProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold">Transactions Management</h1>
                    <p className="text-gray-500">Manage all token transactions</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search transactions..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base">
                            All Transactions ({filteredTransactions.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <Coins className="h-4 w-4 mr-2 text-green-500" />
                                                    {transaction.amount}
                                                </div>
                                            </TableCell>
                                            <TableCell>{transaction.user.fullName}</TableCell>
                                            <TableCell>{transaction.paymentProvider}</TableCell>
                                            <TableCell>
                                                <span className="text-xs font-mono">
                                                    {transaction.transactionReference}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        transaction.status === 'completed'
                                                            ? 'success'
                                                            : transaction.status === 'pending'
                                                              ? 'warning'
                                                              : 'error'
                                                    }
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild size="sm" variant="ghost">
                                                    <Link href={`/users/${transaction.user.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View User
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
