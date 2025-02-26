import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { Eye, Search, Plus, Trash, Edit } from 'lucide-react'
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
import { toast } from 'sonner'
import { adminRoutes } from '#shared/routes'

interface Admin {
    id: number
    fullName: string
    email: string
    role: string
    createdAt: string
}

interface AdminsProps {
    admins: Admin[]
    currentAdmin: Admin
}

export default function Admins({ admins, currentAdmin }: AdminsProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredAdmins = admins.filter(
        (admin) =>
            admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = (admin: Admin) => {
        const form = document.createElement('form')
        form.action = `${adminRoutes.app.admins}/${admin.id}`
        form.method = 'POST'

        const methodInput = document.createElement('input')
        methodInput.type = 'hidden'
        methodInput.name = '_method'
        methodInput.value = 'DELETE'

        form.appendChild(methodInput)
        document.body.appendChild(form)

        toast.promise(
            new Promise((resolve) => {
                form.addEventListener('submit', () => resolve(true))
                form.submit()
            }),
            {
                loading: 'Deleting administrator...',
                success: `${admin.fullName} has been deleted successfully`,
                error: 'Failed to delete administrator',
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                },
                duration: 4000,
                richColors: true,
            }
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold">Administrators</h1>
                        <p className="text-gray-500">Manage all administrators in the system</p>
                    </div>
                    <Button asChild>
                        <Link href={`${adminRoutes.app.admins}/create`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Administrator
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search administrators..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base">
                            All Administrators ({filteredAdmins.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAdmins.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No administrators found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAdmins.map((admin) => (
                                        <TableRow key={admin.id}>
                                            <TableCell className="font-medium">
                                                {admin.fullName}
                                            </TableCell>
                                            <TableCell>{admin.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        admin.role === 'super_admin'
                                                            ? 'error'
                                                            : 'default'
                                                    }
                                                >
                                                    {admin.role === 'super_admin'
                                                        ? 'Super Admin'
                                                        : 'Admin'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(admin.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild size="sm" variant="ghost">
                                                        <Link
                                                            href={`${adminRoutes.app.admins}/${admin.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Link>
                                                    </Button>
                                                    <Button asChild size="sm" variant="ghost">
                                                        <Link
                                                            href={`${adminRoutes.app.admins}/${admin.id}/edit`}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>

                                                    {/* Don't show delete button for current admin or if regular admin trying to delete super admin */}
                                                    {admin.id !== currentAdmin.id &&
                                                        !(
                                                            admin.role === 'super_admin' &&
                                                            currentAdmin.role !== 'super_admin'
                                                        ) && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            `Are you sure you want to delete ${admin.fullName}? This action cannot be undone.`
                                                                        )
                                                                    ) {
                                                                        handleDelete(admin)
                                                                    }
                                                                }}
                                                            >
                                                                <Trash className="h-4 w-4 text-red-500" />
                                                                <span className="sr-only">
                                                                    Delete
                                                                </span>
                                                            </Button>
                                                        )}
                                                </div>
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
