
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { MonthlyRecord } from "@/services/netWorthService";

Chart.register(...registerables);

interface TrendChartProps {
  data: MonthlyRecord[];
}

const TrendChart = ({ data }: TrendChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    
    // Sort data chronologically
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Format dates for display
    const labels = sortedData.map(record => {
      const date = new Date(record.date);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const netWorthData = sortedData.map(record => record.netWorth);
    const assetsData = sortedData.map(record => record.totalAssets);
    const liabilitiesData = sortedData.map(record => record.totalLiabilities);
    
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Net Worth',
            data: netWorthData,
            borderColor: 'rgba(14, 165, 233, 1)',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Assets',
            data: assetsData,
            borderColor: 'rgba(34, 197, 94, 0.7)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            borderDash: [5, 5]
          },
          {
            label: 'Liabilities',
            data: liabilitiesData,
            borderColor: 'rgba(239, 68, 68, 0.7)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw as number;
                return `${label}: $${value.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + (value as number).toLocaleString();
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
  }, [data]);
  
  return (
    <div className="h-full w-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default TrendChart;
