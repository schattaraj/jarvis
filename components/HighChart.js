import{ useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatDate } from '../utils/utils';

const HightChart = ({data,title}) => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
    //   const response = await fetch(
    //     'https://jharvis.com/JarvisV2/getChartForHistoryByTicker?metadataName=Everything_List_New&ticker=AGG&year=2023&year2=2023&_=1718886601497'
    //   );
    //   const data = await response.json();
        console.log("data",JSON.stringify(data.map((item)=>[parseFloat(item['element7']),formatDate(item['lastUpdatedAt'])])))
      setChartOptions({
        chart: {
          zooming: {
            type: 'x'
          }
        },
        title: {
          text: title ? "Chart View For "+title : "Chart",
          align: 'left'
        },
        subtitle: {
          text: document.ontouchstart === undefined ?
            'Click and drag in the plot area to zoom in' :
            'Pinch the chart to zoom in',
          align: 'left'
        },
        xAxis: {
        //   tickInterval: 1 // Ensures whole years on the x-axis
        type: 'datetime', // Use datetime axis
        tickInterval: 24 * 3600 * 1000 * 30, // Monthly intervals
        dateTimeLabelFormats: {
          month: '%b %Y'
        }
        },
        yAxis: {
          title: {
            text: 'Avg (%)'
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            marker: {
              radius: 2
            },
            lineWidth: 1,
            color: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, 'rgb(113, 155, 95)'],
                [0.4,'rgb(91, 167, 43)'],
                [1, 'rgb(255, 255, 254)']
              ]
            },
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        series: [{
          type: 'area',
          name: title,
        //   data:  data.map((item)=>[new Date(item['lastUpdatedAt']).getTime(),parseFloat(item['element7'])])// Assuming data is in the correct format
          data:  data
        }]
      });
    };

    fetchData();
  }, [data]);

  if (!chartOptions) return <div>Loading...</div>;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default HightChart;
