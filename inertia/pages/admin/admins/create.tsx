import { useState } from 'react'
import { router } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin.layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { adminRoutes } from '#shared/routes'

export default function CreateAdmin() {
    const [values, setValues] = useState({
        email: '',
        fullName: '',
        password: '',
        role: 'admin',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const key = e.target.id
        const value = e.target.value
        setValues((values) => ({
            ...values,
            [key]: value,
        }))
    }

    function handleSelectChange(value: string) {
        setValues((values) => ({
            ...values,
            role: value,
        }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        router.post(adminRoutes.app.admins, values, {
            onError: (errors) => {
                setErrors(errors)
            },
        })
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold">Administrators Management</h1>
                    <p className="text-gray-500">Manage all administrators in the system</p>
                </div>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-xl">Create Administrator</CardTitle>
                        <CardDescription>
                            Enter the details for the new administrator
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={values.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                                {errors.fullName && (
                                    <p className="text-sm text-red-500">{errors.fullName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={values.role} onValueChange={handleSelectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-red-500">{errors.role}</p>
                                )}
                            </div>

                            <div className="">
                                <Button type="submit" className="px-12">
                                    Create Administrator
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
