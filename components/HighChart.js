import{ useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatDate } from '../utils/utils';
import Exporting from 'highcharts/modules/exporting';

const HightChart = ({data,title,typeCheck,yAxisTitle,titleAlign,subTitle}) => {
  const [chartOptions, setChartOptions] = useState(null);
  Exporting(Highcharts);
  useEffect(() => {
    const fetchData = async () => {
      setChartOptions({
        chart: {
          zooming: {
            type: 'x'
          }
        },
        title: {
          text: title ? title : "Chart",
          align: titleAlign ? titleAlign : 'left'
        },
        subtitle: {
          // text: subTitle ? subTitle : document.ontouchstart === undefined ?
          //   'Click and drag in the plot area to zoom in' :
          //   'Pinch the chart to zoom in',
          align: titleAlign ? titleAlign : 'left'
        },
        xAxis: typeCheck == null ? {
           
        //   tickInterval: 1 // Ensures whole years on the x-axis
        type: 'datetime', // Use datetime axis
        // tickInterval: 24 * 3600 * 1000 * 30, // Monthly intervals
        tickInterval: 24 * 3600 * 1000, // Monthly intervals
        labels: {
          format: '{value:%e %b %Y}', // Display day, abbreviated month, and year
          rotation: -45, // Optional: rotate labels for better readability
          align: 'right',
        },
        // dateTimeLabelFormats: {
        //   month: '%b %Y'
        // }
        }
        : typeCheck,
        yAxis: {
          title: {
            text:yAxisTitle ? yAxisTitle : 'Avg (%)'
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
