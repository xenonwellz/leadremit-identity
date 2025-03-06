import { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface VerificationSetting {
    id: string
    verification_type: string
    code_name: string
    token_cost: number
    is_enabled: boolean
}

export default function VerificationSettings() {
    const [settings, setSettings] = useState<VerificationSetting[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/verification-settings')
            setSettings(response.data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch verification settings',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (id: string, data: Partial<VerificationSetting>) => {
        try {
            const response = await axios.patch(`/api/verification-settings/${id}`, data)
            setSettings(
                settings.map((setting) =>
                    setting.id === id ? { ...setting, ...response.data } : setting
                )
            )
            toast({
                title: 'Success',
                description: 'Setting updated successfully',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update setting',
                variant: 'destructive',
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Verification Settings</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Token Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {settings.map((setting) => (
                        <TableRow key={setting.id}>
                            <TableCell>{setting.verification_type}</TableCell>
                            <TableCell>{setting.code_name}</TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={setting.token_cost}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value)
                                        if (!isNaN(value) && value >= 0) {
                                            handleUpdate(setting.id, { token_cost: value })
                                        }
                                    }}
                                    className="w-24"
                                />
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={setting.is_enabled}
                                    onCheckedChange={(checked) => {
                                        handleUpdate(setting.id, { is_enabled: checked })
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handleUpdate(setting.id, {
                                            token_cost: setting.token_cost,
                                            is_enabled: setting.is_enabled,
                                        })
                                    }
                                >
                                    Save
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
