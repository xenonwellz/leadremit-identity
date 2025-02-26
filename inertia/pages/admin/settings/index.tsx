import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin.layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminRoutes } from '#shared/routes'
import { toast } from 'sonner'

export default function Settings() {
    const [showSuccess, setShowSuccess] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm({
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(adminRoutes.app.settings, {
            onSuccess: () => {
                reset('currentPassword', 'password', 'passwordConfirmation')
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 5000)
                toast.success('Your password has been updated successfully')
            },
        })
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold">Settings</h1>
                    <p className="text-gray-500">Manage your account settings</p>
                </div>

                <Card className="bg-muted/30 shadow-none p-0">
                    <CardHeader className="p-6 border-b">
                        <CardTitle className="text-xl">Change Password</CardTitle>
                        <CardDescription>
                            Update your password to keep your account secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {showSuccess && (
                            <p className="text-sm text-green-500">
                                Your password has been updated successfully.
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={data.currentPassword}
                                    onChange={(e) => setData('currentPassword', e.target.value)}
                                />
                                {errors.currentPassword && (
                                    <p className="text-sm text-red-500">{errors.currentPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirmation">Confirm New Password</Label>
                                <Input
                                    id="passwordConfirmation"
                                    type="password"
                                    value={data.passwordConfirmation}
                                    onChange={(e) =>
                                        setData('passwordConfirmation', e.target.value)
                                    }
                                />
                                {errors.passwordConfirmation && (
                                    <p className="text-sm text-red-500">
                                        {errors.passwordConfirmation}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="px-12" disabled={processing}>
                                Update Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
}
