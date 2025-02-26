import { Link } from '@inertiajs/react'
import { ArrowLeft, Edit, Trash } from 'lucide-react'
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

interface Admin {
    id: number
    fullName: string
    email: string
    role: string
    createdAt: string
    updatedAt: string
}

interface ShowAdminProps {
    admin: Admin
    currentAdmin: Admin
}

export default function ShowAdmin({ admin, currentAdmin }: ShowAdminProps) {
    const canEdit = currentAdmin.role === 'super_admin' || admin.role !== 'super_admin'
    const canDelete =
        currentAdmin.id !== admin.id &&
        (currentAdmin.role === 'super_admin' || admin.role !== 'super_admin')

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button asChild variant="outline" className="mb-2">
                            <Link href={adminRoutes.app.admins}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Administrators
                            </Link>
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {canEdit && (
                            <Button asChild>
                                <Link href={`${adminRoutes.app.admins}/${admin.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                        )}

                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Administrator</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete {admin.fullName}? This
                                            action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <form
                                            action={`${adminRoutes.app.admins}/${admin.id}`}
                                            method="POST"
                                        >
                                            <input type="hidden" name="_method" value="DELETE" />
                                            <AlertDialogAction
                                                type="submit"
                                                className="bg-red-500 hover:bg-red-600"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-base">Administrator Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                                <p>{admin.fullName}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p>{admin.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                                <Badge variant={admin.role === 'super_admin' ? 'error' : 'default'}>
                                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                                <p>{formatDate(admin.createdAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
