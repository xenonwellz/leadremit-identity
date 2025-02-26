import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Sample data for the verification trend chart
const verificationTrendData = [
    { date: '2023-06-01', identity: 5, address: 3, business: 2 },
    { date: '2023-06-02', identity: 7, address: 4, business: 3 },
    { date: '2023-06-03', identity: 6, address: 5, business: 1 },
    { date: '2023-06-04', identity: 9, address: 6, business: 4 },
    { date: '2023-06-05', identity: 8, address: 7, business: 3 },
    { date: '2023-06-06', identity: 11, address: 5, business: 6 },
    { date: '2023-06-07', identity: 10, address: 8, business: 5 },
    { date: '2023-06-08', identity: 12, address: 7, business: 4 },
    { date: '2023-06-09', identity: 14, address: 9, business: 7 },
    { date: '2023-06-10', identity: 16, address: 8, business: 5 },
]

export function VerificationTrendChart() {
    // Prepare data for Chart.js
    const labels = verificationTrendData.map((item) =>
        new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    )

    const data = {
        labels,
        datasets: [
            {
                label: 'Identity',
                data: verificationTrendData.map((item) => item.identity),
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 8,
            },
            {
                label: 'Address',
                data: verificationTrendData.map((item) => item.address),
                borderColor: '#82ca9d',
                backgroundColor: 'rgba(130, 202, 157, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 8,
            },
            {
                label: 'Business',
                data: verificationTrendData.map((item) => item.business),
                borderColor: '#ff7300',
                backgroundColor: 'rgba(255, 115, 0, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 8,
            },
        ],
    }

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (context) => {
                        return context[0].label
                    },
                    label: (context) => {
                        return `${context.dataset.label}: ${context.parsed.y}`
                    },
                },
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    }

    return (
        <Card className="bg-muted/30 shadow-none">
            <CardHeader className="p-6 border-b">
                <CardTitle className="text-base">Verification Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-80">
                    <Line data={data} options={options} />
                </div>
            </CardContent>
        </Card>
    )
}
