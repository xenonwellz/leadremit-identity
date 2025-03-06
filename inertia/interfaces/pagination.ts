export interface PaginationData {
    currentPage: number
    totalPages: number
    perPage: number
    total: number
}

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}
