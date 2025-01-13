import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent } from '@/components/ui/card';

// Register chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarGraphProps {
  t_data: number;  // Data for today
  y_data: number;  // Data for 1 day ago
  threeData: number; // Data for 2 days ago (Renamed from 3_data)
}

const BarGraph = ({ t_data, y_data, threeData }: BarGraphProps) => {
  // Prepare data for the chart
  const chartData = {
    labels: ['2 Days Ago', '1 Day Ago', 'Today'],
    datasets: [
      {
        label: 'Newly Added Records',
        data: [threeData, y_data, t_data],  // Dynamically use the props
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

 

  return (
    <Card>
    
      <CardContent style={{ height: '130px', padding:'5px', margin:'0px' }}>
        <Bar data={chartData}  />
      </CardContent>
    </Card>
  );
};

export default BarGraph;
