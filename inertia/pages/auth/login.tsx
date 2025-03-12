import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { router } from '@inertiajs/react'
import { appRoutes } from '#shared/routes'
import { usePage, Link } from '@inertiajs/react'
import { AlertCircle, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
    const pageProps = usePage().props

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        router.post(appRoutes.auth.login, formData)
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Brand/Welcome section */}
            <div className="hidden md:flex md:w-1/2 bg-primary text-white flex-col justify-center items-center p-8"></div>

            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center md:hidden">
                        <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
                        <p className="text-gray-500 mt-2">Sign in to your account</p>
                    </div>

                    {Object.values(pageProps.errorsBag || {}).length > 0 && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-4 rounded-md mt-4">
                            <AlertCircle size={16} />
                            <span>{Object.values(pageProps.errorsBag as any).join(', ')}</span>
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email address
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <Mail size={16} />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 py-6"
                                />
                            </div>
                            {pageProps.errors?.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <Link href="#" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <Lock size={16} />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 py-6"
                                />
                            </div>
                            {pageProps.errors?.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.password}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full py-6 text-base font-medium">
                            Sign in
                        </Button>
                    </form>

                    <p className="text-sm text-gray-600 text-center mt-6">
                        Don't have an account?{' '}
                        <Link
                            className="text-primary font-medium hover:underline"
                            href={appRoutes.auth.register}
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
