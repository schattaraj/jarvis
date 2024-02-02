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
    const data = {
        labels: ['Max', 'Mean', 'Min'],
        datasets: [
            {
                label: 'Bond Values',
                data: [
                    parseFloat(bondData.maxValue),
                    parseFloat(bondData.meanValue),
                    parseFloat(bondData.minValue),
                ],
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'category',
                labels: ['Max', 'Mean', 'Min'],
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default BondChart;
