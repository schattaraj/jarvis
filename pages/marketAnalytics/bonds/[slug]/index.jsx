import { useRouter } from "next/router";
import Breadcrumb from "../../../../components/Breadcrumb";
import { useContext, useEffect, useState } from "react";
import {
  fetchWithInterceptor,
  formatDate,
  getSortIcon,
} from "../../../../utils/utils";
import parse from "html-react-parser";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Context } from "../../../../contexts/Context";
import Exporting from "highcharts/modules/exporting";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default function BondDetails() {
  const [bondData, setBondData] = useState([]);
  const [bondDataFiltered, setBondDataFiltered] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [chartOption, setChartOption] = useState([]);
  const [chartOption2, setChartOption2] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockBondData, setStockBondData] = useState([]);
  const [sbChartData, setSBChartData] = useState([]);
  const [sbChartOption, setSBChartOption] = useState([]);
  const router = useRouter();
  const { slug } = router.query;
  const metadataName = "Bondpricing_Master";
  const cusipNo = slug?.split("-")[0];
  const tickerName = slug?.split("-")[1];
  const context = useContext(Context);
  // Exporting(Highcharts);

  const downloadPageAsPDF = async () => {
    const element = document.querySelector(".main-panel"); // Select the page content
    const downloadButton = document.querySelector(".download-btn"); // Select the download button

    // Temporarily hide the download button
    if (downloadButton) {
      downloadButton.style.display = "none";
    }

    // Clone the element to manipulate styles without affecting the original
    const clonedElement = element.cloneNode(true);
    clonedElement.style.width = "auto"; // Ensure full-width elements are captured
    clonedElement.style.overflow = "visible"; // Make scrollable areas visible
    clonedElement.style.position = "absolute"; // Remove constraints like flex/grid
    document.body.appendChild(clonedElement); // Temporarily append the cloned element to the body

    const canvas = await html2canvas(clonedElement, { scale: 2 }); // Capture full content
    const imgData = canvas.toDataURL("image/png");

    // Remove the cloned element from the DOM
    document.body.removeChild(clonedElement);

    // Convert canvas dimensions from pixels to millimeters
    const pdfWidth = canvas.width * 0.264583; // px to mm
    const pdfHeight = canvas.height * 0.264583; // px to mm

    // Create a dynamically sized PDF
    const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

    // Add the canvas as an image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save("page.pdf");
  };

  const bondTable = async () => {
    context.setLoaderState(true);
    try {
      const fetchBondTableRes = await fetchWithInterceptor(
        `/api/proxy?api=getBondDetailsByCusip?metadataName=${metadataName}&cusipNo=${cusipNo}&_=${new Date().getTime()}`
      );
      // const fetchBondTableRes = await fetchBondTable.json()
      setBondDataFiltered(fetchBondTableRes);
    } catch (error) {
      console.error(error);
    }
    context.setLoaderState(false);
  };
  const getChartForHistoryByCusip = async () => {
    context.setLoaderState(true);
    try {
      const fetchChartRes = await fetchWithInterceptor(
        `/api/proxy?api=getChartForHistoryByCusip?metadataName=${metadataName}&cusipNo=${cusipNo}&year=2024&year2=2024&_=${new Date().getTime()}`
      );
      // const fetchChartRes = await fetchChart.json()
      setChartData(fetchChartRes);
    } catch (error) {
      console.error(error);
    }
    context.setLoaderState(false);
  };
  const findMeanBondByCusip = async () => {
    const fetchDataRes = await fetchWithInterceptor(
      `/api/proxy?api=findMeanBondByCusip?cusipNo=${cusipNo}&chartYear1=2024&chartYear2=2024&_=${new Date().getTime()}`
    );
    // const fetchDataRes = await fetchData.json()
  };
  const getHistoricalDataByStockAndBond = async () => {
    context.setLoaderState(true);
    try {
      const ticker = tickerName.slice(
        tickerName.indexOf("(") + 1,
        tickerName.indexOf(")")
      );
      const fetchDataRes = await fetchWithInterceptor(
        `/api/proxy?api=getHistoricalDataByStockAndBond?ticker=${ticker}&cusip=${cusipNo}&_=${new Date().getTime()}`
      );
      // const fetchDataRes = await fetchData.json()
      setStockBondData(fetchDataRes);
    } catch (error) {
      console.error(error);
    }
    context.setLoaderState(false);
  };
  const getHistoricalDataByStockAndBondForChart = async () => {
    context.setLoaderState(true);
    try {
      const ticker = tickerName.slice(
        tickerName.indexOf("(") + 1,
        tickerName.indexOf(")")
      );
      const fetchDataRes = await fetchWithInterceptor(
        `/api/proxy?api=getHistoricalDataByStockAndBondForChart?ticker=${ticker}&cusip=${cusipNo}&year=2024&year2=2024&_=${new Date().getTime()}`
      );
      // const fetchDataRes = await fetchData.json()
      setSBChartData(fetchDataRes);
    } catch (error) {
      console.error(error);
    }
    context.setLoaderState(false);
  };
  const columnNames = [
    { elementInternalName: "element1", elementName: "Issue" },
    { elementInternalName: "element2", elementName: "Cusip" },
    { elementInternalName: "element3", elementName: "YTM" },
    { elementInternalName: "element4", elementName: "Call Date" },
    { elementInternalName: "element5", elementName: "Call Price" },
    { elementInternalName: "element6", elementName: "Secure" },
    { elementInternalName: "element7", elementName: "Maturity" },
    { elementInternalName: "element8", elementName: "Rating" },
    { elementInternalName: "element9", elementName: "Price" },
    { elementInternalName: "element1", elementName: "Stock" },
    { elementInternalName: "element99", elementName: "Jarvis Rank" },
    { elementInternalName: "lastUpdatedAt", elementName: "Date" },
  ];
  const bondStockColumns = [
    { elementInternalName: "bondName", elementName: "Bond Name" },
    { elementInternalName: "cusip", elementName: "Cusip" },
    { elementInternalName: "bondPrice", elementName: "Bond Price" },
    { elementInternalName: "stockName", elementName: "Stock Name" },
    { elementInternalName: "stockPrice", elementName: "Stock Price" },
    { elementInternalName: "companyName", elementName: "Company Name" },
    { elementInternalName: "date", elementName: "Date" },
    { elementInternalName: "bondToStock", elementName: "Bond To Stock" },
  ];
  useEffect(() => {
    if (chartData.length > 0) {
      const compareData = {
        dates: [],
        data: [],
      };
      const compareData2 = {
        dates: [],
        data: [],
      };
      chartData.map((item) => {
        compareData.dates.push(formatDate(item?.lastUpdatedAt));
        compareData2.dates.push(formatDate(item?.lastUpdatedAt));
        compareData.data.push(Number(item["element9"]));
        compareData2.data.push(Number(item["element3"]));
      });
      const calculateStatistics = (data) => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const mean = data.reduce((acc, val) => acc + val, 0) / data.length;

        return { max, min, mean };
      };

      const { max, min, mean } = calculateStatistics(compareData.data);
      const options = {
        chart: {
          type: "area",
          zoomType: "x",
        },
        title: {
          text: "Ratio Graph",
          align: "center",
        },
        xAxis: {
          categories: compareData.dates,
          title: {
            text: "Date",
          },
        },
        yAxis: {
          title: {
            text: "Price",
          },
          plotLines: [
            {
              color: "red",
              value: max,
              width: 2,
              label: {
                text: `Max: ${max}`,
                align: "left",
                style: {
                  color: "red",
                },
              },
            },
            {
              color: "blue",
              value: mean,
              width: 2,
              label: {
                text: `Mean: ${mean.toFixed(2)}`,
                align: "left",
                style: {
                  color: "blue",
                },
              },
            },
            {
              color: "green",
              value: min,
              width: 2,
              label: {
                text: `Min: ${min}`,
                align: "left",
                style: {
                  color: "green",
                },
              },
            },
          ],
        },
        tooltip: {
          shared: true,
          valueSuffix: " units",
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: true,
          },
          area: {
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            color: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "rgb(113, 155, 95)"],
                [0.4, "rgb(91, 167, 43)"],
                [1, "rgb(255, 255, 254)"],
              ],
            },
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        series: [
          {
            name: "Price",
            data: compareData.data,
            marker: {
              symbol: "circle",
            },
          },
          // {
          //     name: 'Max Value',
          //     data: Array(compareData.data.length).fill(max),
          //     color: 'red',
          //     dashStyle: 'ShortDash',
          //     zIndex: 5,
          //     marker: {
          //         enabled: false
          //     }
          // },
          // {
          //     name: 'Mean Value',
          //     data: Array(compareData.data.length).fill(mean),
          //     color: 'blue',
          //     dashStyle: 'ShortDash',
          //     zIndex: 4,
          //     marker: {
          //         enabled: false
          //     }
          // },
          // {
          //     name: 'Min Value',
          //     data: Array(compareData.data.length).fill(min),
          //     color: 'green',
          //     dashStyle: 'ShortDash',
          //     zIndex: 3,
          //     marker: {
          //         enabled: false
          //     }
          // }
        ],
      };
      const calculateNumber = calculateStatistics(compareData2.data);
      const options2 = {
        chart: {
          type: "area",
          zoomType: "x",
        },
        title: {
          text: "Ratio Graph",
          align: "center",
        },
        xAxis: {
          categories: compareData2.dates,
          title: {
            text: "Date",
          },
        },
        yAxis: {
          title: {
            text: "Price",
          },
          plotLines: [
            {
              color: "green",
              value: calculateNumber?.max,
              width: 2,
              label: {
                text: `Max: ${calculateNumber?.max}`,
                align: "left",
                style: {
                  color: "green",
                },
              },
            },
            {
              color: "yellow",
              value: calculateNumber?.mean,
              width: 2,
              zIndex: 5,
              label: {
                text: `Mean: ${calculateNumber?.mean?.toFixed(2)}`,
                align: "left",
                style: {
                  color: "yellow",
                  zIndex: "999",
                },
              },
            },
            {
              color: "red",
              value: calculateNumber?.min,
              width: 2,
              zIndex: 5,
              label: {
                text: `Min: ${calculateNumber?.min}`,
                align: "left",
                style: {
                  color: "red",
                },
              },
            },
          ],
        },
        tooltip: {
          shared: true,
          valueSuffix: " units",
        },
        plotOptions: {
          //   line: {
          //     dataLabels: {
          //       enabled: true,
          //     },
          //     enableMouseTracking: true,
          //   },
          area: {
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            color: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "rgb(113, 155, 95)"],
                [0.4, "rgb(91, 167, 43)"],
                [1, "rgb(255, 255, 254)"],
              ],
            },
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        series: [
          {
            name: "Price",
            data: compareData2.data,
            marker: {
              symbol: "circle",
            },
          },
        ],
      };
      setChartOption(options);
      setChartOption2(options2);
    }
  }, [chartData]);
  useEffect(() => {
    try {
      if (sbChartData.length > 0) {
        const chartData = {
          dates: [],
          stockPrice: [],
          bondPrice: [],
          bondToStockPrice: [],
        };
        sbChartData.map((item) => {
          chartData?.stockPrice.push(Number(item?.stockPrice));
          chartData?.bondPrice.push(Number(item?.bondPrice));
          chartData?.bondToStockPrice.push(Number(item?.bondToStock));
        });
        const options = {
          chart: {
            type: "line",
            zoomType: "x",
          },
          title: {
            text: "Ratio Graph",
            align: "center",
          },
          xAxis: {
            categories: chartData.dates,
            title: {
              text: "Date",
            },
          },
          yAxis: {
            title: {
              text: "Price",
            },
          },
          tooltip: {
            shared: true,
            valueSuffix: " units",
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true,
              },
              enableMouseTracking: true,
            },
          },
          series: [
            {
              name: "Stock Price",
              data: chartData.stockPrice,
              marker: {
                symbol: "circle",
              },
            },
            {
              name: "Bond Price",
              data: chartData.bondPrice,
              marker: {
                symbol: "triangle",
              },
            },
            {
              name: "Bond To Stock Price",
              data: chartData.bondToStockPrice,
              marker: {
                symbol: "circle",
              },
            },
          ],
        };
        setSBChartOption(options);
      }
    } catch (error) {
      console.error(error);
    }
  }, [sbChartData]);
  useEffect(() => {
    if (slug) {
      bondTable();
      getChartForHistoryByCusip();
      getHistoricalDataByStockAndBond();
      getHistoricalDataByStockAndBondForChart();
    }
  }, [slug]);
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <Breadcrumb />
            </div>
            <div>
              <button
                className="btn btn-primary mb-4 download-btn"
                onClick={downloadPageAsPDF}
              >
                Download Page as PDF
              </button>
            </div>
          </div>
          <div className="page-header">
            <h3 className="page-title">
              <Link href={"/"}>
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home"></i>
                </span>
              </Link>
              Bond Details
            </h3>
          </div>
          <h4 className="text-primary">Bond Table</h4>
          <div className="table-responsive mb-5">
            <table
              className="table border display no-footer dataTable"
              role="grid"
              aria-describedby="exampleStocksPair_info"
              id="my-table"
            >
              <thead>
                <tr>
                  {columnNames.length > 0 &&
                    columnNames.map((item, index) => {
                      return (
                        <th
                          key={index}
                          onClick={() => handleSort(item?.elementInternalName)}
                        >
                          {item?.elementName}{" "}
                          {getSortIcon(item?.elementInternalName, sortConfig)}
                        </th>
                      );
                    })}
                </tr>
              </thead>
              <tbody>
                {bondDataFiltered.map((item, index) => {
                  return (
                    <tr key={"tr" + index}>
                      {columnNames.map((inner, keyid) => {
                        return (
                          <td key={"keyid" + keyid}>
                            {inner["elementInternalName"] == "lastUpdatedAt"
                              ? formatDate(item["lastUpdatedAt"])
                              : typeof item[inner["elementInternalName"]] ==
                                "string"
                              ? parse(item[inner["elementInternalName"]])
                              : item[inner["elementInternalName"]]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h4 className="text-primary">Chart for Price</h4>
          {chartData.length > 0 && (
            <HighchartsReact highcharts={Highcharts} options={chartOption} />
          )}
          <h4 className="text-primary my-4">Chart for YTW</h4>
          <HighchartsReact highcharts={Highcharts} options={chartOption2} />
          <h4 className="text-primary my-4">Bond vs Stock</h4>
          <div className="table-responsive mb-4">
            <table
              className="table border display no-footer dataTable"
              role="grid"
              aria-describedby="exampleStocksPair_info"
              id="my-table"
            >
              <thead>
                <tr>
                  {bondStockColumns.length > 0 &&
                    bondStockColumns.map((item, index) => {
                      return (
                        <th
                          key={index}
                          onClick={() => handleSort(item?.elementInternalName)}
                        >
                          {item?.elementName}{" "}
                          {getSortIcon(item?.elementInternalName, sortConfig)}
                        </th>
                      );
                    })}
                </tr>
              </thead>
              <tbody>
                {stockBondData.map((item, index) => {
                  return (
                    <tr key={"tr" + index}>
                      {bondStockColumns.map((inner, keyid) => {
                        return (
                          <td key={"keyid" + keyid}>
                            {inner["elementInternalName"] == "lastUpdatedAt"
                              ? formatDate(item["lastUpdatedAt"])
                              : typeof item[inner["elementInternalName"]] ==
                                "string"
                              ? parse(item[inner["elementInternalName"]])
                              : item[inner["elementInternalName"]]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {stockBondData.length == 0 && (
                  <tr>
                    <td colSpan={bondStockColumns.length}>No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <h4 className="text-primary my-4">Chart for Bond vs Stock</h4>
          <HighchartsReact highcharts={Highcharts} options={sbChartOption} />
        </div>
      </div>
    </>
  );
}
