
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface NetWorthChartProps {
  assets: number;
  liabilities: number;
}

const NetWorthChart = ({ assets, liabilities }: NetWorthChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy existing chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Assets', 'Liabilities'],
        datasets: [
          {
            data: [assets, liabilities],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0) as number;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: $${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [assets, liabilities]);
  
  return (
    <div className="h-[300px] relative">
      <canvas ref={chartRef} />
    </div>
  );
};

export default NetWorthChart;
