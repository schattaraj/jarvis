import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../contexts/Context";
import parse from "html-react-parser";
import {
  exportToExcel,
  fetchWithInterceptor,
  formatDate,
  getSortIcon,
  searchTable,
} from "../../utils/utils";
import EtfHistoryModal from "../../components/EtfHistoryModal";
import { Pagination } from "../../components/Pagination";
import SliceData from "../../components/SliceData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Select from "react-select";
import { utils } from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { generatePDF } from "../../utils/utils";
import HightChart from "../../components/HighChart";
import Swal from "sweetalert2";
import { Form, Modal, Dropdown } from "react-bootstrap";
import { FilterAlt } from "@mui/icons-material";
import Breadcrumb from "../../components/Breadcrumb";
import ReportTable from "../../components/ReportTable";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const extraColumns = [
  {
    elementId: null,
    elementName: "Date",
    elementInternalName: "lastUpdatedAt",
    elementDisplayName: "Date",
    elementType: null,
    metadataName: "Everything_List_New",
    isAmountField: 0,
    isUniqueField: 0,
    isSearchCriteria: 0,
    isVisibleInDashboard: 0,
    isCurrencyField: 0,
  },
];

// const options = {
//     responsive: true,
//     plugins: {
//         legend: {
//             position: 'top',
//         },
//         title: {
//             display: true,
//             text: 'Chart.js Line Chart',
//         },
//     },
// };
const bestFiveStockColumn = {
  company: "Company",
  bestMovedStock: "Most Risen Stock",
  bestMovedBy: "Price Risen By",
  percentageChangeRise: "% In Rise",
  bestMoveCurrValue: "Current Price",
  bestMovePrevValue: "Previous Price",
};
const worstFiveStockColumn = {
  company: "Company",
  worstMovedStock: "Most Dropped Stock",
  worstMovedBy: "Price Dropped By",
  percentageChangeRise: "% In Drop",
  worstMoveCurrValue: "Current Price",
  worstMovePrevValue: "Previous Price",
};
export default function Etfs() {
  const context = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [portfolioNames, setPortfolioNames] = useState([]);
  const [selectedPortfolioId, setPortfolioId] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);
  const [allStocks, setAllStocks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [tickers, setTickers] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(false);
  const [chartView, setChartView] = useState(false);
  const [chartHistory, setChartHistory] = useState([]);
  const [file, setFile] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(
    columnNames.map((col) => col.elementInternalName)
  );
  const [ViewOptions, setViewOptions] = useState({
    element7: "Price vs 20-day Avg (%)",
    element8: "Price",
    element9: "YTD Return",
    element10: "Dividend Yield",
    element11: "Short as % of Float",
    element16: "Relative Strength",
    element17: "Price/Earnings",
  });
  const [rankingData, setRankingData] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: 2023,
    endDate: 2023,
  });
  const [selectedView, setSelectedView] = useState("element7");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [dateModal, setDateModal] = useState(false);
  const [bestStocksFiltered, setBestStocksFiltered] = useState([]);
  const [worstStocksFiltered, setWorstStocksFiltered] = useState([]);
  const [dates, setRankingDates] = useState({ date1: null, date2: null });
  const [compareData, setCompareData] = useState(false);
  const [activeView, setActiveView] = useState("ETF Home");
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [reportTicker, setReportTicker] = useState("");
  const contentRef = useRef(null);
  const handleOpenModal = () => {
    setIsExpanded(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const options = {
    replace: (elememt) => {
      if (elememt.name === "a") {
        // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
        return (
          <a
            onClick={() => {
              handleClick(elememt.children[0].data);
            }}
            href="#"
          >
            {parse(elememt.children[0].data)}
          </a>
        );
      }
    },
  };

  // https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1705052752517
  const fetchColumnNames = async () => {
    try {
      const columnApi = await fetch(
        "https://jharvis.com/JarvisV2/getColumns?metaDataName=Everything_List_New"
      );
      const columnApiRes = await columnApi.json();
      columnApiRes.push(...extraColumns);
      setColumnNames(columnApiRes);
      const defaultCheckedColumns = columnApiRes.map(
        (col) => col.elementInternalName
      );
      setVisibleColumns(defaultCheckedColumns);
    } catch (e) {
      console.log("error", e);
    }
  };

  // https://www.jharvis.com/JarvisV2/getImportsData?metaDataName=Bondpricing_Master&_=1705052752518
  const fetchData = async () => {
    context.setLoaderState(true);
    try {
      const getBonds = await fetch(
        "https://jharvis.com/JarvisV2/getImportsData?metaDataName=Everything_List_New&_=1705403290395"
      );
      const getBondsRes = await getBonds.json();
      setTableData(getBondsRes);
      setFilterData(getBondsRes);
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };
  const getHistoryByTicker = async () => {
    if (!selectedTicker) {
      Swal.fire({
        title: "Please Select a ticker",
        confirmButtonColor: "#719B5F",
      });
      return;
    }
    context.setLoaderState(true);
    try {
      const getBonds = await fetch(
        `https://jharvis.com/JarvisV2/getHistoryByTickerWatchList?metadataName=Everything_List_New&ticker=${selectedTicker}&_=1722333954367`
      );
      const getBondsRes = await getBonds.json();
      setTableData(getBondsRes);
      setFilterData(getBondsRes);
      setChartView(false);
      setRankingData(false);
      setActiveView("ETF Home");
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };
  const filter = (e) => {
    const value = e.target.value;
    setFilterData(searchTable(tableData, value));
  };
  const exportPdf = () => {
    if (tableData.length > 0) {
      const doc = new jsPDF();

      autoTable(doc, { html: "#my-table" });

      doc.save("table.pdf");
    }
  };
  const downloadReport = async (reportName) => {
    try {
      const fetchReport = await fetch(
        "https://jharvis.com/JarvisV2/downloadTickerReport?fileName=" +
          reportName
      );
      const fetchReportRes = await fetchReport.json();
      window.open(fetchReportRes.responseStr, "_blank");
    } catch (e) {}
  };
  const deleteReport = async (reportName) => {
    try {
      const deleteApi = await fetch(
        "https://jharvis.com/JarvisV2/deletePortfolioByName?name=" + reportName
      );
      const deleteApiRes = await deleteApi.json();
      alert(deleteApiRes.msg);
    } catch (e) {}
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
  const handleSelect = (inputs) => {
    let arr = inputs.map((item) => item.value);
    setSelectedTicker(arr.join(","));
  };
  const fetchTickersFunc = async () => {
    context.setLoaderState(true);
    try {
      // const fetchTickers = await fetch(
      //   "https://jharvis.com/JarvisV2/getAllTicker?metadataName=Everything_List_New&_=1718886601496"
      // );
      // const fetchTickersRes = await fetchTickers.json();
      const fetchTickers = `/api/proxy?api=getAllTicker?metadataName=Everything_List_New&_=1718886601496`
      const fetchTickersRes = await fetchWithInterceptor(fetchTickers,false)
      setTickers(fetchTickersRes);
    } catch (e) {}
    context.setLoaderState(false);
  };
  const charts = async () => {
    setIsExpanded(false);
    if (!selectedTicker) {
      Swal.fire({
        title: "Please Select a ticker",
        confirmButtonColor: "#719B5F",
      });
      return;
    }
    setDateModal(false);
    context.setLoaderState(true);
    try {
      const getChartHistrory = await fetch(
        "https://jharvis.com/JarvisV2/getChartForHistoryByTicker?metadataName=Everything_List_New&ticker=" +
          selectedTicker +
          `&year=${dateRange?.startDate}&year2=${dateRange?.endDate}&_=1718886601497`
      );
      const getChartHistroryRes = await getChartHistrory.json();
      setChartHistory(getChartHistroryRes);
      setChartView(true);
      setActiveView("Chart View");
    } catch (e) {}
    context.setLoaderState(false);
  };
  const etfHome = () => {
    setIsExpanded(false);
    setChartView(false);
    setRankingData(false);
    setActiveView("ETF Home");
  };
  const data = {
    labels: chartHistory.map((item) => formatDate(item.lastUpdatedAt)),
    datasets: [
      {
        label: ViewOptions[selectedView],
        data: chartData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const handleChange = (e) => {
    setSelectedView(e.target.value);
  };
  const ranking = async () => {
    setIsExpanded(false);
    context.setLoaderState(true);
    try {
      const rankingApi = await fetch(
        `https://jharvis.com/JarvisV2/getImportHistorySheetCompare?metadataName=Everything_List_New&date1=${
          dates?.date1 == null ? "1900-01-01" : dates?.date1
        }&date2=${
          dates?.date2 == null ? "1900-01-01" : dates?.date2
        }&_=1719818279196`
      );
      const rankingApiRes = await rankingApi.json();
      setChartView(false);
      setRankingData(rankingApiRes);
      setActiveView("Ranking");
    } catch (error) {}
    context.setLoaderState(false);
  };
  const changeLimit = (e) => {
    setLimit(e.target.value);
  };
  const handleSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
  };
  const uploadFile = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    context.setLoaderState(true);
    try {
      //   const formData = new FormData(form);
      const formData = new FormData();
      formData.append("metaDataName", "Everything_List_New");
      formData.append("myfile", file);
      const uploadRes = await fetchWithInterceptor(
        "/api/proxy?api=uploadFileEveryThing",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      console.log("uploadRes", uploadRes);

      // const uploadRes = await upload.json()
      if (uploadRes.statusCode == 2000) {
        Swal.fire({
          title: uploadRes?.message,
          icon: "warning",
          confirmButtonColor: "var(--primary)",
        });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setFile(null);
    }
    context.setLoaderState(false);
  };
  const handleDateRange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: Number(e.target.value) });
  };
  const searchBestStocks = (e) => {
    const value = e.target.value;
    setBestStocksFiltered(searchTable(rankingData?.bestFiveStocks, value));
  };
  const searchWorstStocks = (e) => {
    const value = e.target.value;
    setWorstStocksFiltered(searchTable(rankingData?.worstFiveStocks, value));
  };
  const reset = () => {
    setIsExpanded(false);
    setSelectedTicker(false);
    fetchData();
  };
  const filterBydate = async (date) => {
    context.setLoaderState(true);
    try {
      const getStocks = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL_V2
        }getDataByWeek?metadataName=Everything_List_New&date=${date}&_=${new Date().getTime()}`
      );
      const getStocksRes = await getStocks.json();
      setTableData(getStocksRes);
      setFilterData(getStocksRes);
      setOpenModal(false);
    } catch (error) {
      console.log("Error: ", error);
    }
    context.setLoaderState(false);
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleReportData = (data) => {
    setReportTicker(data);
    setReportModal(true);
  };
  const closeReportModal = () => {
    setReportModal(false);
  };
  useEffect(() => {
    if (screen.width < 576) {
      if (isExpanded) {
        let max = 0;
        Array.from(contentRef.current.children).map((item) => {
          if (max < item.getBoundingClientRect().width) {
            max = item.getBoundingClientRect().width;
          }
        });
        setContentWidth(`${max + 8}px`);
        return;
      } else {
        setContentWidth(`0px`);
      }
    }
    if (isExpanded) {
      if (contentRef.current) {
        let count = 0;
        const totalWidth = Array.from(contentRef.current.children).reduce(
          (acc, child) => {
            count = count + 6;
            return acc + child.getBoundingClientRect().width;
          },
          0
        );
        setContentWidth(`${totalWidth + count}px`);
      }
    } else {
      if (contentRef.current) {
        const totalWidth = Array.from(contentRef.current.children).reduce(
          (acc, child) => {
            return acc + child.getBoundingClientRect().width;
          },
          0
        );
        setContentWidth(`${0}px`);
      }
    }
  }, [isExpanded]);
  useEffect(() => {
    async function run() {
      if (tableData.length > 0) {
        let items = [...tableData];
        if (sortConfig !== null) {
          items.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
          });
        }
        let dataLimit = limit;
        let page = currentPage;
        if (dataLimit == "all") {
          dataLimit = tableData?.length;
          page = 1;
        }
        items = await SliceData(page, dataLimit, items);
        // console.log("items",items)
        setFilterData(items);
      }
    }
    run();
  }, [currentPage, tableData, limit, sortConfig]);
  useEffect(() => {
    setChartData(chartHistory.map((item) => parseFloat(item[selectedView])));
    //console.log("data", [...new Set(chartHistory.map(item => Math.round(item.element7)))])
  }, [chartHistory, selectedView]);
  useEffect(() => {
    if (rankingData?.bestFiveStocks?.length > 0) {
      setBestStocksFiltered(rankingData?.bestFiveStocks);
    }
    if (rankingData?.worstFiveStocks?.length > 0) {
      setWorstStocksFiltered(rankingData?.worstFiveStocks);
    }
  }, [rankingData, activeView]);
  useEffect(() => {
    fetchTickersFunc();
    fetchColumnNames();
    fetchData();
  }, []);
  useEffect(() => {
    if (compareData && activeView == "History") {
      setRankingData(compareData);
    }
  }, [compareData, activeView]);

  const handleColumnToggle = (column) => {
    setVisibleColumns((prevState) =>
      prevState.includes(column)
        ? prevState.filter((col) => col !== column)
        : [...prevState, column]
    );
  };

  const handleAllCheckToggle = () => {
    if (visibleColumns.length === columnNames.length) {
      setVisibleColumns([]);
    } else {
      const allColumnNames = columnNames.map((col) => col.elementInternalName);
      setVisibleColumns(allColumnNames);
    }
  };

  return (
    <>
      <div>
        <EtfHistoryModal
          open={openModal}
          handleCloseModal={handleCloseModal}
          setCompareData={setCompareData}
          setRankingDates={setRankingDates}
          setActiveView={setActiveView}
          filterBydate={filterBydate}
        />
      </div>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <Breadcrumb />
            <div
              className={`collapsible-container ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <span>{activeView + " :"}</span>
              <button
                className="main-button ms-2 btn-primary"
                onClick={toggleExpand}
              >
                <i
                  className={
                    isExpanded
                      ? "mdi mdi-chevron-right"
                      : "mdi mdi-chevron-left"
                  }
                ></i>
                +4 Action
              </button>
              <div
                className="collapsible-content"
                style={{ maxWidth: "max-content", width: contentWidth }}
                ref={contentRef}
              >
                <button
                  className={`h-100 collapsible-item ${
                    activeView == `Chart View` ? `active` : ""
                  }`}
                  type="button"
                  onClick={charts}
                >
                  <span>Chart View</span>
                </button>
                <button
                  className={`h-100 collapsible-item ${
                    activeView == "History" ? ` active` : ""
                  }`}
                  type="button"
                  title="History"
                  onClick={handleOpenModal}
                >
                  <span>History</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    activeView == "ETF Home" ? ` active` : ""
                  }`}
                  type="button"
                  title="Bond Home"
                  onClick={etfHome}
                >
                  <span>ETF Home</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    activeView == "Ranking" ? ` active` : ""
                  }`}
                  type="button"
                  title="Ranking"
                  onClick={ranking}
                >
                  <span>Ranking</span>
                </button>
                <button
                  className="h-100  collapsible-item"
                  type="button"
                  title="Reset"
                  onClick={reset}
                >
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>
              ETFs
            </h3>
          </div>
          <Form
            onSubmit={uploadFile}
            className="mt-2"
            encType="multipart/form-data"
          >
            <input
              type="hidden"
              name="metaDataName"
              value="Everything_List_New"
            />
            <div className="selection-area mb-3 d-flex align-items-end flex-wrap">
              <div className="form-group" style={{ flex: "1" }}>
                <Select
                  className="mb-0 me-2"
                  isMulti
                  value={
                    selectedTicker &&
                    selectedTicker
                      .split(",")
                      .map((item) => ({ value: item, label: item }))
                  }
                  onChange={handleSelect}
                  options={
                    tickers &&
                    tickers.map((item, index) => ({
                      value: item.element1,
                      label: item.element1,
                    }))
                  }
                />
              </div>
              <button
                className={"btn btn-primary me-2"}
                type="button"
                onClick={getHistoryByTicker}
              >
                <span>Go</span>
              </button>
              {/* <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (chartView && " active")} type="button" onClick={charts}><span>Chart View</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "ETF Home" && " active")} type="button" onClick={etfHome}><span>ETF Home</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ranking" && " active")} type="button" onClick={ranking}><span>Ranking</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary" + (activeView == "History" && " active")} type="button" title="History" onClick={handleOpenModal}><span>History</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="Reset" onClick={reset}><span>Reset</span></button> */}

              <div className="form-group me-2" style={{ flex: "1" }}>
                <label htmlFor="uploadFile">Upload File</label>
                <input
                  id="uploadFile"
                  type="file"
                  name="myfile"
                  className="border-1 form-control"
                  required
                  onChange={handleFileChange}
                />
              </div>

              <div className="actions">
                <button className="btn btn-primary mb-0" type="submit">
                  Upload
                </button>
              </div>
            </div>
          </Form>
          {/* </div> */}
          {activeView == "ETF Home" && (
            <div className="d-flex justify-content-between">
              <div className="dt-buttons mb-3">
                <button
                  className="dt-button buttons-pdf buttons-html5 btn-primary"
                  type="button"
                  title="PDF"
                  onClick={() => {
                    generatePDF();
                  }}
                >
                  <span className="mdi mdi-file-pdf-box me-2"></span>
                  <span>PDF</span>
                </button>
                <button
                  className="dt-button buttons-excel buttons-html5 btn-primary"
                  type="button"
                  onClick={() => {
                    exportToExcel();
                  }}
                >
                  <span className="mdi mdi-file-excel me-2"></span>
                  <span>EXCEL</span>
                </button>
                <div className="column-selector">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="btn btn-primary mb-0"
                      id="dropdown-basic"
                    >
                      Columns
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      style={{
                        width: "160px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        marginTop: "1px",
                      }}
                    >
                      <Dropdown.Item
                        as="label"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          display: "inline-block",
                          width: "100%",
                          padding: "6px",
                          fontWeight: "bold",
                        }}
                        className="columns-dropdown-item"
                      >
                        <Form.Check
                          type="checkbox"
                          checked={visibleColumns.length === columnNames.length}
                          onChange={handleAllCheckToggle}
                          label="Select All"
                          id={`${activeView}-selectAll`}
                        />
                      </Dropdown.Item>
                      {columnNames.map((column, index) => (
                        <Dropdown.Item
                          as="label"
                          key={index}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            display: "inline-block",
                            width: "100%",
                            padding: "6px",
                          }}
                          className="columns-dropdown-item"
                        >
                          <Form.Check
                            type="checkbox"
                            checked={visibleColumns.includes(
                              column.elementInternalName
                            )}
                            onChange={() =>
                              handleColumnToggle(column.elementInternalName)
                            }
                            label={column.elementDisplayName}
                            id={`checkId${column.elementDisplayName}${index}`}
                          />
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              {!chartView && (
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
                  <label
                    style={{ textWrap: "nowrap" }}
                    className="text-success ms-2 me-2 mb-0"
                  >
                    Show :{" "}
                  </label>
                  <select
                    name="limit"
                    className="form-select w-auto"
                    onChange={changeLimit}
                    value={limit}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="all">All</option>
                  </select>
                </div>
              )}
            </div>
          )}
          {activeView == "Chart View" && (
            <>
              <div className="form-group d-flex align-items-center">
                <label htmlFor="" className="me-2 mb-0 form-label">
                  Chart View:
                </label>
                <select
                  className="form-select"
                  style={{ maxWidth: "300px" }}
                  onChange={handleChange}
                >
                  {Object.entries(ViewOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <button className="ms-2 btn btn-primary" onClick={charts}>
                  GO
                </button>
                <div className="d-flex align-items-center mx-2">
                  <label className="mb-0">
                    <b>{`Year : ${dateRange?.startDate} - ${dateRange?.endDate}`}</b>
                  </label>
                  <button
                    className="ms-2 btn p-0 text-primary"
                    onClick={() => {
                      setDateModal(true);
                    }}
                    type="button"
                  >
                    <FilterAlt />
                  </button>
                </div>
              </div>
              {/* <h3>Chart View For {ViewOptions[selectedView]}</h3> */}
              {/* <BarChart data={data} /> */}
              {chartHistory.length > 0 && (
                <HightChart
                  data={chartHistory?.map((item) => [
                    new Date(item["lastUpdatedAt"]).getTime(),
                    parseFloat(item[selectedView]),
                  ])}
                  title={
                    ViewOptions[selectedView] &&
                    `Chart View For ${ViewOptions[selectedView]}`
                  }
                />
              )}
            </>
          )}
          {activeView == "Ranking" && (
            <>
              <h3 className="mb-3">Best Stocks</h3>
              <div className="d-flex justify-content-between align-items-center">
                <div className="dt-buttons mb-3">
                  <button
                    className="dt-button buttons-pdf buttons-html5 btn-primary"
                    type="button"
                    title="PDF"
                    onClick={() => {
                      generatePDF();
                    }}
                  >
                    <span className="mdi mdi-file-pdf-box me-2"></span>
                    <span>PDF</span>
                  </button>
                  <button
                    className="dt-button buttons-excel buttons-html5 btn-primary"
                    type="button"
                    onClick={() => {
                      exportToExcel();
                    }}
                  >
                    <span className="mdi mdi-file-excel me-2"></span>
                    <span>EXCEL</span>
                  </button>
                </div>
                <div className="form-group d-flex align-items-center">
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success me-2 mb-0"
                  >
                    Search :{" "}
                  </label>
                  <input
                    type="search"
                    placeholder=""
                    className="form-control"
                    onChange={searchBestStocks}
                  />
                  {/* <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select> */}
                </div>
              </div>
              <div className="table-responsive mb-4">
                <table
                  className="table border display no-footer dataTable"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="my-table"
                >
                  <thead>
                    <tr>
                      {Object.entries(bestFiveStockColumn).map(
                        ([columnName, displayName]) => (
                          <th key={columnName}>{displayName}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bestStocksFiltered.map((item, index) => {
                      return (
                        <tr key={"best" + index}>
                          {Object.entries(bestFiveStockColumn).map(
                            ([columnName, displayName]) => (
                              <td key={item[columnName] + index}>
                                {item[columnName]}
                              </td>
                            )
                          )}
                        </tr>
                      );
                    })}
                    {bestStocksFiltered?.length == 0 && (
                      <tr>
                        <td
                          className="text-center"
                          colSpan={Object.entries(bestFiveStockColumn)?.length}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h3 className="mb-3">Worst Stocks</h3>
              <div className="d-flex justify-content-between align-items-center">
                <div className="dt-buttons mb-3">
                  <button
                    className="dt-button buttons-pdf buttons-html5 btn-primary"
                    type="button"
                    title="PDF"
                    onClick={() => {
                      generatePDF();
                    }}
                  >
                    <span className="mdi mdi-file-pdf-box me-2"></span>
                    <span>PDF</span>
                  </button>
                  <button
                    className="dt-button buttons-excel buttons-html5 btn-primary"
                    type="button"
                    onClick={() => {
                      exportToExcel();
                    }}
                  >
                    <span className="mdi mdi-file-excel me-2"></span>
                    <span>EXCEL</span>
                  </button>
                </div>
                <div className="form-group d-flex align-items-center">
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success me-2 mb-0"
                  >
                    Search :{" "}
                  </label>
                  <input
                    type="search"
                    placeholder=""
                    className="form-control"
                    onChange={searchWorstStocks}
                  />
                  {/* <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select> */}
                </div>
              </div>
              <div className="table-responsive mb-4">
                <table
                  className="table border display no-footer dataTable"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="my-table"
                >
                  <thead>
                    <tr>
                      {Object.entries(worstFiveStockColumn).map(
                        ([columnName, displayName]) => (
                          <th key={columnName}>{displayName}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {worstStocksFiltered.map((item, index) => {
                      return (
                        <tr key={"worst" + index}>
                          {Object.entries(worstFiveStockColumn).map(
                            ([columnName, displayName]) => (
                              <td key={item[columnName] + index}>
                                {item[columnName]}
                              </td>
                            )
                          )}
                        </tr>
                      );
                    })}
                    {worstStocksFiltered?.length == 0 && (
                      <tr>
                        <td
                          className="text-center"
                          colSpan={Object.entries(worstFiveStockColumn)?.length}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {activeView == "ETF Home" && (
            <>
              <div className="table-responsive">
                <table
                  className="table border display no-footer dataTable"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="my-table"
                >
                  <thead>
                    <tr>
                      {columnNames.map(
                        (columnName, index) =>
                          visibleColumns.includes(
                            columnName.elementInternalName
                          ) && (
                            <th
                              key={index}
                              onClick={() =>
                                handleSort(columnName.elementInternalName)
                              }
                            >
                              {columnName.elementDisplayName}{" "}
                              {getSortIcon(columnName, sortConfig)}
                            </th>
                          )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((rowData, rowIndex) => (
                      <tr key={rowIndex} style={{ overflowWrap: "break-word" }}>
                        {columnNames.map((columnName, colIndex) => {
                          if (
                            !visibleColumns.includes(
                              columnName.elementInternalName
                            )
                          )
                            return null;
                          let content;
                          if (columnName.elementInternalName === "element1") {
                            return (
                              <td key={colIndex}>
                                <a
                                  onClick={() => {
                                    handleReportData(
                                      rowData[columnName.elementInternalName]
                                    );
                                  }}
                                >
                                  {rowData[columnName.elementInternalName]}
                                </a>
                              </td>
                            );
                          }
                          if (columnName.elementInternalName === "element3") {
                            // content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                            content = rowData[columnName.elementInternalName];
                          } else if (
                            columnName.elementInternalName === "lastUpdatedAt"
                          ) {
                            content = new Date(
                              rowData[columnName.elementInternalName]
                            ).toLocaleDateString();
                          } else {
                            content = rowData[columnName.elementInternalName];
                          }

                          return <td key={colIndex}>{content}</td>;
                        })}
                      </tr>
                    ))}
                    {filterData?.length == 0 && (
                      <tr>
                        <td colSpan={columnNames?.length}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {tableData.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={tableData}
                  limit={limit}
                  setCurrentPage={setCurrentPage}
                  handlePage={handlePage}
                />
              )}
            </>
          )}
          {activeView == "History" && (
            <>
              <h3 className="mb-3">Best Stocks</h3>
              <div className="d-flex justify-content-between align-items-center">
                <div className="dt-buttons mb-3">
                  <button
                    className="dt-button buttons-pdf buttons-html5 btn-primary"
                    type="button"
                    title="PDF"
                    onClick={() => {
                      generatePDF();
                    }}
                  >
                    <span className="mdi mdi-file-pdf-box me-2"></span>
                    <span>PDF</span>
                  </button>
                  <button
                    className="dt-button buttons-excel buttons-html5 btn-primary"
                    type="button"
                    onClick={() => {
                      exportToExcel();
                    }}
                  >
                    <span className="mdi mdi-file-excel me-2"></span>
                    <span>EXCEL</span>
                  </button>
                </div>
                <div className="form-group d-flex align-items-center">
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success me-2 mb-0"
                  >
                    Search :{" "}
                  </label>
                  <input
                    type="search"
                    placeholder=""
                    className="form-control"
                    onChange={searchBestStocks}
                  />
                  {/* <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select> */}
                </div>
              </div>
              <div className="table-responsive mb-4">
                <table
                  className="table border display no-footer dataTable"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="my-table"
                >
                  <thead>
                    <tr>
                      {Object.entries(bestFiveStockColumn).map(
                        ([columnName, displayName]) => (
                          <th key={columnName}>{displayName}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bestStocksFiltered.map((item, index) => {
                      return (
                        <tr key={"best" + index}>
                          {Object.entries(bestFiveStockColumn).map(
                            ([columnName, displayName]) => (
                              <td key={item[columnName] + index}>
                                {item[columnName]}
                              </td>
                            )
                          )}
                        </tr>
                      );
                    })}
                    {bestStocksFiltered?.length == 0 && (
                      <tr>
                        <td
                          className="text-center"
                          colSpan={Object.entries(bestFiveStockColumn)?.length}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <HightChart
                data={compareData?.bestFiveStocks?.map((item) => [
                  item["bestMovedStock"],
                  parseFloat(item["percentageChangeRise"]),
                ])}
                title={"Stock Performance"}
                typeCheck={{
                  categories: compareData?.bestFiveStocks?.map(
                    (item) => item?.bestMovedStock
                  ),
                }}
                yAxisTitle={"Risn in %"}
                titleAlign={"center"}
                subTitle={`Best Twenty`}
              />
              <h3 className="my-3">Worst Stocks</h3>
              <div className="d-flex justify-content-between align-items-center">
                <div className="dt-buttons mb-3">
                  <button
                    className="dt-button buttons-pdf buttons-html5 btn-primary"
                    type="button"
                    title="PDF"
                    onClick={() => {
                      generatePDF("worst-stock-table");
                    }}
                  >
                    <span className="mdi mdi-file-pdf-box me-2"></span>
                    <span>PDF</span>
                  </button>
                  <button
                    className="dt-button buttons-excel buttons-html5 btn-primary"
                    type="button"
                    onClick={() => {
                      exportToExcel();
                    }}
                  >
                    <span className="mdi mdi-file-excel me-2"></span>
                    <span>EXCEL</span>
                  </button>
                </div>
                <div className="form-group d-flex align-items-center">
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success me-2 mb-0"
                  >
                    Search :{" "}
                  </label>
                  <input
                    type="search"
                    placeholder=""
                    className="form-control"
                    onChange={searchWorstStocks}
                  />
                  {/* <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select> */}
                </div>
              </div>
              <div className="table-responsive mb-4">
                <table
                  className="table border display no-footer dataTable"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="worst-stock-table"
                >
                  <thead>
                    <tr>
                      {Object.entries(worstFiveStockColumn).map(
                        ([columnName, displayName]) => (
                          <th key={columnName}>{displayName}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {worstStocksFiltered.map((item, index) => {
                      return (
                        <tr key={"worst" + index}>
                          {Object.entries(worstFiveStockColumn).map(
                            ([columnName, displayName]) => (
                              <td key={item[columnName] + index}>
                                {item[columnName]}
                              </td>
                            )
                          )}
                        </tr>
                      );
                    })}
                    {worstStocksFiltered?.length == 0 && (
                      <tr>
                        <td
                          className="text-center"
                          colSpan={Object.entries(worstFiveStockColumn)?.length}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <HightChart
                data={compareData?.worstFiveStocks?.map((item) => [
                  item["worstMovedStock"],
                  parseFloat(item["percentageChangeDrop"]),
                ])}
                title={"Stock Performance"}
                typeCheck={{
                  categories: compareData?.bestFiveStocks?.map(
                    (item) => item?.bestMovedStock
                  ),
                }}
                yAxisTitle={"Risn in %"}
                titleAlign={"center"}
                subTitle={"Worst Twenty"}
              />
            </>
          )}
        </div>
      </div>
      <Modal
        show={dateModal}
        onHide={() => {
          setDateModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <select
                  name="startDate"
                  id="startDate"
                  className="form-select"
                  value={dateRange?.startDate}
                  onChange={handleDateRange}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <select
                  name="endDate"
                  id="endDate"
                  className="form-select"
                  value={dateRange?.endDate}
                  onChange={handleDateRange}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={charts}>
            Apply
          </button>
        </Modal.Footer>
      </Modal>
      <ReportTable
        name={reportTicker}
        open={reportModal}
        handleCloseModal={closeReportModal}
        news={true}
      />
      {isExpanded && <div className="backdrop"></div>}
    </>
  );
}
