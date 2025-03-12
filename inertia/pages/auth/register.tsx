import { appRoutes } from '#shared/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, router, usePage } from '@inertiajs/react'
import { AlertCircle, User, Mail, Lock } from 'lucide-react'

export default function RegisterPage() {
    const pageProps = usePage().props

    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        router.post(appRoutes.auth.register, formData)
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Brand/Welcome section */}
            <div className="hidden md:flex md:w-1/2 bg-primary text-white flex-col justify-center items-center p-8"></div>

            {/* Right side - Register form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-left md:hidden">
                        <h1 className="text-3xl font-bold text-primary">Create Account</h1>
                        <p className="text-gray-500 mt-2">Sign up to get started</p>
                    </div>

                    {Object.values(pageProps.errors || {}).length > 0 && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-4 rounded-md mt-4">
                            <AlertCircle size={16} />
                            <span>{Object.values(pageProps.errors as any).join(', ')}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <User size={16} />
                                </div>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-10 py-5"
                                />
                            </div>
                            {pageProps.errors?.full_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.full_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium">
                                Username
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <User size={16} />
                                </div>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="johndoe"
                                    className="pl-10 py-5"
                                />
                            </div>
                            {pageProps.errors?.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.username}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
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
                                    className="pl-10 py-5"
                                />
                            </div>
                            {pageProps.errors?.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <Lock size={16} />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 py-5"
                                />
                            </div>
                            {pageProps.errors?.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <Lock size={16} />
                                </div>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 py-5"
                                />
                            </div>
                            {pageProps.errors?.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">
                                    {pageProps.errors?.password_confirmation}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full py-5 text-base font-medium mt-2">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-sm text-gray-600 text-center mt-6">
                        Already have an account?{' '}
                        <Link
                            className="text-primary font-medium hover:underline"
                            href={appRoutes.auth.login}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
