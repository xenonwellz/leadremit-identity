import { appRoutes } from '#shared/routes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, router, usePage } from '@inertiajs/react'

export default function RegisterPage() {
    const pageProps = usePage().props

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        router.post(appRoutes.auth.register, formData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="w-full max-w-xl">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Register</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            {[
                                { id: 'full_name', label: 'Name', type: 'text' },
                                { id: 'username', label: 'Username', type: 'text' },
                                { id: 'email', label: 'Email address', type: 'email' },
                                { id: 'password', label: 'Password', type: 'password' },
                                {
                                    id: 'password_confirmation',
                                    label: 'Confirm Password',
                                    type: 'password',
                                },
                            ].map(({ id, label, type }) => (
                                <div key={id} className="space-y-2">
                                    <Label htmlFor={id}>{label}</Label>
                                    <Input id={id} name={id} type={type} />
                                    {pageProps.errors?.[id] && (
                                        <p className="text-red-500 text-xs">
                                            {pageProps.errors?.[id]}
                                        </p>
                                    )}
                                </div>
                            ))}
                            <Button type="submit" className="w-full h-12">
                                Register
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-sm text-gray-500 text-center py-2">
                    Already have an account?{' '}
                    <Link className="text-primary" href={appRoutes.auth.login}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
