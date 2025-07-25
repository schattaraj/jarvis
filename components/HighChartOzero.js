import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Exporting from "highcharts/modules/exporting";

const HightChartOZero = ({
  data,
  title,
  yAxisTitle,
  titleAlign,
  xAxisTitle,
  typeCheck,
  subTitle = "",
  chartType = "column",
}) => {
  const [chartOptions, setChartOptions] = useState(null);
  Exporting(Highcharts);
  useEffect(() => {
    const fetchData = async () => {
      setChartOptions({
        chart: {
          type: chartType,
          events: {
            render() {
              const chart = this;

              // Create or get existing defs
              let defs = chart.renderer.defs;
              if (!defs) {
                defs = chart.renderer.createElement("defs").add();
                chart.renderer.defs = defs;
              }

              const ensureGradient = (id, stops) => {
                if (!defs.element.querySelector(`#${id}`)) {
                  const grad = chart.renderer
                    .createElement("linearGradient")
                    .attr({
                      id,
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1,
                    })
                    .add(defs);

                  stops.forEach(([offset, color]) => {
                    chart.renderer
                      .createElement("stop")
                      .attr({
                        offset,
                        "stop-color": color,
                      })
                      .add(grad);
                  });
                }
              };

              // ✅ Define gradient for up and down
              ensureGradient("gradient-up", [
                ["0%", "rgb(255, 255, 224)"],
                ["50%", "rgb(91, 167, 43)"],
                ["100%", "rgb(113, 155, 95)"],
              ]);
              ensureGradient("gradient-down", [
                ["0%", "rgb(113, 155, 95)"],
                ["50%", "rgb(91, 167, 43)"],
                ["100%", "rgb(255, 255, 224)"],
              ]);
            },
          },
        },
        title: {
          text: title || "Chart",
          align: titleAlign || "left",
        },
        subtitle: {
          text: subTitle || "",
          align: titleAlign || "left",
        },
        xAxis:
          typeCheck == null
            ? {
                type: chartType === "column" ? "category" : "datetime",
                title: {
                  text:
                    xAxisTitle || (chartType === "column" ? "Company" : "Date"),
                },
                labels:
                  chartType === "column"
                    ? {
                        rotation: -45,
                        style: { fontSize: "11px" },
                      }
                    : {
                        format: "{value:%e %b %Y}",
                        rotation: -45,
                        align: "right",
                      },
              }
            : typeCheck,
        yAxis: {
          title: {
            text: yAxisTitle || "Avg (%)",
          },
          plotLines:
            chartType === "column"
              ? [
                  {
                    color: "black",
                    width: 1,
                    value: 0,
                  },
                ]
              : [],
          gridLineWidth: 1,
          minorGridLineWidth: 0,
          tickLength: 5,
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          column: {
            threshold: 0,
            borderWidth: 0,
          },
        },
        series: [
          {
            type: chartType,
            name: title,
            shadow: false,
            data: data.map((point) => ({
              ...point,
              color: point.y >= 0 ? "url(#gradient-up)" : "url(#gradient-down)",
            })),
          },
        ],
      });
    };

    fetchData();
  }, [data]);

  if (!chartOptions) return <div>Loading...</div>;

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default HightChartOZero;
