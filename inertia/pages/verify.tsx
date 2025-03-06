import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Loader2, User } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { router } from '@inertiajs/react'

interface VerificationType {
    id: string
    name: string
    description: string
    cost: number
}

interface PageProps {
    types: VerificationType[]
}

interface VerificationError {
    code: string
    message: string
}

interface VerificationResult {
    success: boolean
    data?: {
        id: string
        name: string
        phone: string
        verified: boolean
        [key: string]: any
    }
    error?: VerificationError
}

export default function VerifyPage({ types }: PageProps) {
    const [selectedType, setSelectedType] = useState<string>(types[0]?.id || '')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<VerificationResult['data'] | null>(null)
    const [error, setError] = useState<VerificationError | null>(null)

    const handleVerify = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setResult(null)

        const formData = new FormData(event.currentTarget)
        const idNumber = formData.get('idNumber')

        router.post(
            '/verify',
            {
                type: selectedType.replace('-verification', ''),
                idNumber,
            },
            {
                onSuccess: (page) => {
                    const response = page.props.response as VerificationResult
                    if (response.success) {
                        setResult(response.data || null)
                    } else {
                        setError(
                            response.error || {
                                code: 'UNKNOWN_ERROR',
                                message: 'An unknown error occurred',
                            }
                        )
                    }
                },
                onError: (errors) => {
                    setError({
                        code: 'VALIDATION_ERROR',
                        message: 'Please check your input and try again',
                    })
                },
                onFinish: () => setIsLoading(false),
            }
        )
    }

    const selectedVerification = types.find((t) => t.id === selectedType)

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header>
                    <h1 className="text-xl font-semibold">Verify Identity</h1>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[60%]">
                    <Card className="bg-muted/30 shadow-none !p-0">
                        <CardHeader className="p-0">
                            <CardTitle className="text-base p-6 border-b">
                                Verification Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error.message}</AlertDescription>
                                </Alert>
                            )}
                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="verification-type">Verification Type</Label>
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger
                                            id="verification-type"
                                            className="w-full h-14"
                                        >
                                            <SelectValue placeholder="Select verification type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {types.map((type) => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.name} ({type.cost} tokens)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedVerification && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {selectedVerification.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="idNumber">ID Number</Label>
                                    <Input
                                        id="idNumber"
                                        name="idNumber"
                                        className="h-14"
                                        placeholder="Enter your ID number"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify Now
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30 shadow-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-base p-6 border-b">
                                Verification Result
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {result ? (
                                <dl className="space-y-4">
                                    {Object.entries(result).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-3 gap-4">
                                            <dt className="font-medium capitalize col-span-1">
                                                {key}:
                                            </dt>
                                            <dd className="col-span-2">
                                                {typeof value === 'object'
                                                    ? JSON.stringify(value)
                                                    : String(value)}
                                            </dd>
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
