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
            <div className="space-y-6 flex-1 flex flex-col">
                <header>
                    <h1 className="text-xl font-semibold">Verify Identity</h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[60%]">
                    <Card className="bg-muted/30 shadow-none !p-0">
                        <CardHeader className="p-0">
                            <CardTitle className="text-base p-6 border-b">
                                Verification Form
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="verification-type">Verification Type</Label>
                                    <Select
                                        value={type}
                                        onValueChange={(value) =>
                                            setType(value as VerificationType)
                                        }
                                    >
                                        <SelectTrigger
                                            id="verification-type"
                                            className="w-full h-14"
                                        >
                                            <SelectValue placeholder="Select verification type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bvn">BVN</SelectItem>
                                            <SelectItem value="nin">NIN</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={type}>{type.toUpperCase()} Number</Label>
                                    <Input
                                        id={type}
                                        name={type}
                                        className="h-14"
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
