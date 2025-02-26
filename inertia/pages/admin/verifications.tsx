import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Eye, Search, ShieldCheck } from 'lucide-react'
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
import { adminRoutes } from '#shared/routes'

interface User {
    id: string
    fullName: string
    email: string
}

interface Verification {
    id: string
    type: string
    status: string
    createdAt: string
    user: User
}

interface VerificationsProps {
    verifications: Verification[]
}

export default function Verifications({ verifications }: VerificationsProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredVerifications = verifications.filter(
        (verification) =>
            verification.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            verification.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            verification.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold">Verifications Management</h1>
                    <p className="text-gray-500">Manage all verification requests</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search verifications..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base">
                            All Verifications ({filteredVerifications.length})
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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVerifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No verifications found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVerifications.map((verification) => (
                                        <TableRow key={verification.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                                                    {verification.type.toUpperCase()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{verification.user.fullName}</TableCell>
                                            <TableCell>{verification.user.email}</TableCell>
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
                                            <TableCell className="text-right">
                                                <Button asChild size="sm" variant="ghost">
                                                    <Link
                                                        href={`${adminRoutes.app.users}/${verification.user.id}`}
                                                    >
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
