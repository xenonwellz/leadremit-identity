import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from '@/components/ui/table'

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
    return (
        <div className="flex flex-col h-full">
            {items.length === 0 ? (
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
                        {[...items, ...items, ...items].map((item, index) => (
                            <TableRow
                                key={index}
                                className="first:[&_td]:rounded-l-lg last:[&_td]:rounded-r-lg [&_td]:border-b-transparent [&_td]:bg-gray-50 h-16 pb-4 [&_td]:p-4 [&_td]:hover:bg-gray-100"
                            >
                                <TableCell>{item.sn}</TableCell>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.idType}</TableCell>
                                <TableCell>{item.time}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell className="text-right">{item.credits}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
