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
import { formatDate } from '@/lib/utils'
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableBody } from '@/components/ui/table'

interface TokenTransaction {
    id: number
    amount: number
    transactionReference: string
    paymentProvider: string
    status: string
    createdAt: string
}

interface Verification {
    id: number
    type: string
    status: string
    createdAt: string
}

interface User {
    id: number
    fullName: string
    email: string
    tokenBalance: number
    isSuspended: boolean
    createdAt: string
    tokenTransactions: TokenTransaction[]
    verifications: Verification[]
}

interface ShowUserProps {
    user: User
    title: string
}

export default function ShowUser({ user }: ShowUserProps) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button asChild variant="outline" className="mb-2">
                            <Link href={adminRoutes.app.users}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Users
                            </Link>
                        </Button>
                    </div>
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
                                        Are you sure you want to{' '}
                                        {user.isSuspended ? 'unsuspend' : 'suspend'} {user.fullName}
                                        ?
                                        {!user.isSuspended &&
                                            ' This will prevent them from using the platform.'}
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
                                            className={
                                                user.isSuspended
                                                    ? ''
                                                    : 'bg-red-500 hover:bg-red-600'
                                            }
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
                                        Enter the amount of tokens to add to {user.fullName}'s
                                        account.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <form
                                    action={`${adminRoutes.app.users}/${user.id}/add-tokens`}
                                    method="POST"
                                >
                                    <div className="mb-4">
                                        <label
                                            htmlFor="amount"
                                            className="block text-sm font-medium mb-1"
                                        >
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
                                        <AlertDialogAction type="submit">
                                            Add Tokens
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </form>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

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
                                <p>{user.tokenBalance}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <Badge variant={user.isSuspended ? 'error' : 'success'}>
                                    {user.isSuspended ? 'Suspended' : 'Active'}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                                <p>{formatDate(user.createdAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base">
                            User Verifications ({user.verifications.length})
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
                                {user.verifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No verifications found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    user.verifications.map((verification) => (
                                        <TableRow key={verification.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                                                    {verification.type.toUpperCase()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        verification.status === 'verified'
                                                            ? 'success'
                                                            : verification.status === 'pending'
                                                              ? 'warning'
                                                              : 'error'
                                                    }
                                                >
                                                    {verification.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    verification.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base">
                            User Transactions ({user.tokenTransactions.length})
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
                                {user.tokenTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    user.tokenTransactions.map((transaction) => (
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
