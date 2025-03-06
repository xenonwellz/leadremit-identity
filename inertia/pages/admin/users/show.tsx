import { Link } from '@inertiajs/react'
import { ArrowLeft, Ban, CreditCard, Eye, ShieldCheck, Coins } from 'lucide-react'
import AdminLayout from '@/layouts/admin.layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { adminRoutes } from '#shared/routes'
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableBody } from '@/components/ui/table'
import User from '#models/user'
import { VerificationStatusBadge } from '@/components/verification-status-badge'
import { PaginationData } from '@/interfaces/pagination'
import TokenTransaction from '#models/token_transaction'
import Verification from '#models/verification'
import { Pagination } from '@/components/ui/pagination'
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
interface ShowUserProps {
    user: User
    tokenBalance: number
    verificationPagination: PaginationData
    transactionPagination: PaginationData
    verifications: Verification[]
    tokenTransactions: TokenTransaction[]
}

// Extract components to make the main component more manageable
const UserDetailsCard = ({ user, tokenBalance }: { user: User; tokenBalance: number }) => (
    <Card className="bg-muted/30 shadow-none p-0">
        <CardHeader className="p-6 border-b">
            <CardTitle className="text-base">User Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p>{user.fullName}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{user.email}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Token Balance</h3>
                    <p>{tokenBalance}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <Badge variant={user.isSuspended ? 'error' : 'success'}>
                        {user.isSuspended ? 'Suspended' : 'Active'}
                    </Badge>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p>{format(new Date(user.createdAt.toString()), 'MMM d, yyyy HH:mm')}</p>
                </div>
            </div>
        </CardContent>
    </Card>
)

const VerificationsCard = ({
    user,
    verifications,
    verificationPagination,
    onPageChange,
}: {
    user: User
    verifications: Verification[]
    verificationPagination: PaginationData
    onPageChange: (page: number) => void
}) => (
    <Card className="bg-muted/30 shadow-none p-0">
        <CardHeader className="p-6 border-b">
            <CardTitle className="text-base">
                User Verifications ({verificationPagination.total})
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {verificationPagination.total === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No verifications found
                            </TableCell>
                        </TableRow>
                    ) : (
                        verifications.map((verification) => (
                            <TableRow key={verification.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                                        {verification.verificationType.toUpperCase()}
                                    </div>
                                </TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <VerificationStatusBadge status={verification.status} />
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(verification.createdAt.toString()),
                                        'MMM d, yyyy HH:mm'
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {verificationPagination.totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={verificationPagination.currentPage}
                        totalPages={verificationPagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </CardContent>
    </Card>
)

const TransactionsCard = ({
    user,
    tokenTransactions,
    transactionPagination,
    onPageChange,
}: {
    user: User
    tokenTransactions: TokenTransaction[]
    transactionPagination: PaginationData
    onPageChange: (page: number) => void
}) => (
    <Card className="bg-muted/30 shadow-none p-0">
        <CardHeader className="p-6 border-b">
            <CardTitle className="text-base">
                User Transactions ({transactionPagination.total})
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
                    {transactionPagination.total === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                No transactions found
                            </TableCell>
                        </TableRow>
                    ) : (
                        tokenTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <Coins className="h-4 w-4 mr-2 text-green-500" />
                                        {transaction.amount}
                                    </div>
                                </TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{transaction.paymentProvider}</TableCell>
                                <TableCell>
                                    <span className="text-xs font-mono">
                                        {transaction.transactionReference}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <VerificationStatusBadge status={transaction.status} />
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(transaction.createdAt.toString()),
                                        'MMM d, yyyy HH:mm'
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild size="sm" variant="ghost">
                                        <Link href={`/users/${user.id}`}>
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
            {transactionPagination.totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={transactionPagination.currentPage}
                        totalPages={transactionPagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </CardContent>
    </Card>
)

const ActionButtons = ({ user }: { user: User }) => (
    <div className="flex gap-2">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={user.isSuspended ? 'outline' : 'destructive'}>
                    <Ban className="h-4 w-4 mr-2" />
                    {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {user.isSuspended ? 'Unsuspend' : 'Suspend'} User
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to {user.isSuspended ? 'unsuspend' : 'suspend'}{' '}
                        {user.fullName}?
                        {!user.isSuspended && ' This will prevent them from using the platform.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form
                        action={`${adminRoutes.app.users}/${user.id}/toggle-suspension`}
                        method="POST"
                    >
                        <AlertDialogAction
                            type="submit"
                            className={user.isSuspended ? '' : 'bg-red-500 hover:bg-red-600'}
                        >
                            {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Tokens
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add Tokens</AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter the amount of tokens to add to {user.fullName}'s account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form action={`${adminRoutes.app.users}/${user.id}/add-tokens`} method="POST">
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            min="1"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Add Tokens</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    </div>
)

export default function ShowUser({
    user,
    tokenBalance,
    verificationPagination,
    transactionPagination,
    verifications,
    tokenTransactions,
}: ShowUserProps) {
    const handleVerificationPageChange = (page: number) => {
        router.visit(window.location.pathname, {
            data: { verification_page: page },
            preserveState: true,
            preserveScroll: true,
            only: ['verifications', 'verificationPagination'],
        })
    }

    const handleTransactionPageChange = (page: number) => {
        router.visit(window.location.pathname, {
            data: { transaction_page: page },
            preserveState: true,
            preserveScroll: true,
            only: ['tokenTransactions', 'transactionPagination'],
        })
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" className="mb-2">
                        <Link href={adminRoutes.app.users}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </Link>
                    </Button>
                    <ActionButtons user={user} />
                </div>

                <UserDetailsCard user={user} tokenBalance={tokenBalance} />

                <VerificationsCard
                    user={user}
                    verifications={verifications}
                    verificationPagination={verificationPagination}
                    onPageChange={handleVerificationPageChange}
                />

                <TransactionsCard
                    user={user}
                    tokenTransactions={tokenTransactions}
                    transactionPagination={transactionPagination}
                    onPageChange={handleTransactionPageChange}
                />
            </div>
        </AdminLayout>
    )
}
