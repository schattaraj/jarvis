import React, { useRef } from "react";
import Footer from "../../components/footer";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Context } from "../../contexts/Context";
import {
  balanceSheetColumn,
  cashFlowColumn,
  companyOverviewColumns,
  earningsColumn,
  exportToExcel,
  fetchWithInterceptor,
  formatCurrency,
  generatePDF,
  getSortIcon,
  incomeStatementColumn,
  quarterlyEarningsColumn,
  searchTable,
  smaColumn,
  transformData,
} from "../../utils/utils";
import { Pagination } from "../../components/Pagination";
import parse from "html-react-parser";
import SliceData from "../../components/SliceData";
import Swal from "sweetalert2";
import { Form, Modal, Dropdown } from "react-bootstrap";
import HightChart from "../../components/HighChart";
import { FilterAlt } from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StockHistoryModal from "../../components/StockHistoryModal";
import Breadcrumb from "../../components/Breadcrumb";
import { FaGlasses } from "react-icons/fa";
import ReportTable from "../../components/ReportTable";
import { staticStocks } from "../../utils/staticStock";
import Loader from "../../components/loader";
import html2canvas from "html2canvas";
import { PaginationNew } from "../../components/PaginationNew";
import StockHistoryModalNew from "../../components/StockHistoryModalNew";

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
export default function Stocks() {
  const [columnNames, setColumnNames] = useState(companyOverviewColumns);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [activeView, setActiveView] = useState("Ticker Home");
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [tableState, setTableState] = useState("companyOverview");
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [loaderState, setLoaderState] = useState(true);
  const firstColRef = useRef(null);
  const tableContainerRef = useRef(null);
  const [firstColWidth, setFirstColWidth] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchTextC, setSearchTextC] = useState("");
  const [stockPrices, setStockPrices] = useState({});
  const [stockPricesVersion, setStockPricesVersion] = useState(0);
  const [selectedTicker, setSelectedTicker] = useState([]);
  const [tickers, setTickers] = useState(false);
  const context = useContext(Context);
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [rankingData, setRankingData] = useState(false);
  const [dates, setRankingDates] = useState({ date1: null, date2: null });
  const [bestStocksFiltered, setBestStocksFiltered] = useState([]);
  const [worstStocksFiltered, setWorstStocksFiltered] = useState([]);
  const [compareData, setCompareData] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  const [reportTicker, setReportTicker] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState({
    tab: "latest",
    selectedDate: "All",
  });

  const contentRef = useRef(null);
  const toggleDescription = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (compareData && activeView == "History") {
      setRankingData(compareData);
    }
  }, [compareData]);
  console.log(rankingData, activeView);

  const handleTableStateChange = (table) => {
    if (table != tableState) {
      setTableState(table);
      setCurrentPage(1);
    }
  };

  const handleReportData = (data) => {
    setReportTicker(data);
    setReportModal(true);
  };
  const closeReportModal = () => {
    setReportModal(false);
    setActiveTab({ tab: "latest", selectedDate: "All" });
  };

  const fetchTickersFunc = async () => {
    // context.setLoaderState(true)
    try {
      // const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496")
      // const fetchTickersRes = await fetchTickers.json()
      const fetchTickers = `/api/proxy?api=getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496`;
      const fetchTickersRes = await fetchWithInterceptor(fetchTickers, false);
      setTickers(fetchTickersRes);
    } catch (e) {}
    // context.setLoaderState(false)
  };

  const handleSelect = (inputs) => {
    let arr = inputs.map((item) => item.value);
    // setSelectedTicker(arr.join(","));
    setSelectedTicker(arr);
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
      const formData = new FormData();
      formData.append("metaDataName", "Tickers_Watchlist");
      formData.append("myfile", file);
      console.log("formData", formData);
      const uploadRes = await fetchWithInterceptor(
        "/api/proxy?api=uploadFileTickerImport&bodyType=form",
        false,
        false,
        {
          method: "POST",
          // headers: {
          //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          //     'Cache-Control': 'max-age=0',
          //     'Content-Type': 'multipart/form-data',
          //   },
          body: formData,
        }
      );
      // const uploadRes = await upload.json();
      if (uploadRes) {
        Swal.fire({
          title: uploadRes?.message,
          icon: "warning",
          confirmButtonColor: "var(--primary)",
        });
      }
    } catch (error) {
      console.log("Error", error);
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
      // const getBonds = await fetch(`https://jharvis.com/JarvisV2/getHistoryByTickerWatchList?metadataName=Tickers_Watchlist&ticker=${selectedTicker}&_=1722333954367`)
      // const getBondsRes = await getBonds.json()
      const getBonds = `/api/proxy?api=getCompanyOverviewBySymbol`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false, false, {
        method: "POST",
        body: JSON.stringify(selectedTicker),
      });
      setTableData(getBondsRes);
      setFilterData(getBondsRes);
      setActiveView("Ticker Home");
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };

  const ranking = async () => {
    context.setLoaderState(true);

    try {
      // const rankingApi = await fetch(`https://jharvis.com/JarvisV2/getImportHistorySheetCompare?metadataName=Tickers_Watchlist&date1=${dates?.date1 == null ? '1900-01-01' : dates?.date1}&date2=${dates?.date2 == null ? '1900-01-01' : dates?.date2}&_=1719818279196`)
      // const rankingApiRes = await rankingApi.json()
      const api = `/api/proxy?api=getCompanyOverviewCompareByPrice?metadataName=Tickers_Watchlist&date1=${
        dates?.date1 == null ? "1900-01-01" : dates?.date1
      }&date2=${dates?.date2 == null ? "1900-01-01" : dates?.date2}`;
      const rankingApiRes = await fetchWithInterceptor(api, false);
      setRankingData(rankingApiRes);
      setActiveView("Ranking");
    } catch (error) {
      console.log(error);
    }
    setIsExpanded(false);
    context.setLoaderState(false);
  };
  const tickerHome = () => {
    setActiveView("Ticker Home");
    setIsExpanded(false);
  };
  const rankingPDF = async () => {
    context.setLoaderState(true);
    try {
      const getPDFRes = await fetchWithInterceptor(
        `/api/proxy?api=generateTickerRankPDF?metadataName=Tickers_Watchlist&date1=1900-01-01&date2=1900-01-01&_=${new Date().getTime()}`
      );
      // const getPDFRes = await getPDF.json();
      window.open(getPDFRes?.responseStr, "_blank");
    } catch (error) {
      console.log("Error: ", error);
    }
    context.setLoaderState(false);
  };
  const reset = () => {
    setActiveView("Ticker Home");
    setSelectedTicker([]);
    setIsHistoryView(false);
    fetchData();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
        // setContentWidth(`${totalWidth+count}px`);
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

  const searchBestStocks = (e) => {
    const value = e.target.value;
    setBestStocksFiltered(searchTable(rankingData?.bestFiveStocks, value));
  };
  const searchWorstStocks = (e) => {
    const value = e.target.value;
    setWorstStocksFiltered(searchTable(rankingData?.worstFiveStocks, value));
  };

  useEffect(() => {
    if (rankingData?.bestFiveStocks?.length > 0) {
      setBestStocksFiltered(rankingData?.bestFiveStocks);
    }
    if (rankingData?.worstFiveStocks?.length > 0) {
      setWorstStocksFiltered(rankingData?.worstFiveStocks);
    }
  }, [rankingData, activeView]);

  const filterBydate = async (date, filterFor) => {
    context.setLoaderState(true);
    try {
      // const getStocks = await fetch(
      //   `${
      //     process.env.NEXT_PUBLIC_BASE_URL_V2
      //   }getDataByWeek?metadataName=Tickers_Watchlist&date=${date}&_=${new Date().getTime()}`
      // );
      // const getStocksRes = await getStocks.json();

      const getStocksRes = await fetchWithInterceptor(
        filterFor === "companyOverview"
          ? `/api/proxy?api=getCompanyOverviewByDate?date=${date}`
          : filterFor === "incomeStatement"
          ? `/api/proxy?api=getIncomeStatementByDate?date=${date}`
          : filterFor === "balanceSheet"
          ? `/api/proxy?api=getBalanceSheetByDate?date=${date}`
          : filterFor === "cashFlow"
          ? `/api/proxy?api=getCashFlowByDate?date=${date}`
          : filterFor === "quarterlyEarnings"
          ? `/api/proxy?api=getQuarterlyEarningByDate?date=${date}`
          : filterFor === "earnings"
          ? `/api/proxy?api=getEarningByDate?date=${date}`
          : `/api/proxy?api=getSmaTradingByDate?date=${date}`,
        false
      );
      setIsHistoryView(true);
      setTableData(getStocksRes);
      setFilterData(getStocksRes);
      setHistoryModal(false);
    } catch (error) {
      console.log("Error: ", error);
    }
    context.setLoaderState(false);
  };

  const handleCloseModal = () => {
    setHistoryModal(false);
  };

  function transform(node) {
    if (node.type === "tag" && node.name === "img") {
      const originalSrc = node.attribs.src;

      if (originalSrc.startsWith("http://")) {
        node.attribs.src = `/api/image-proxy?path=${encodeURIComponent(
          originalSrc
        )}`;
      }
    }

    return node;
  }

  // const fetchStockPrice = async () => {
  //   try {
  //     const allPrices = {};

  //     // Loop through all pages
  //     for (let page = 0; page < totalPages; page++) {
  //       const getStocks = `/api/proxy?api=getCompanyOverview?symbol=AAL&size=${100}&page=${page}`;

  //       const getStocksRes = await fetchWithInterceptor(getStocks, false);
  //       const newData = getStocksRes?.content || [];

  //       console.log("newData", newData);

  //       // Loop through each stock in this page
  //       for (const element of newData) {
  //         try {
  //           const response = await fetch(
  //             `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${element.Symbol}&interval=1min&apikey=TY1WA5LN5KU3SQIV&datatype=json`
  //           );
  //           const data = await response.json();

  //           if (data["Time Series (1min)"]) {
  //             const firstTimeKey = Object.keys(data["Time Series (1min)"])[0];
  //             const closePrice =
  //               data["Time Series (1min)"][firstTimeKey]["4. close"];

  //             allPrices[element.Symbol] = closePrice;
  //           }
  //         } catch (error) {
  //           console.error(`Error fetching price for ${element.Symbol}`, error);
  //         }
  //       }
  //     }

  //     // After all data is fetched, update state once
  //     setStockPrices((prev) => ({ ...prev, ...allPrices }));
  //   } catch (error) {
  //     console.error("Error in fetchStockPrice:", error);
  //   }
  // };

  useEffect(() => {
    switch (tableState) {
      case "companyOverview":
        fetchData(
          `getCompanyOverview?symbol=AAL&size=${
            limit != "all" ? limit : 100000
          }&page=${currentPage - 1}&keyword=${searchTextC}`
        );
        break;
      case "incomeStatement":
        fetchData("getIncomeStatement");
        break;
      case "balanceSheet":
        fetchData("getBalanceSheet");
        break;
      case "cashFlow":
        fetchData("getCashFlow");
        break;
      case "earnings":
        fetchData("getEarning");
        break;
      case "quarterlyEarnings":
        fetchData("getQuarterlyEarning");
        break;
      case "sma":
        fetchData("getSmaTrading");
        break;
    }
  }, [tableState, currentPage, limit]);

  const filterC = (e) => {
    console.log("search", e.target.value);
    const value = e.target.value;
    setSearchTextC(value);
  };

  useEffect(() => {
    if (searchTextC === "")
      fetchData(
        `getCompanyOverview?symbol=AAL&size=${
          limit != "all" ? limit : 100000
        }&page=${currentPage - 1}&keyword=${searchTextC}`
      );
  }, [searchTextC]);
  useEffect(() => {
    setVisibleColumns(columnNames.map((col) => col));
  }, [columnNames, setColumnNames]);

  useEffect(() => {
    if (firstColRef.current && visibleColumns.includes("Symbol")) {
      setFirstColWidth(firstColRef.current.offsetWidth);
    } else {
      setFirstColWidth(0);
    }
  }, [firstColRef, filterData, visibleColumns]);

  const fetchData = async (
    api = `getCompanyOverview?symbol=AAL&size=${
      limit != "all" ? limit : 100000
    }&page=${currentPage - 1}&keyword=${searchTextC}`
  ) => {
    try {
      context.setLoaderState(true);
      const getBonds = `/api/proxy?api=${api}`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false);

      const newData =
        tableState == "companyOverview" ? getBondsRes?.content : getBondsRes;

      if (tableState === "companyOverview") {
        for (const element of newData) {
          const symbol = element.Symbol;

          // ✅ Skip API call if price already in cache
          if (stockPrices[symbol]) continue;

          try {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&adjusted=false&extended_hours=false&apikey=TY1WA5LN5KU3SQIV&datatype=json`
            );
            const data = await response.json();

            if (data["Time Series (15min)"]) {
              const firstTimeKey = Object.keys(data["Time Series (15min)"])[0];
              const closePrice =
                data["Time Series (15min)"][firstTimeKey]["4. close"];

              setStockPrices((prev) => ({
                ...prev,
                [symbol]: closePrice,
              }));
            }
          } catch (error) {
            console.error(`Error fetching price for ${symbol}`, error);
          }
        }
      }

      setTableData(newData);

      // Apply search filter if searchText exists
      if (searchText) {
        setFilterData(searchTable(newData, searchText));
      } else {
        setFilterData(newData);
      }

      if (tableState === "companyOverview") {
        setTotalPages(getBondsRes.totalPages);
        setTotalElements(getBondsRes.totalElements);
      }
      setActiveView("Ticker Home");
      if (api == "getCompanyOverview?symbol=AAL") {
        setTableState("companyOverview");
        setColumnNames(companyOverviewColumns);
      }
      context.setLoaderState(false);
    } catch (e) {
      console.log("error", e);
    } finally {
      context.setLoaderState(false);
    }
  };

  useEffect(() => {
    // const transformedData = transformData(columnNames, tableData);
    // console.log("transformedData", transformedData);
    context.setFormattedBotData(tableData);
  }, [columnNames, tableData]);

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
    setSearchText(value);
    if (value) {
      setFilterData(searchTable(tableData, value));
    } else {
      setFilterData(tableData);
    }
  };

  const exportPdf = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = 0; // Reset scroll to the initial position
    }
    if (tableData.length > 0) {
      // context.setLoaderState(true);
      const parentDiv = document.createElement("div");
      parentDiv.id = "loader";
      parentDiv.classList.add("loader-container", "flex-column");
      const loaderDiv = document.createElement("div");
      loaderDiv.className = "loader";
      parentDiv.appendChild(loaderDiv);
      document.body.appendChild(parentDiv);

      const input = document.getElementById("my-table");

      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: columnNames.length > 8 ? "landscape" : "portrait",
            format:
              columnNames.length > 15
                ? "a0"
                : columnNames.length > 8
                ? "a3"
                : "a4",
          });
          const headers = columnNames
            .filter((col) => visibleColumns.includes(col))
            .map((col) =>
              col === "Market Capitalization"
                ? "Market Capitalization (Million)"
                : col
            );

          // Table rows
          const rows = filterData.map((rowData) => {
            const rowDataLowercase = Object.fromEntries(
              Object.entries(rowData).map(([key, value], index) => {
                return [
                  key.toLowerCase() === "marketcapitalization"
                    ? "marketcapitalization(million)"
                    : key.toLowerCase() === "price"
                    ? "price($)"
                    : key.toLowerCase(),
                  key.toLowerCase() === "marketcapitalization"
                    ? `$ ${value / 1000}`
                    : key.toLowerCase() === "price"
                    ? stockPrices[rowData["Symbol"]]
                    : value,
                ];
              })
            );

            // console.log("rowData", rowDataLowercase, headers);

            return headers.map((col) => {
              console.log(
                col.toLowerCase().replace(/\s+/g, ""),
                col.toLowerCase().replace(/\s+/g, "") === "pricechange(%)",
                rowDataLowercase["changeprice"]
              );

              return rowDataLowercase[
                col.toLowerCase().replace(/\s+/g, "") === "pricechange(%)"
                  ? "changeprice"
                  : col.toLowerCase().replace(/\s+/g, "")
              ]
                ? rowDataLowercase[
                    col.toLowerCase().replace(/\s+/g, "") === "pricechange(%)"
                      ? "changeprice"
                      : col.toLowerCase().replace(/\s+/g, "")
                  ].toString()
                : "";
            });
          });

          pdf.autoTable({
            head: [headers],
            body: rows,
            startY: 20, // Adjust starting position
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            margin: { top: 10 },
            pageBreak: "auto", // Automatically creates new pages if content overflows
          });

          pdf.save("Table_Report.pdf");
          const loaderDiv = document.getElementById("loader");
          console.log("loderdiv", loaderDiv);

          if (loaderDiv) {
            console.log("loderdiv", loaderDiv);

            loaderDiv.remove();
          }
        })
        .catch((error) => {
          context.setLoaderState(false);
        });
    }
  };
  const changeLimit = (e) => {
    setLimit(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (searchText) {
      setFilterData(searchTable(tableData, searchText));
    } else {
      setFilterData(tableData);
    }
  }, [tableState, searchText]);

  useEffect(() => {
    // fetchStockPrice();

    fetchData();
    fetchTickersFunc();
  }, []);

  useEffect(() => {
    async function run() {
      if (tableState != "companyOverview") {
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
          setFilterData(items);
        }
      }
    }
    // run();
  }, [currentPage, tableData, sortConfig, limit]);

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
      const allColumnNames = columnNames.map((col) => col);
      setVisibleColumns(allColumnNames);
    }
  };

  return (
    <>
      <StockHistoryModalNew
        open={historyModal}
        handleClose={handleCloseModal}
        setCompareData={setCompareData}
        setSelectedOption={setActiveView}
        filterBydate={filterBydate}
        tableState={tableState}
        handleTableStateChange={handleTableStateChange}
        setColumnNames={setColumnNames}
      />
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
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
                    activeView == "History" ? ` active` : ""
                  }`}
                  type="button"
                  title="History"
                  onClick={() => {
                    setHistoryModal(true), setIsExpanded(false);
                  }}
                >
                  <span>History</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    activeView == "Ticker Home" ? ` active` : ""
                  }`}
                  type="button"
                  title="Bond Home"
                  onClick={tickerHome}
                >
                  <span>Ticker Home</span>
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
                {/* <button
                  className={`h-100 collapsible-item${
                    activeView == "Ranking PDF" ? ` active` : ""
                  }`}
                  type="button"
                  title="Ranking PDF"
                  onClick={rankingPDF}
                >
                  <span>Ranking PDF</span>
                </button> */}
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
              <span className="bg-gradient-primary text-white me-2 page-title-icon">
                <i className="mdi mdi-home"></i>
              </span>
              Stocks
            </h3>
          </div>
          <div className="d-flex align-items-center mb-3 justify-content-between selection-area">
            <div className="selection-area d-flex align-items-end w-100">
              <Form
                onSubmit={uploadFile}
                encType="multipart/form-data"
                className="w-100"
              >
                <input
                  type="hidden"
                  name="metaDataName"
                  value="Tickers_Watchlist"
                />
                <div className="d-flex align-items-end flex-wrap">
                  <Select
                    className="mb-0 me-2 col-md-3"
                    isMulti
                    value={
                      selectedTicker &&
                      selectedTicker
                        // .split(",")
                        .map((item) => ({ value: item, label: item }))
                    }
                    onChange={handleSelect}
                    style={{ minWidth: "200px", maxWidth: "300px", flex: "2" }}
                    options={
                      tickers
                        ? tickers.map((item, index) => ({
                            value: item.element1,
                            label: item.element1,
                          }))
                        : [{ value: "Loading", label: "Loading..." }]
                    }
                  />
                  <div className="actions">
                    <button
                      className={"btn btn-primary mb-0"}
                      type="button"
                      onClick={getHistoryByTicker}
                    >
                      <span>Go</span>
                    </button>
                  </div>
                  {/* <div className="form-group me-2">
                                <label htmlFor="uploadFile">Upload File</label>
                                <input id="uploadFile" type="file" name="myfile" className='border-1 form-control' required onChange={handleFileChange} />
                            </div>
                            <div className="actions">
                                <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                            </div> */}
                </div>
              </Form>
            </div>

            <div className="d-flex align-items-center justify-content-center ms-auto mt-1">
              <div className="w-100">
                <button
                  className="d-flex btn-primary buttons-html5 buttons-pdf dt-button"
                  type="button"
                  title="PDF"
                  onClick={() => {
                    exportPdf();
                  }}
                >
                  <span className="mdi mdi-file-pdf-box me-2"></span>
                  <span>PDF</span>
                </button>
              </div>

              <div className="w-100">
                <button
                  className="d-flex btn-primary buttons-excel buttons-html5 dt-button"
                  type="button"
                  title="EXCEL"
                  onClick={() => {
                    exportToExcel();
                  }}
                >
                  <span className="mdi mdi-file-excel me-2"></span>
                  <span>EXCEL</span>
                </button>
              </div>
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
                          checked={visibleColumns.includes(column)}
                          onChange={() => handleColumnToggle(column)}
                          label={column}
                          id={`checkId${column}${index}`}
                        />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          {activeView == "Ticker Home" && (
            <>
              <div className="d-flex justify-content-between">
                <div style={{ width: "60%", overflow: "auto" }}>
                  <div className="d-flex dt-buttons mb-3">
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("companyOverview");
                          setColumnNames(companyOverviewColumns);
                        }}
                        className={`${
                          tableState === "companyOverview"
                            ? "active-table-button"
                            : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        Company Overview
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("incomeStatement");
                          setColumnNames(incomeStatementColumn);
                        }}
                        className={`${
                          tableState === "incomeStatement"
                            ? "active-table-button"
                            : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        Income Statement
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("balanceSheet");
                          setColumnNames(balanceSheetColumn);
                        }}
                        className={`${
                          tableState === "balanceSheet"
                            ? "active-table-button"
                            : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        Balance Sheet
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("cashFlow");
                          setColumnNames(cashFlowColumn);
                        }}
                        className={`${
                          tableState === "cashFlow" ? "active-table-button" : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        Cash Flow
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("quarterlyEarnings");
                          setColumnNames(quarterlyEarningsColumn);
                        }}
                        className={`${
                          tableState === "quarterlyEarnings"
                            ? "active-table-button"
                            : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        Quarterly Earnings
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("earnings");
                          setColumnNames(earningsColumn);
                        }}
                        className={`${
                          tableState === "earnings" ? "active-table-button" : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        Earnings
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          handleTableStateChange("sma");
                          setColumnNames(smaColumn);
                        }}
                        className={`${
                          tableState === "sma" ? "active-table-button" : ""
                        } dt-button table-state-button buttons-html5 btn-primary d-flex`}
                      >
                        SMA (Simple Moving Average)
                      </button>
                    </div>
                  </div>
                </div>
                <div className="d-flex form-group align-items-center">
                  <div className="d-flex form-group align-items-center mb-0 me-3">
                    {/* <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /> */}
                    <label
                      style={{ textWrap: "nowrap" }}
                      className="text-success mb-0 me-2 ms-2"
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
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success mb-0 me-2"
                  >
                    Search :{" "}
                  </label>
                  {tableState === "companyOverview" ? (
                    <div class="input-group">
                      <input
                        type="search"
                        class="form-control"
                        placeholder=""
                        aria-label="search"
                        aria-describedby="basic-addon2"
                        value={searchTextC}
                        onChange={filterC}
                      />
                      <button
                        class="btn-primary"
                        onClick={() => fetchData()}
                        id="basic-addon2"
                      >
                        Search
                      </button>
                    </div>
                  ) : (
                    <input
                      type="search"
                      class="form-control"
                      placeholder=""
                      aria-label="search"
                      aria-describedby="basic-addon2"
                      onChange={filter}
                    />
                  )}
                </div>
              </div>
              {!filterData.length > 0
                ? context.setLoaderState(true)
                : context.setLoaderState(false)}
              <div className="table-responsive" ref={tableContainerRef}>
                <table
                  className="table border dataTable display no-footer stock-table"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="my-table"
                >
                  <thead>
                    <tr>
                      {tableState === "companyOverview"
                        ? companyOverviewColumns.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {/* {getSortIcon(columnName, sortConfig)} */}
                                </th>
                              )
                          )
                        : tableState === "incomeStatement"
                        ? incomeStatementColumn.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {getSortIcon(columnName, sortConfig)}
                                </th>
                              )
                          )
                        : tableState === "balanceSheet"
                        ? balanceSheetColumn.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {getSortIcon(columnName, sortConfig)}
                                </th>
                              )
                          )
                        : tableState === "cashFlow"
                        ? cashFlowColumn.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {getSortIcon(columnName, sortConfig)}
                                </th>
                              )
                          )
                        : tableState === "quarterlyEarnings"
                        ? quarterlyEarningsColumn.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {getSortIcon(columnName, sortConfig)}
                                </th>
                              )
                          )
                        : tableState === "earnings"
                        ? earningsColumn.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {getSortIcon(columnName, sortConfig)}
                                </th>
                              )
                          )
                        : tableState === "sma"
                        ? smaColumn.map(
                            (columnName, index) =>
                              visibleColumns.includes(columnName) && (
                                <th
                                  key={index}
                                  onClick={() => handleSort(columnName)}
                                  className={
                                    index === 0 || index === 1
                                      ? "sticky-column"
                                      : ""
                                  }
                                  style={{
                                    left:
                                      index === 0
                                        ? 0
                                        : index === 1
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                  ref={index === 0 ? firstColRef : null}
                                >
                                  {columnName}{" "}
                                  {getSortIcon(columnName, sortConfig)}
                                </th>
                              )
                          )
                        : false}
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.length > 0 &&
                      filterData?.map((rowData, rowIndex) => {
                        const rowDataLowercase = Object.fromEntries(
                          Object.entries(rowData).map(([key, value]) => [
                            key.toLowerCase(),
                            value,
                          ])
                        );
                        const isAllNull = Object.values(rowDataLowercase).every(
                          (value) => value === null
                        );

                        if (isAllNull) {
                          return null; // Do not render the row if all fields are null
                        }
                        return (
                          <tr
                            key={rowIndex}
                            style={{ overflowWrap: "break-word" }}
                          >
                            {columnNames?.map((columnName, colIndex) => {
                              const colNameLower = columnName
                                .toLowerCase()
                                .replace(/\s+/g, "");
                              if (!visibleColumns.includes(columnName)) {
                                return null;
                              }
                              const columnClass =
                                colNameLower === "symbol"
                                  ? "sticky-column"
                                  : colNameLower === "name"
                                  ? "sticky-column"
                                  : "";

                              let content = (
                                <td
                                  key={colIndex}
                                  className={`${columnClass}`}
                                  style={{
                                    left:
                                      colNameLower === "symbol"
                                        ? 0
                                        : colNameLower === "name"
                                        ? firstColWidth
                                        : "auto",
                                  }}
                                >
                                  {rowDataLowercase[colNameLower] == null ? (
                                    ""
                                  ) : isNaN(rowDataLowercase[colNameLower]) ? (
                                    colNameLower == "symbol" ? (
                                      <div style={{ width: "100px" }}>
                                        {rowData?.logoFileDetails != null &&
                                          parse(
                                            rowData?.logoFileDetails || "",
                                            { replace: transform }
                                          )}
                                        <a
                                          data-toggle="modal"
                                          onClick={() => {
                                            handleReportData(
                                              rowDataLowercase[colNameLower]
                                            );
                                          }}
                                        >
                                          {rowDataLowercase[colNameLower]}
                                        </a>
                                      </div>
                                    ) : (
                                      <div style={{ width: "fit-content" }}>
                                        {rowDataLowercase[colNameLower]}
                                      </div>
                                    )
                                  ) : (
                                    parseFloat(
                                      rowDataLowercase[colNameLower]
                                    ).toFixed(2)
                                  )}
                                </td>
                              );
                              if (colNameLower === "description") {
                                const isExpanded = expandedRows[rowIndex];
                                const description =
                                  rowDataLowercase[colNameLower];
                                const shouldShowButton =
                                  description && description?.length > 165;
                                content = (
                                  <td
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`text-wrap`}
                                    style={{ width: "400px" }}
                                  >
                                    {/* {rowDataLowercase[colNameLower]} */}
                                    <p
                                      style={{
                                        width: "300px",
                                        marginBottom: 0,
                                      }}
                                    >
                                      <span
                                        className="description"
                                        style={{
                                          WebkitLineClamp: `${
                                            isExpanded ? "none" : 3
                                          }`,
                                        }}
                                      >
                                        {description}
                                        {description?.length}
                                      </span>
                                      {shouldShowButton && (
                                        <button
                                          style={{
                                            border: "none",
                                            padding: 0,
                                            background: "transparent",
                                            color: "var(--primary)",
                                          }}
                                          onClick={() =>
                                            toggleDescription(rowIndex)
                                          }
                                        >
                                          {isExpanded
                                            ? "Read Less"
                                            : "Read More"}
                                        </button>
                                      )}
                                    </p>
                                  </td>
                                );
                              }
                              {
                                /* if (colNameLower === "price ($)") {
                                return (
                                  <td key={"keyid" + keyid}>
                                    {Number(
                                      stockPrices[item.element71]
                                    ).toFixed(2) || "Loading..."}
                                  </td>
                                );
                              } */
                              }
                              if (colNameLower === "date") {
                                content = (
                                  <td>
                                    {
                                      rowDataLowercase["lastupdatedat"].split(
                                        "T"
                                      )[0]
                                    }
                                  </td>
                                );
                              }
                              if (colNameLower === "price($)") {
                                content = (
                                  <td>
                                    {isHistoryView
                                      ? rowDataLowercase["price"]
                                      : stockPrices?.[
                                          rowDataLowercase["symbol"]
                                        ] !== undefined
                                      ? Number(
                                          stockPrices[
                                            rowDataLowercase["symbol"]
                                          ]
                                        ).toFixed(2)
                                      : "Loading..."}
                                  </td>
                                );
                              }
                              {
                                /* console.log(rowDataLowercase); */
                              }
                              if (colNameLower === "pricechange(%)") {
                                content = (
                                  <td>
                                    {Number(
                                      rowDataLowercase["changeprice"]
                                    ).toFixed(2)}
                                  </td>
                                );
                              }
                              if (
                                [
                                  "marketcapitalization",
                                  "ebitda",
                                  "bookvalue",
                                  "dividendpershare",
                                  "revenuettm",
                                  "eps",
                                  "grossprofitttm",
                                  "grossprofit",
                                  "totalrevenue",
                                  "operatingincome",
                                  "sellinggeneralandadministrative",
                                  "interestexpense",
                                  "ebit",
                                  "netincome",
                                  "totalliabilities",
                                  "longtermdebt",
                                  "commonstock",
                                  "commonstocksharesoutstanding",
                                  "operatingcashflow",
                                  "capitalexpenditures",
                                  "profitloss",
                                  "paymentsforrepurchaseofcommonstock",
                                ].includes(colNameLower)
                              ) {
                                content = (
                                  <td>
                                    {formatCurrency(
                                      rowDataLowercase[colNameLower]
                                    )}
                                  </td>
                                );
                              }
                              const urlPattern =
                                /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
                              if (
                                urlPattern.test(rowDataLowercase[colNameLower])
                              ) {
                                content = (
                                  <td>
                                    <a
                                      href={rowDataLowercase[colNameLower]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {rowDataLowercase[colNameLower]}
                                    </a>
                                  </td>
                                );
                              }
                              return content;
                            })}
                          </tr>
                        );
                      })}

                    {filterData?.length == 0 && (
                      <tr>
                        <td colSpan={columnNames?.length}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {tableData.length > 0 && tableState === "companyOverview" ? (
                <PaginationNew
                  currentPage={currentPage}
                  totalItems={totalElements}
                  totalPage={totalPages}
                  limit={limit}
                  setCurrentPage={setCurrentPage}
                  handlePage={handlePage}
                />
              ) : (
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
                              <td key={`${columnName}-${index}`}>
                                {item[columnName] === "Infinity"
                                  ? "-"
                                  : item[columnName]}
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
                data={
                  compareData
                    ? compareData?.bestFiveStocks?.map((item) => [
                        item["bestMovedStock"],
                        parseFloat(item["percentageChangeRise"]),
                      ])
                    : bestStocksFiltered?.map((item) => [
                        item["bestMovedStock"],
                        parseFloat(item["percentageChangeRise"]),
                      ])
                }
                title={"Ticker Performance"}
                typeCheck={{
                  categories: compareData
                    ? compareData?.bestFiveStocks?.map(
                        (item) => item?.bestMovedStock
                      )
                    : bestStocksFiltered?.map((item) => item?.bestMovedStock),
                }}
                yAxisTitle={"Risn in %"}
                titleAlign={"center"}
                subTitle={`Best Twenty`}
                chartType="column"
              />
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
                              <td key={`${columnName}-${index}`}>
                                {item[columnName] == "Infinity"
                                  ? "-"
                                  : item[columnName]}
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
                data={
                  compareData
                    ? compareData?.worstFiveStocks?.map((item) => [
                        item["worstMovedStock"],
                        parseFloat(item["percentageChangeDrop"]),
                      ])
                    : worstStocksFiltered?.map((item) => [
                        item["worstMovedStock"],
                        parseFloat(item["percentageChangeDrop"]),
                      ])
                }
                title={"Ticker Performance"}
                typeCheck={{
                  categories: compareData
                    ? compareData?.bestFiveStocks?.map(
                        (item) => item?.bestMovedStock
                      )
                    : worstStocksFiltered?.map((item) => item?.bestMovedStock),
                }}
                yAxisTitle={"Risn in %"}
                titleAlign={"center"}
                subTitle={"Worst Twenty"}
                chartType="column"
              />
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
                              <td key={`${columnName}-${index}`}>
                                {item[columnName] == "Infinity"
                                  ? "-"
                                  : item[columnName]}
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
                title={"Ticker Performance"}
                typeCheck={{
                  categories: compareData?.bestFiveStocks?.map(
                    (item) => item?.bestMovedStock
                  ),
                }}
                yAxisTitle={"Risn in %"}
                titleAlign={"center"}
                subTitle={`Best Twenty`}
                chartType="column"
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
                              <td key={`${columnName}-${index}`}>
                                {item[columnName] == "Infinity"
                                  ? "-"
                                  : item[columnName]}
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
                title={"Ticker Performance"}
                typeCheck={{
                  categories: compareData?.bestFiveStocks?.map(
                    (item) => item?.bestMovedStock
                  ),
                }}
                yAxisTitle={"Risn in %"}
                titleAlign={"center"}
                subTitle={"Worst Twenty"}
                chartType="column"
              />
            </>
          )}
        </div>
      </div>
      <ReportTable
        name={reportTicker}
        open={reportModal}
        handleCloseModal={closeReportModal}
        news={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}
