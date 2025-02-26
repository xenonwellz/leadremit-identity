import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'

const ITEMS_PER_PAGE = 5

const items = [
    {
        sn: 1,
        id: '12345678',
        name: 'John martins',
        idType: 'bvn',
        time: '12:35 pm',
        date: '30 august 2024',
        status: 'successful',
        credits: '45 credits',
    },
    {
        sn: 1,
        id: '12345678',
        name: 'John martins',
        idType: 'bvn',
        time: '12:35 pm',
        date: '30 august 2024',
        status: 'Failed',
        credits: '45 credits',
    },
    {
        sn: 1,
        id: '12345678',
        name: 'John martins',
        idType: 'bvn',
        time: '12:35 pm',
        date: '30 august 2024',
        status: 'successful',
        credits: '45 credits',
    },
    {
        sn: 1,
        id: '12345678',
        name: 'John martins',
        idType: 'bvn',
        time: '12:35 pm',
        date: '30 august 2024',
        status: 'Failed',
        credits: '45 credits',
    },
    {
        sn: 1,
        id: '12345678',
        name: 'John martins',
        idType: 'bvn',
        time: '12:35 pm',
        date: '30 august 2024',
        status: 'successful',
        credits: '45 credits',
    },
]

export function VerificationTable() {
    const [currentPage, setCurrentPage] = useState(1)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentItems = [...items, ...items, ...items].slice(startIndex, endIndex)
    const totalPages = Math.ceil([...items, ...items, ...items].length / ITEMS_PER_PAGE)

    return (
        <div className="flex flex-col h-full bg-muted/30 rounded-lg border">
            {items.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-6">
                    <p>No verification records available.</p>
                </div>
            ) : (
                <>
                    <h2 className="text-base font-medium mb-4 p-4 py-6 border-b">
                        Recent Verifications
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
                                        key={startIndex + index}
                                        className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-muted/50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-muted/60"
                                    >
                                        <TableCell>{startIndex + index + 1}</TableCell>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.idType}</TableCell>
                                        <TableCell>{item.time}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    item.status.toLowerCase() === 'successful'
                                                        ? 'success'
                                                        : 'error'
                                                }
                                                className="capitalize"
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{item.credits}</TableCell>
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
    )
}
