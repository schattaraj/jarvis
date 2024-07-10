import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Percentage',
                data: data.values,
                backgroundColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgb(54, 162, 235)',
                    'rgba(153, 102, 255, 1)',
                    'rgb(255, 99, 132)'
                ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)',
                //     'rgba(75, 192, 192, 1)',
                //     'rgba(153, 102, 255, 1)',
                //     'rgba(255, 159, 64, 1)',
                // ],
                borderWidth: 1,
                hoverOffset: 4
            },
        ],
    };

    return <Pie data={chartData} />;
};

export default PieChart;
