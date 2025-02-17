import AppLayout from '@/layouts/app.layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface VerificationHistory {
    id: number
    type: string
    number: string
    status: string
    date: string
    time: string
    response: {
        name: string
        dob: string
    }
    credits: string
}

interface Props {
    verification_history: VerificationHistory[]
}

export default function HistoryPage({ verification_history }: Props) {
    return (
        <AppLayout>
            <div className="space-y-6">
                <header>
                    <h1 className="text-2xl font-bold">Verification History</h1>
                </header>
                <div className="relative">
                    <Search className="absolute top-1/2 left-4  -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by ID number..." className="pl-12" />
                </div>
                <Card>
                    <CardContent>
                        <div className="flex flex-col h-full">
                            {verification_history.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center p-6">
                                    <p>No verification records available.</p>
                                </div>
                            ) : (
                                <Table className="border-separate border-spacing-y-3 flex-1">
                                    <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>S/N</TableHead>
                                            <TableHead>ID NO.</TableHead>
                                            <TableHead>NAME</TableHead>
                                            <TableHead>ID TYPE</TableHead>
                                            <TableHead>TIME</TableHead>
                                            <TableHead>DATE</TableHead>
                                            <TableHead>STATUS</TableHead>
                                            <TableHead className="text-right">CREDITS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {verification_history.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-gray-50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-gray-100"
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.number}</TableCell>
                                                <TableCell>{item.response.name}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`capitalize ${
                                                            item.status === 'success'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.credits}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
