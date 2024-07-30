import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
const PieChart = ({data}) => {
    Exporting(Highcharts);
  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Opportunities',
    },
    exporting: {
        enabled: true, // Enable exporting and printing
      },
    series: [
      {
        name: 'Percentage',
        data: data,
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
