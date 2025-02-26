import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Camera, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    user: {
        name: string
        email: string
        phone?: string
        profile_photo?: string
    }
}

export default function SettingsPage({ user }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.profile_photo || null)
    const [isDragging, setIsDragging] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        try {
            await router.post('/settings/update', formData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragging(false)

        const file = event.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const input = document.getElementById('profile_photo') as HTMLInputElement
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            input.files = dataTransfer.files

            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const removePhoto = () => {
        setPreviewUrl(null)
        const input = document.getElementById('profile_photo') as HTMLInputElement
        input.value = ''
    }

    return (
        <AppLayout>
            <div className="max-w-4xl space-y-6 flex-1 flex flex-col">
                <header>
                    <h1 className="text-xl font-semibold">Settings</h1>
                </header>

                <Card className="bg-muted/30 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base">Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={cn(
                                'relative group w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center transition-all',
                                isDragging && 'border-primary',
                                previewUrl && 'border-none'
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {previewUrl ? (
                                <>
                                    <img
                                        src={previewUrl}
                                        alt="Profile preview"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <label
                                            htmlFor="profile_photo"
                                            className="cursor-pointer p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                                        >
                                            <Camera className="w-5 h-5 text-white" />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                                        >
                                            <X className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label
                                    htmlFor="profile_photo"
                                    className="cursor-pointer w-full h-full flex items-center justify-center"
                                >
                                    <Camera className="w-6 h-6 text-gray-400" />
                                </label>
                            )}
                        </div>

                        <input
                            id="profile_photo"
                            name="profile_photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" defaultValue={user.name} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" defaultValue={user.phone} />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Button type="submit" disabled={isLoading} className="w-full">
                    Save Changes
                </Button>
            </div>
        </AppLayout>
    )
}
