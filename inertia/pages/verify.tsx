import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Loader2, User } from 'lucide-react'

type VerificationType = 'bvn' | 'nin'
type VerificationResult = {
    name: string
    dob: string
    phone: string
} | null

export default function VerifyPage() {
    const [type, setType] = useState<VerificationType>('bvn')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<VerificationResult>(null)

    const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const number = formData.get(type)

        try {
            const response = await fetch(`/verify/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [type]: number }),
            })
            const data = await response.json()
            setResult(data.data)
        } catch (error) {
            console.error('Verification failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <header>
                    <h1 className="text-2xl font-bold">Verify Identity</h1>
                </header>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Form</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                {(['bvn', 'nin'] as const).map((method) => (
                                    <Button
                                        key={method}
                                        variant={type === method ? 'default' : 'outline'}
                                        onClick={() => setType(method)}
                                        className="flex-1"
                                    >
                                        {method.toUpperCase()}
                                    </Button>
                                ))}
                            </div>

                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={type}>Enter {type.toUpperCase()} Number</Label>
                                    <Input
                                        id={type}
                                        name={type}
                                        placeholder={`Enter your ${type.toUpperCase()}`}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify {type.toUpperCase()}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result ? (
                                <dl className="space-y-4">
                                    {Object.entries(result).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-3 gap-4">
                                            <dt className="font-medium capitalize col-span-1">
                                                {key}:
                                            </dt>
                                            <dd className="col-span-2">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            ) : (
                                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                                    <User className="w-12 h-12 mb-4 text-muted-foreground/50" />
                                    <p>No verification result yet</p>
                                    <p className="text-sm">
                                        Verify an ID to see the information here
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
