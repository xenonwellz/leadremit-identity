import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'error' | 'warning' | 'default'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                {
                    'bg-green-50 text-green-700 ring-green-600/20': variant === 'success',
                    'bg-red-50 text-red-700 ring-red-600/20': variant === 'error',
                    'bg-yellow-50 text-yellow-700 ring-yellow-600/20': variant === 'warning',
                    'bg-gray-50 text-gray-700 ring-gray-600/20': variant === 'default',
                },
                className
            )}
            {...props}
        />
    )
}
