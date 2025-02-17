import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { router } from '@inertiajs/react'
import { appRoutes } from '#shared/routes'
import { usePage } from '@inertiajs/react'
import { Link } from '@inertiajs/react'

export default function LoginPage() {
    const pageProps = usePage().props

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        router.post(appRoutes.auth.login, formData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg- text-black">
            <div className="w-full max-w-xl">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        {Object.values(pageProps.errorsBag || {}).length > 0 && (
                            <div className="text-red-500 text-xs bg-red-100 p-6 rounded-md">
                                {Object.values(pageProps.errorsBag as any).join(', ')}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {[
                                { id: 'email', label: 'Email address', type: 'email' },
                                { id: 'password', label: 'Password', type: 'password' },
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
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-sm text-gray-500 text-center py-2">
                    Don't have an account?{' '}
                    <Link className="text-primary" href={appRoutes.auth.register}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
