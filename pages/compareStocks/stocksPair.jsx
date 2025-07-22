import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/footer";
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "../../components/loader";
import { Context } from "../../contexts/Context";
import { Pagination } from "../../components/Pagination";
import SliceData from "../../components/SliceData";
import {
  calculateAverage,
  fetchWithInterceptor,
  searchTable,
} from "../../utils/utils";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumb";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
  Formik,
  Form as FormikForm,
  Field,
  ErrorMessage,
  useFormik,
} from "formik";
import { Nav } from "react-bootstrap";
import Swal from "sweetalert2";
// import { strocksValidationSchema } from "../../components/stocksValidationSchema";
export default function StocksPair() {
  const [stocks, setStocks] = useState([]);
  const [inputData, setInputData] = useState({
    stockA: "",
    stockB: "",
    stockC: "",
    stockD: "",
    startDate: "",
    endDate: "",
  });
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewChart, setViewChart] = useState(false);
  const [chartOption, setChartOption] = useState([]);
  const [ratioChartOption, setRatioChartOption] = useState([]);
  const [limit, setLimit] = useState(25);
  const [activeTab, setActiveTab] = useState("chart");
  const context = useContext(Context);
  const fecthStocks = async () => {
    context.setLoaderState(true);
    try {
      const stocksRes = await fetchWithInterceptor(
        `/api/proxy?api=getAllStocks?_=${new Date().getTime()}`
      );
      // const stocksRes = await stocksApi.json();
      setStocks(stocksRes);
      setFilterData(stocksRes);
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };
  const handleInput = (e, name) => {
    if (name) {
      setInputData({ ...inputData, [name]: e.value });
    } else {
      setInputData({ ...inputData, [e.target.name]: e.target.value });
    }
    console.log("input", e, name);
  };
  const submitData = async (chartView = false) => {
    if (inputData?.stockA === "" || inputData?.stockB === "") {
      Swal.fire({
        title: "Please select a pair of stocks for stockA and stockB",
        icon: "warning",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }
    if (
      (inputData?.stockC !== "" && inputData?.stockD === "") ||
      (inputData?.stockC === "" && inputData?.stockD !== "")
    ) {
      Swal.fire({
        title: "Please select a pair of stocks for stockC and stockD",
        icon: "warning",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    context.setLoaderState(true);
    try {
      const dataRes = await fetchWithInterceptor(
        "/api/proxy?api=getHistoricalDataByStockAndDate?stockA=" +
          inputData?.stockA +
          "&stockB=" +
          inputData?.stockB +
          "&stockC=" +
          inputData?.stockC +
          "&stockD=" +
          inputData?.stockD +
          "&startDate=" +
          inputData?.startDate +
          "&endDate=" +
          inputData?.endDate +
          "&_=1699957833253"
      );
      // const dataRes = await dataApi.json();

      const formattedData = [];

      let lastTrend = null;
      let lastTrendThirdForth = null;

      let lastRatio = Number(parseFloat(dataRes[0].ratio).toFixed(2));
      let lastRatioThirdFourth = Number(
        parseFloat(dataRes[0].ratioThirdFourth).toFixed(2)
      );

      dataRes.forEach((item, index) => {
        const currentRatio = Number(parseFloat(item.ratio).toFixed(2));
        const currentRatioThirdFourth = Number(
          parseFloat(item.ratioThirdFourth).toFixed(2)
        );
        let trendRatio = null;
        let trendThirdFourth = null;

        if (index === 0 || currentRatio === lastRatio) {
          trendRatio = null;
        } else if (currentRatio > lastRatio) {
          trendRatio = "up";
          lastRatio = currentRatio;
        } else {
          trendRatio = "down";
          lastRatio = currentRatio;
        }

        // Calculate trend for `ratioThirdFourth`
        if (index === 0 || currentRatioThirdFourth === lastRatioThirdFourth) {
          trendThirdFourth = null;
        } else if (currentRatioThirdFourth > lastRatioThirdFourth) {
          trendThirdFourth = "up";
          lastRatioThirdFourth = currentRatioThirdFourth;
        } else {
          trendThirdFourth = "down";
          lastRatioThirdFourth = currentRatioThirdFourth;
        }

        formattedData.push({
          ...item,
          trend: trendRatio, // Trend for `ratio`
          trendThirdFourth: trendThirdFourth, // Trend for `ratioThirdFourth`
        });
      });

      setTableData(formattedData);
      if (chartView) {
        setViewChart(true);
      } else {
        setViewChart(false);
      }
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };
  const reset = () => {
    setInputData({
      stockA: "",
      stockB: "",
      stockC: "",
      stockD: "",
      startDate: "",
      endDate: "",
    });
    setTableData([]);
    setFilterData([]);
    setViewChart(false);
  };
  const exportPdf = () => {
    if (tableData.length > 0) {
      const doc = new jsPDF();

      autoTable(doc, { html: "#my-table" });

      doc.save("table.pdf");
    }
  };
  const handlePage = async (action) => {
    switch (action) {
      case "prev":
        setCurrentPage(currentPage - 1);
        break;
      case "next":
        setCurrentPage(currentPage + 1);
        break;
      default:
        setCurrentPage(currentPage);
        break;
    }
  };

  const filter = (e) => {
    const value = e.target.value;
    setFilterData(searchTable(tableData, value));
  };
  const selectOptions = [
    { value: "", label: "--Select stock--" },
    ...stocks.map((item) => ({
      value: item?.stockName,
      label: item?.stockName,
    })),
  ];
  useEffect(() => {
    fecthStocks();
  }, []);
  useEffect(() => {
    async function run() {
      if (tableData.length > 0) {
        const items = await SliceData(currentPage, limit, tableData);
        setFilterData(items);
      }
    }
    run();
  }, [currentPage, tableData]);

  useEffect(() => {
    const compareData = {
      dates: [],
      [inputData?.stockA]: [],
      [inputData?.stockB]: [],
      [inputData?.stockC]: [],
      [inputData?.stockD]: [],
      ratioFirst: [],
      ratioSecond: [],
    };

    {
      tableData.map((item) => {
        compareData.dates.push(item?.date);
        compareData[inputData?.stockA].push(Number(item?.firstParamVal));
        compareData[inputData?.stockB].push(Number(item?.secondParamVal));
        if (item?.thirdParamVal) {
          compareData[inputData?.stockC].push(Number(item?.thirdParamVal));
        }
        if (item?.fourthParamVal) {
          compareData[inputData?.stockD].push(Number(item?.fourthParamVal));
        }
        compareData.ratioFirst.push(Number(Number(item?.ratio).toFixed(2)));
        compareData.ratioSecond.push(
          Number(Number(item?.ratioThirdFourth).toFixed(2))
        );
      });
    }

    const options = {
      chart: {
        type: "line",
        zoomType: "x",
      },
      title: {
        text: "Value Chart",
        align: "center",
      },
      xAxis: {
        categories: compareData.dates,
        title: {
          text: "Date",
        },
      },
      // yAxis: {
      //   title: {
      //     text: "Price",
      //   },
      //   min: 0,
      //   tickInterval: 5,
      // },
      yAxis: [
        {
          // Primary Y-axis for the first series
          title: {
            text: inputData?.stockA,
          },
          min: 0,
          tickInterval:
            Math.max(...compareData[inputData?.stockA]) > 500 ? 200 : 10,
          max: Math.max(...compareData[inputData?.stockA]),
        },
        {
          // Secondary Y-axis for the second series
          title: {
            text: inputData?.stockB,
          },
          min: 0,
          tickInterval:
            Math.max(...compareData[inputData?.stockB]) > 500 ? 200 : 10,
          max: Math.max(...compareData[inputData?.stockB]),
        },
        {
          // Secondary Y-axis for the second series
          title: {
            text: inputData?.stockC,
          },
          min: 0,
          tickInterval:
            Math.max(...compareData[inputData?.stockC]) > 500 ? 200 : 10,
          max: Math.max(...compareData[inputData?.stockC]),
        },
        {
          title: {
            text: inputData?.stockD,
          },
          min: 0,
          tickInterval:
            Math.max(...compareData[inputData?.stockD]) > 500 ? 200 : 10,
          max: Math.max(...compareData[inputData?.stockD]),
        },
      ],
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
          name: inputData?.stockA,
          data: compareData[inputData?.stockA],
          marker: {
            symbol: "circle",
          },
          yAxis: 0,
        },
        {
          name: inputData?.stockB,
          data: compareData[inputData?.stockB],
          marker: {
            symbol: "triangle",
          },
          yAxis: 1,
        },
        // {
        //   name: "Ratio First",
        //   data: compareData.ratioFirst,
        //   marker: {
        //     symbol: "circle",
        //   },
        // },
      ],
    };

    const ratioOptions = {
      chart: {
        type: "line",
        zoomType: "x",
      },
      title: {
        text: "Ratio Chart",
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
          name: "Ratio First",
          data: compareData.ratioFirst,
          marker: {
            symbol: "circle",
          },
        },
      ],
    };
    if (compareData[inputData?.stockC].length > 0) {
      options.series.push({
        name: inputData?.stockC,
        data: compareData[inputData?.stockC],
        marker: {
          symbol: "square",
        },
        yAxis: 2,
      });
    }
    if (compareData[inputData?.stockD].length > 0) {
      options.series.push({
        name: inputData?.stockD,
        data: compareData[inputData?.stockD],
        marker: {
          symbol: "square",
        },
        yAxis: 3,
      });
    }
    if (
      compareData[inputData?.stockC].length > 0 &&
      compareData[inputData?.stockD].length > 0
    ) {
      ratioOptions.series.push({
        name: "Ratio Second",
        data: compareData.ratioSecond,
        marker: {
          symbol: "circle",
        },
      });
    }
    // console.log("Chart Options ", options);
    setChartOption(options);
    setRatioChartOption(ratioOptions);
  }, [tableData, viewChart, filterData]);

  // useEffect(() => {
  //   const formattedData = tableData.map((item, index, arr) => {
  //     let trend = null;
  //     if (index > 0) {
  //       trend =
  //         parseFloat(item.ratio) > parseFloat(arr[index - 1].ratio) ? "up" : "down";
  //     }
  //     return { ...item, trend };
  //   });

  //   setProcessedData(formattedData);
  // }, [tableData]);

  const today = new Date().toISOString().split("T")[0];

  // const formik = useFormik({
  //   initialValues: {
  //     stockA: "",
  //     stockB: "",
  //     stockC: "",
  //     stockD: "",
  //     startDate: "",
  //     endDate: "",
  //   },
  //   validationSchema: strocksValidationSchema,
  //   validateOnBlur: true,
  //   validateOnChange: true,
  // });

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <Breadcrumb />
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>{" "}
              Pair of Stocks
            </h3>
          </div>
          <div className="selection-area mb-3 mt-3">
            <div className="row">
              <div className="col-md-3">
                {/* <select name="stockA" className='form-select' onChange={handleInput} value={inputData.stockA}>
                            <option>Select stock</option>
                            {
                                stocks.map((item,index)=>{
                                    return <option value={item?.stockName} key={"stockA"+index}>{item?.stockName}</option>
                                })
                            }
                            </select> */}
                <Select
                  value={{
                    value: inputData?.stockA,
                    label: inputData?.stockA || "--Select stock A--",
                  }}
                  options={selectOptions}
                  name="stockA"
                  onChange={(e) => {
                    handleInput(e, "stockA");
                  }}
                  className="mb-3"
                />
              </div>
              <div className="col-md-3">
                <Select
                  value={{
                    value: inputData?.stockB,
                    label: inputData?.stockB || "--Select stock B--",
                  }}
                  options={selectOptions}
                  name="stockB"
                  onChange={(e) => {
                    handleInput(e, "stockB");
                  }}
                  className="mb-3"
                />
                {/* <select name="stockB" className='form-select' onChange={handleInput}  value={inputData.stockB}>
                            <option>Select stock</option>
                            {
                                stocks.map((item,index)=>{
                                    return <option value={item?.stockName} key={"stockB"+index}>{item?.stockName}</option>
                                })
                            }
                            </select> */}
              </div>
              <div className="col-md-3">
                <Select
                  value={{
                    value: inputData?.stockC,
                    label: inputData?.stockC || "--Select stock C--",
                  }}
                  options={selectOptions}
                  name="stockC"
                  onChange={(e) => {
                    handleInput(e, "stockC");
                  }}
                  className="mb-3"
                />
                {/* <select name="stockC" className='form-select' onChange={handleInput} value={inputData.stockC}>
                            <option>Select stock</option>
                            {
                                stocks.map((item,index)=>{
                                    return <option value={item?.stockName} key={"stockC"+index}>{item?.stockName}</option>
                                })
                            }
                            </select> */}
              </div>
              <div className="col-md-3">
                <Select
                  value={{
                    value: inputData?.stockD,
                    label: inputData?.stockD || "--Select stock D--",
                  }}
                  options={selectOptions}
                  name="stockD"
                  onChange={(e) => {
                    handleInput(e, "stockD");
                  }}
                  className="mb-3"
                />
                {/* <select name="stockD" className='form-select mb-3' onChange={handleInput} value={inputData.stockD}>
                            <option>Select stock</option>
                            {
                                stocks.map((item,index)=>{
                                    return <option value={item?.stockName} key={"stockD"+index}>{item?.stockName}</option>
                                })
                            }
                            </select> */}
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="">Start date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    onChange={handleInput}
                    value={inputData.startDate}
                    max={today}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="">End date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    onChange={handleInput}
                    value={inputData.endDate}
                    max={today}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="actions">
                  <button
                    className="btn btn-primary mb-0"
                    onClick={() => submitData(false)}
                  >
                    GO
                  </button>
                  <button className="btn btn-primary mb-0" onClick={reset}>
                    RESET
                  </button>
                  <button
                    className="btn btn-primary mb-0"
                    type="button"
                    onClick={() => submitData(true)}
                  >
                    <span>CHART VIEW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {tableData.length > 0 && !viewChart && (
            <div className="d-flex justify-content-between">
              <div className="dt-buttons mb-3">
                <button
                  className="dt-button buttons-pdf buttons-html5 btn btn-primary"
                  tabindex="0"
                  aria-controls="exampleStocksPair"
                  type="button"
                  title="PDF"
                  onClick={exportPdf}
                >
                  <span class="mdi mdi-file-pdf-box me-2"></span>
                  <span>PDF</span>
                </button>{" "}
                <button
                  className="dt-button buttons-excel buttons-html5 btn btn-primary"
                  tabindex="0"
                  aria-controls="exampleStocksPair"
                  type="button"
                >
                  <span class="mdi mdi-file-excel me-2"></span>
                  <span>EXCEL</span>
                </button>
              </div>
              <div className="form-group d-flex align-items-center">
                <label
                  htmlFor=""
                  style={{ textWrap: "nowrap" }}
                  className="text-success me-2"
                >
                  Search :{" "}
                </label>
                <input
                  type="search"
                  placeholder=""
                  className="form-control"
                  onChange={filter}
                />
              </div>
            </div>
          )}
          {tableData.length > 0 && !viewChart && (
            <div className="table-responsive">
              <table
                id="my-table"
                className="table border display no-footer dataTable"
                style={{ width: "", marginLeft: "0px" }}
                role="grid"
                aria-describedby="exampleStocksPair_info"
              >
                <thead>
                  <tr id="headerRow" role="row">
                    <th
                      className="sorting_desc"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label="Date: activate to sort column ascending"
                      aria-sort="descending"
                    >
                      Date
                    </th>
                    <th
                      className="sorting"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label="AAL: activate to sort column ascending"
                    >
                      {inputData?.stockA}
                    </th>
                    <th
                      className="sorting"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label="AAPL: activate to sort column ascending"
                    >
                      {inputData?.stockB}
                    </th>
                    <th
                      className="sorting"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label="Ratio: activate to sort column ascending"
                    >
                      Ratio
                    </th>
                    <th
                      className="sorting"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label=": activate to sort column ascending"
                    >
                      {inputData?.stockC}
                    </th>
                    <th
                      className="sorting"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label=": activate to sort column ascending"
                    >
                      {inputData?.stockD}
                    </th>
                    <th
                      className="sorting"
                      tabindex="0"
                      aria-controls="exampleStocksPair"
                      rowspan="1"
                      colspan="1"
                      aria-label="Ratio: activate to sort column ascending"
                    >
                      {inputData?.stockC && inputData?.stockD ? "Ratio" : ""}
                    </th>
                  </tr>
                </thead>
                <tbody id="stockPairDropTable">
                  {/* <tr role="row" className="odd"><td className="sorting_1">2023-11-10</td><td>11.8000</td><td>186.4000</td><td>0.060</td><td></td><td></td><td>0.000</td></tr><tr role="row" className="even"><td className="sorting_1">2023-11-03</td><td>11.9800</td><td>176.6500</td><td>0.070</td><td></td><td></td><td>0.000</td></tr><tr role="row" className="odd"><td className="sorting_1">2023-10-27</td><td>10.9200</td><td>168.2200</td><td>0.060</td><td></td><td></td><td>0.000</td></tr><tr role="row" className="even"><td className="sorting_1">2023-10-20</td><td>11.0800</td><td>172.8800</td><td>0.060</td><td></td><td></td><td>0.000</td></tr><tr role="row" className="odd"><td className="sorting_1">2023-10-13</td><td>11.7200</td><td>178.8500</td><td>0.070</td><td></td><td></td><td>0.000</td></tr><tr role="row" className="even"><td className="sorting_1">2023-10-06</td><td>12.7600</td><td>177.4900</td><td>0.070</td><td></td><td></td><td>0.000</td></tr> */}
                  {filterData.map((item, index) => {
                    return (
                      <tr key={"tr" + index}>
                        <td>{item?.date}</td>
                        <td>
                          {!isNaN(item?.firstParamVal)
                            ? Number.parseFloat(item?.firstParamVal).toFixed(2)
                            : ""}
                        </td>
                        <td>
                          {!isNaN(item?.secondParamVal)
                            ? Number.parseFloat(item?.secondParamVal).toFixed(2)
                            : ""}
                        </td>
                        <td
                          style={{
                            color:
                              item.trend === "up"
                                ? "green"
                                : item.trend === "down"
                                ? "red"
                                : "",
                          }}
                        >
                          {!isNaN(item?.ratio)
                            ? Number.parseFloat(item?.ratio).toFixed(2)
                            : ""}{" "}
                          {item.trend === "up" ? (
                            <span>
                              <ArrowUpward />
                            </span>
                          ) : item.trend === "down" ? (
                            <span>
                              <ArrowDownward />
                            </span>
                          ) : null}
                        </td>

                        <td>
                          {inputData?.stockC &&
                            inputData?.stockD &&
                            (!isNaN(item?.thirdParamVal)
                              ? Number.parseFloat(item?.thirdParamVal).toFixed(
                                  2
                                )
                              : "")}
                        </td>
                        <td>
                          {inputData?.stockC &&
                            inputData?.stockD &&
                            (!isNaN(item?.fourthParamVal)
                              ? Number.parseFloat(item?.fourthParamVal).toFixed(
                                  2
                                )
                              : "")}
                        </td>
                        <td
                          style={{
                            color:
                              item.trendThirdFourth === "up"
                                ? "green"
                                : item.trendThirdFourth === "down"
                                ? "red"
                                : "",
                          }}
                        >
                          {inputData?.stockC && inputData?.stockD && (
                            <>
                              {!isNaN(item?.ratioThirdFourth)
                                ? Number.parseFloat(
                                    item?.ratioThirdFourth
                                  ).toFixed(2)
                                : ""}{" "}
                              {item.trendThirdFourth === "up" ? (
                                <span>
                                  <ArrowUpward />
                                </span>
                              ) : item.trendThirdFourth === "down" ? (
                                <span>
                                  <ArrowDownward />
                                </span>
                              ) : null}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {tableData.length > 0 && !viewChart && (
            <Pagination
              currentPage={currentPage}
              totalItems={tableData}
              limit={limit}
              setCurrentPage={setCurrentPage}
              handlePage={handlePage}
            />
          )}
        </div>
        <div
          className="content-wrapper"
          style={{
            padding: "16px",
            display: !viewChart ? "none" : "",
            height: "800px",
          }}
        >
          {/* Tab Buttons */}
          <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
            <Nav fill variant="tabs">
              <Nav.Item>
                <Nav.Link
                  className={`nav-link ${
                    activeTab === "chart" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("chart")}
                >
                  Value Chart
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={`nav-link ${
                    activeTab === "ratioChart" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("ratioChart")}
                >
                  Ratio Chart
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {/* Chart Display */}
          {activeTab === "chart" && (
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOption}
              style={{ height: "800px", width: "100%" }}
            />
          )}
          {activeTab === "ratioChart" && (
            <HighchartsReact
              highcharts={Highcharts}
              options={ratioChartOption}
            />
          )}
        </div>
        {/* <div
          className="content-wrapper"
          style={{ padding: "16px", display: !viewChart ? "none" : "" }}
        >
          <HighchartsReact highcharts={Highcharts} options={chartOption} />
          <HighchartsReact highcharts={Highcharts} options={ratioChartOption} />
        </div> */}
        <Footer />
      </div>
    </>
  );
}
