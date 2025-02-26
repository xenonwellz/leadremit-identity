import { ReactNode, createContext, useContext } from 'react'
import { ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export type ChartConfig = Record<string, { label: string; color: string }>

type ChartContextValue = {
    config: ChartConfig
}

const ChartContext = createContext<ChartContextValue | null>(null)

export function useChartConfig() {
    const context = useContext(ChartContext)
    if (!context) {
        throw new Error('useChartConfig must be used within a ChartContainer')
    }
    return context
}

interface ChartContainerProps {
    config: ChartConfig
    children: ReactNode
    className?: string
}

export function ChartContainer({ config, children, className }: ChartContainerProps) {
    return (
        <ChartContext.Provider value={{ config }}>
            <div
                className={cn('w-full h-full', className)}
                style={Object.fromEntries(
                    Object.entries(config).flatMap(([key, value]) => [
                        [`--color-${key}`, value.color],
                    ])
                )}
            >
                <ResponsiveContainer width="100%" height="100%">
                    {children as any}
                </ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
}
