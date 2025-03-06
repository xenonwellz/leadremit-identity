import { Badge } from '@/components/ui/badge'

type VerificationStatus =
    | 'verified'
    | 'pending'
    | 'rejected'
    | 'success'
    | 'error'
    | 'failed'
    | 'completed'

interface VerificationStatusBadgeProps {
    status: VerificationStatus
}

export function VerificationStatusBadge({ status }: VerificationStatusBadgeProps) {
    const variant = {
        verified: 'success',
        success: 'success',
        pending: 'warning',
        rejected: 'error',
        error: 'error',
        failed: 'error',
        completed: 'success',
    }[status]

    return <Badge variant={variant as 'success' | 'error' | 'warning' | 'default'}>{status}</Badge>
}
