import{ useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { convertToReadableString, formatDate } from '../utils/utils';

const CallChart = ({data,view,title}) => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
          categories: data.map(item => {
            // item?.stockNameTicker
            const match = item?.stockNameTicker.match(/>([^<]+)<\/a>/);
            return match ? match[1].split(",")[0] : item?.stockNameTicker;
          }),
          title: {
            text: 'Price'
          }
        },
        yAxis: {
          // title: {
          //   text: 'Avg (%)'
          // }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter: function () {
            const point = this.point;
            return `<b>${point.category}</b><br/>${convertToReadableString(view)}: ${point.y}<br/>Expiration Date: ${data[point.index].expirationDate}`;
          },
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
          data:  data.map((item)=>parseFloat(item?.[view]))
        }]
      });
    };

    fetchData();
  }, [data,view]);

  if (!chartOptions) return <div>Loading...</div>;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
};

export default CallChart;
