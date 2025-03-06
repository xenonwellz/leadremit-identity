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
import AdminLayout from '@/layouts/admin.layout'
import { usePage, router } from '@inertiajs/react'
import type VerificationSetting from '#models/verification_setting'
import { useState } from 'react'

function SettingRow({ setting }: { setting: VerificationSetting }) {
    const [tokenCost, setTokenCost] = useState(setting.tokenCost)
    const [isEnabled, setIsEnabled] = useState(setting.isEnabled)
    const [isLoading, setIsLoading] = useState(false)
    const [isDirty, setIsDirty] = useState(false)

    const handleUpdate = () => {
        setIsLoading(true)
        router.put(
            `/verification-settings/${setting.id}`,
            { tokenCost, isEnabled },
            {
                onFinish: () => {
                    setIsLoading(false)
                    setIsDirty(false)
                },
            }
        )
    }

    return (
        <TableRow>
            <TableCell className="uppercase">{setting.codeName}</TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={tokenCost}
                    onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value >= 0) {
                            setTokenCost(value)
                            setIsDirty(true)
                        }
                    }}
                    className="w-24"
                    disabled={isLoading}
                />
            </TableCell>
            <TableCell>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => {
                        setIsEnabled(checked)
                        setIsDirty(true)
                    }}
                    disabled={isLoading}
                />
            </TableCell>
            <TableCell>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdate}
                    disabled={isLoading || !isDirty}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default function Index() {
    const { settings } = usePage<{ settings: VerificationSetting[] }>().props

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Verification Settings</h1>
                <Table className="border">
                    <TableHeader>
                        <TableRow className="&[&>*]:py-6">
                            <TableHead>Name</TableHead>
                            <TableHead>Token Cost</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settings.map((setting) => (
                            <SettingRow key={setting.id} setting={setting} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    )
}
