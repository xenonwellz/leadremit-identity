import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { router } from '@inertiajs/react'
import { formatDistance } from 'date-fns'
import { TokenHistoryTableProps } from '@/interfaces/token'

export function TokenHistoryTable({ tokenHistory, pagination }: TokenHistoryTableProps) {
    const handlePageChange = (page: number) => {
        router.visit(window.location.pathname, {
            data: { page },
            preserveState: true,
            preserveScroll: true,
            only: ['tokenHistory', 'tokenPagination'],
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Token History</h2>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokenHistory.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No token history found
                                </TableCell>
                            </TableRow>
                        ) : (
                            tokenHistory.map((history) => (
                                <TableRow key={history.id}>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                history.type === 'credit' ? 'success' : 'error'
                                            }
                                        >
                                            {history.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{history.amount}</TableCell>
                                    <TableCell>{history.description}</TableCell>
                                    <TableCell>
                                        {formatDistance(new Date(history.created_at), new Date(), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
