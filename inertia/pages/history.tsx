import AppLayout from '@/layouts/app.layout'
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
import { useState } from 'react'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'

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

const ITEMS_PER_PAGE = 5

export default function HistoryPage({ verification_history }: Props) {
    const [currentPage, setCurrentPage] = useState(1)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = verification_history.slice(startIndex, endIndex)
    const totalPages = Math.ceil(verification_history.length / ITEMS_PER_PAGE)

    return (
        <AppLayout>
            <div className="space-y-6 flex-1 flex flex-col">
                <header>
                    <h1 className="text-xl font-semibold">Verification History</h1>
                </header>
                <div className="relative">
                    <Search className="absolute top-1/2 left-4 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by ID number..." className="pl-12" />
                </div>
                <div className="flex flex-col flex-1 bg-muted/30 rounded-lg border">
                    {verification_history.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center p-6">
                            <p>No verification records available.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-base font-medium mb-4 p-4 py-6 border-b">
                                Verification Records
                            </h2>
                            <div className="overflow-auto flex-1 p-4">
                                <Table className="border-separate border-spacing-y-3 w-full min-w-[800px]">
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
                                        {currentItems.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-muted/50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-muted/60"
                                            >
                                                <TableCell>{startIndex + index + 1}</TableCell>
                                                <TableCell>{item.number}</TableCell>
                                                <TableCell>{item.response.name}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>{item.time}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            item.status === 'success'
                                                                ? 'success'
                                                                : 'error'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.credits}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="p-4 py-6 border-t mt-auto">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
