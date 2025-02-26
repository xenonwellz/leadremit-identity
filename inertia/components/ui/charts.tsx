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

// Sample data for the line chart (API usage over a week)
const lineChartData = [
    { day: 'Mon', calls: 65 },
    { day: 'Tue', calls: 78 },
    { day: 'Wed', calls: 52 },
    { day: 'Thu', calls: 91 },
    { day: 'Fri', calls: 43 },
    { day: 'Sat', calls: 56 },
    { day: 'Sun', calls: 84 },
]

export function LineChart() {
    // Prepare data for Chart.js
    const data = {
        labels: lineChartData.map((item) => item.day),
        datasets: [
            {
                label: 'Verifications',
                data: lineChartData.map((item) => item.calls),
                borderColor: '#3b82f6', // Blue color
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
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
                backgroundColor: '#ffffff',
                titleColor: '#0f172a',
                bodyColor: '#0f172a',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 4,
                displayColors: false,
                callbacks: {
                    title: (context) => {
                        return context[0].label
                    },
                    label: (context) => {
                        return `API Calls: ${context.parsed.y}`
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
        <div className="h-full w-full">
            <Line data={data} options={options} />
        </div>
    )
}

// You can also add a BarChart component here if needed
