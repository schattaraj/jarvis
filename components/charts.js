import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const BondChart = ({ bondData }) => {
    console.log('bondData', bondData)
    const labels = bondData.map(item => new Date(item.lastUpdatedAt).toLocaleDateString())
    const data$ = bondData.map(item => parseFloat(item.element9))
    const data = {
        labels,
        datasets: [
            {
                label: 'Bond Value',
                data: data$,
                backgroundColor: 'rgb(53, 162, 235)',
                borderColor: 'rgba(53, 162, 235, 0.5)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    // const options = {
    //     scales: {
    //         x: {
    //             type: 'category',
    //             labels: ['Max', 'Mean', 'Min'],
    //         },
    //         y: {
    //             beginAtZero: true,
    //         },
    //     },
    // };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default BondChart;
