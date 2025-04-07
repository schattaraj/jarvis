import React, { useRef } from "react";
import Footer from "../../components/footer";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { Context } from "../../contexts/Context";
import {
  exportToExcel,
  fetchWithInterceptor,
  formatCurrency,
  generatePDF,
  getSortIcon,
  searchTable,
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
const companyOverviewColumns = [
  "Symbol",
  "Name",
  "Description",
  "Sector",
  "Industry",
  "Address",
  "Official Site",
  "Market Capitalization",
  "EBITDA",
  "PE Ratio",
  "PEG Ratio",
  "Book Value",
  "Dividend Per Share",
  "Dividend Yield",
  "EPS",
  "Revenue Per Share TTM",
  "Profit Margin",
  "Operating Margin TTM",
  "Return On Assets TTM",
  "Return On Equity TTM",
  "Revenue TTM",
  "Gross Profit TTM",
  "Diluted EPS TTM",
  "Quarterly Earnings Growth YOY",
  "Quarterly Revenue Growth YOY",
  "Analyst Rating Strong Buy",
  "Analyst Rating Buy",
  "Analyst Rating Hold",
  "Analyst Rating Sell",
  "Analyst Rating Strong Sell",
  "Trailing PE",
  "Forward PE",
  "Price To Sales Ratio TTM",
  "Price To Book Ratio",
  "EVTo Revenue",
  "EVTo EBITDA",
  "Beta",
  "52 Week High",
  "52 Week Low",
  "50Day Moving Average",
  "200Day Moving Average",
];

const incomeStatementColumn = [
  "Symbol",
  "Name",
  "Gross Profit",
  "Total Revenue",
  "Operating Income",
  "Selling General And Administrative",
  "Interest Expense",
  "EBIT",
  "EBITDA",
  "Net Income",
];
const balanceSheetColumn = [
  "Symbol",
  "Name",
  "Total Liabilities",
  "Long Term Debt",
  "Common Stock",
  "Common Stock Shares Outstanding",
];
const cashFlowColumn = [
  "Symbol",
  "Name",
  "Operating Cashflow",
  "Capital Expenditures",
  "Profit Loss",
  "Payments For Repurchase Of Common Stock",
  "Dividend Payout Common Stock",
  "Net Income",
];
const quarterlyEarningsColumn = [
  "Symbol",
  "Name",
  "Reported Date",
  "Reported EPS",
  "Estimated EPS",
  "Surprise",
  "Surprise Percentage",
];
const earningsColumn = ["Symbol", "Name", "Fiscal Date Ending", "Reported EPS"];
const smaColumn = [
  "Symbol",
  "Name",
  "Indicator",
  "Last Refreshed",
  "Interval",
  "Time Period",
];

export default function Stocks() {
  const [columnNames, setColumnNames] = useState(companyOverviewColumns);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(false);
  const [tickers, setTickers] = useState(false);
  const [activeView, setActiveView] = useState("Ticker Home");
  const [chartHistory, setChartHistory] = useState([]);
  const [rankingData, setRankingData] = useState(false);
  const [bestStocksFiltered, setBestStocksFiltered] = useState([]);
  const [worstStocksFiltered, setWorstStocksFiltered] = useState([]);
  const [historyModal, setHistoryModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [calculateModal, setCalculate] = useState(false);
  const [tableState, setTableState] = useState("companyOverview");
  const [dateRange, setDateRange] = useState({
    startDate: 2023,
    endDate: 2023,
  });
  const [visibleColumns, setVisibleColumns] = useState([]);

  const [selectedView, setSelectedView] = useState("element3");
  const [chartData, setChartData] = useState([]);
  const [compareData, setCompareData] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [file, setFile] = useState(null);
  const [reportTicker, setReportTicker] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef(null);
  const firstColRef = useRef(null);
  const tableContainerRef = useRef(null);
  const [firstColWidth, setFirstColWidth] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  // const [loaderState, setLoaderState] = useState(false);
  const context = useContext(Context);
  const toggleDescription = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleTableStateChange = (table) => {
    if (table != tableState) {
      switch (table) {
        case "companyOverview":
          fetchData("getCompanyOverview?symbol=AAL");
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
      setTableState(table);
      setCurrentPage(1);
    }
  };
  useEffect(() => {
    setVisibleColumns(columnNames.map((col) => col));
  }, [columnNames, setColumnNames]);

  useEffect(() => {
    if (firstColRef.current) {
      setFirstColWidth(firstColRef.current.offsetWidth);
    }
  }, [firstColRef, filterData, visibleColumns]);
  const handleSelect = (inputs) => {
    let arr = inputs.map((item) => item.value);
    setSelectedTicker(arr.join(","));
  };
  // const getHistoryByTicker = async () => {
  //   if (!selectedTicker) {
  //     Swal.fire({
  //       title: "Please Select a ticker",
  //       confirmButtonColor: "#719B5F",
  //     });
  //     return;
  //   }
  //   try {
  //     // const getBonds = await fetch(`https://jharvis.com/JarvisV2/getHistoryByTickerWatchList?metadataName=Tickers_Watchlist&ticker=${selectedTicker}&_=1722333954367`)
  //     // const getBondsRes = await getBonds.json()
  //     const getBonds = `/api/proxy?api=getCompanyOverview?symbol=${selectedTicker}`;
  //     context.setLoaderState(true);
  //     const getBondsRes = await fetchWithInterceptor(getBonds, false);
  //     setTableData(getBondsRes);
  //     setFilterData(getBondsRes);
  //     setActiveView("Ticker Home");
  //   } catch (e) {
  //     console.log("error", e);
  //   }
  //   context.setLoaderState(false);
  // };
  // const charts = async () => {
  //   setIsExpanded(false);
  //   if (!selectedTicker || selectedTicker.length == 0) {
  //     Swal.fire({
  //       title: "Please Select a Ticker",
  //       confirmButtonColor: "#719B5F",
  //     });
  //     return;
  //   }
  //   context.setLoaderState(true);
  //   try {
  //     const payload = {
  //       ticker: selectedTicker,
  //       year: dateRange?.startDate,
  //       year2: dateRange?.endDate,
  //       metadataName: "Tickers_Watchlist",
  //       _: new Date().getTime(), // This will generate a unique timestamp
  //     };
  //     const queryString = new URLSearchParams(payload).toString();
  //     // const getChartHistrory = await fetch(`https://jharvis.com/JarvisV2/getChartForHistoryByTicker?${queryString}`)
  //     // const getChartHistroryRes = await getChartHistrory.json()
  //     const api = `/api/proxy?api=getChartForHistoryByTicker?${queryString}`;
  //     const getChartHistroryRes = await fetchWithInterceptor(api, false);
  //     console.log("getChartHistroryRes", getChartHistroryRes);
  //     setChartHistory(getChartHistroryRes);
  //     setActiveView("Chart View");
  //     setTableData(getChartHistroryRes);
  //     setFilterData(getChartHistroryRes);
  //     setDateModal(false);
  //   } catch (e) {
  //     console.log("Error", e);
  //   }
  //   context.setLoaderState(false);
  // };
  // const tickerHome = () => {
  //   setActiveView("Ticker Home");
  // };
  // const ranking = async () => {
  //   context.setLoaderState(true);
  //   try {
  //     // const rankingApi = await fetch(`https://jharvis.com/JarvisV2/getImportHistorySheetCompare?metadataName=Tickers_Watchlist&date1=${dates?.date1 == null ? '1900-01-01' : dates?.date1}&date2=${dates?.date2 == null ? '1900-01-01' : dates?.date2}&_=1719818279196`)
  //     // const rankingApiRes = await rankingApi.json()
  //     const api = `/api/proxy?api=getImportHistorySheetCompare?metadataName=Tickers_Watchlist&date1=${
  //       dates?.date1 == null ? "1900-01-01" : dates?.date1
  //     }&date2=${
  //       dates?.date2 == null ? "1900-01-01" : dates?.date2
  //     }&_=1719818279196`;
  //     const rankingApiRes = await fetchWithInterceptor(api, false);
  //     setRankingData(rankingApiRes);
  //     setActiveView("Ranking");
  //   } catch (error) {}
  //   setIsExpanded(false);
  //   context.setLoaderState(false);
  // };
  // const reset = () => {
  //   setActiveView("Ticker Home");
  //   setSelectedTicker(false);
  //   fetchData();
  // };
  // const fetchColumnNames = async () => {
  //   context.setLoaderState(true);
  //   try {
  //     // const columnApi = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getColumns?metaDataName=Tickers_Watchlist`)
  //     // const columnApiRes = await columnApi.json()
  //     const columnApi = `/api/proxy?api=getColumns?metaDataName=Tickers_Watchlist`;
  //     const columnApiRes = await fetchWithInterceptor(columnApi, false);
  //     columnApiRes.push(...extraColumns);
  //     setColumnNames(columnApiRes);
  //     const defaultCheckedColumns = columnApiRes.map(
  //       (col) => col.elementInternalName
  //     );
  //     setVisibleColumns(defaultCheckedColumns);
  //     // fetchData();
  //     // context.setLoaderState(false)
  //   } catch (e) {
  //     console.log("error", e);
  //     context.setLoaderState(false);
  //   }
  // };

  const fetchData = async (api = "getCompanyOverview?symbol=AAL") => {
    // setLoaderState(true);
    try {
      // const getBonds = await fetch(`https://jharvis.com/JarvisV2/getHistoryByTickerWatchList?metadataName=Tickers_Watchlist&ticker=${selectedTicker}&_=1722333954367`)
      // const getBondsRes = await getBonds.json()
      const getBonds = `/api/proxy?api=${api}`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false);
      setTableData(getBondsRes);
      setFilterData(getBondsRes);
      setActiveView("Ticker Home");
      if (api == "getCompanyOverview?symbol=AAL") {
        setTableState("companyOverview");
        setColumnNames(companyOverviewColumns);
      }
      // setLoaderState(false);
    } catch (e) {
      console.log("error", e);
    } finally {
      // setLoaderState(false);
    }
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
  const exportPdf = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = 0; // Reset scroll to the initial position
    }
    if (tableData.length > 0) {
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
          const headers = columnNames.filter((col) =>
            visibleColumns.includes(col)
          );

          // Table rows
          const rows = filterData.map((rowData) => {
            const rowDataLowercase = Object.fromEntries(
              Object.entries(rowData).map(([key, value]) => [
                key.toLowerCase(),
                value,
              ])
            );

            return headers.map((col) =>
              rowDataLowercase[col.toLowerCase().replace(/\s+/g, "")]
                ? rowDataLowercase[
                    col.toLowerCase().replace(/\s+/g, "")
                  ].toString()
                : ""
            );
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
          // const imgProps = pdf.getImageProperties(imgData);
          // const pdfWidth = pdf.internal.pageSize.getWidth();
          // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          // pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          // pdf.save("table.pdf");
          const loaderDiv = document.getElementById("loader");
          if (loaderDiv) {
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
  };
  // const fetchTickersFunc = async () => {
  //   context.setLoaderState(true);
  //   try {
  //     // const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496")
  //     // const fetchTickersRes = await fetchTickers.json()
  //     const fetchTickers = `/api/proxy?api=getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496`;
  //     const fetchTickersRes = await fetchWithInterceptor(fetchTickers, false);
  //     setTickers(fetchTickersRes);
  //     context.setLoaderState(false);
  //   } catch (e) {}
  //   // context.setLoaderState(false)
  // };
  const handleChartView = (e) => {
    setSelectedView(e.target.value);
  };
  const handleDateRange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: Number(e.target.value) });
  };
  // const searchBestStocks = (e) => {
  //   const value = e.target.value;
  //   setBestStocksFiltered(searchTable(rankingData?.bestFiveStocks, value));
  // };
  // const searchWorstStocks = (e) => {
  //   const value = e.target.value;
  //   setWorstStocksFiltered(searchTable(rankingData?.worstFiveStocks, value));
  // };
  const handleCloseModal = () => {
    setHistoryModal(false);
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
      const upload = await fetchWithInterceptor(
        "/api/proxy?api=uploadFileTickerImport",
        false,
        {},
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
      const uploadRes = upload;
      if (upload.status == 400) {
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
  const filterBydate = async (date) => {
    setLoaderState(true);
    try {
      const getStocks = await fetchWithInterceptor(
        `/api/proxy?api=getDataByWeek?metadataName=Tickers_Watchlist&date=${date}&_=${new Date().getTime()}`,
        false
      );
      const getStocksRes = getStocks;
      setTableData(getStocksRes);
      setFilterData(getStocksRes);
      setHistoryModal(false);
    } catch (error) {
      console.log("Error: ", error);
    }
    setLoaderState(false);
  };
  // const rankingPDF = async () => {
  //   context.setLoaderState(true);
  //   try {
  //     const getPDF = await fetchWithInterceptor(
  //       `/api/proxy?api=generateTickerRankPDF?metadataName=Tickers_Watchlist&date1=1900-01-01&date2=1900-01-01&_=${new Date().getTime()}`,
  //       false
  //     );
  //     const getPDFRes = getPDF;
  //     window.open(getPDFRes?.responseStr, "_blank");
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  //   context.setLoaderState(false);
  // };
  // const pdfDownload = async () => {
  //   context.setLoaderState(true);
  //   try {
  //     const getPDF = await fetchWithInterceptor(
  //       `/api/proxy?api=generateTickerPDF?metadataName=Tickers_Watchlist&_=${new Date().getTime()}`,
  //       false
  //     );
  //     const getPDFRes = getPDF;
  //     window.open(getPDFRes?.responseStr, "_blank");
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }
  //   context.setLoaderState(false);
  // };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: value,
  //   }));
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const {
  //     isHighPerforming,
  //     rankWithinTableW,
  //     relativeStrengthW,
  //     priceVs20DAvgW,
  //     salesAvgW,
  //     priceSalesW,
  //     ebitdaW,
  //     grossMarginW,
  //     roicW,
  //     priceEarningW,
  //     priceFreeW,
  //   } = formValues;

  //   // const url = new URL('https://jharvis.com/JarvisV2/getCalculateTicker');
  //   const url = new URL("/api/proxy?api=getCalculateTicker");
  //   url.searchParams.append("metadataName", "Tickers_Watchlist");
  //   url.searchParams.append("date", "");
  //   url.searchParams.append("rankWithinTable", rankWithinTableW || "10");
  //   url.searchParams.append("relativeStrength", relativeStrengthW || "");
  //   url.searchParams.append("priceVs20DAvg", priceVs20DAvgW || "");
  //   url.searchParams.append("salesAvg", salesAvgW || "");
  //   url.searchParams.append("priceSales", priceSalesW || "");
  //   url.searchParams.append("ebitda", ebitdaW || "");
  //   url.searchParams.append("grossMargin", grossMarginW || "");
  //   url.searchParams.append("roic", roicW || "");
  //   url.searchParams.append("priceEarning", priceEarningW || "");
  //   url.searchParams.append("priceFree", priceFreeW || "");
  //   url.searchParams.append("isHighPerforming", isHighPerforming);
  //   context.setLoaderState(true);
  //   try {
  //     const response = await fetchWithInterceptor(url.toString(), false);
  //     const data = response;
  //     if (data.length > 0) {
  //       setTableData(data);
  //       setFilterData(data);
  //       setCalculate(false);
  //     }
  //     if (data.length == 0) {
  //       Swal.fire({ title: "No data found", confirmButtonColor: "#719B5F" });
  //     }
  //     console.log(data); // Handle the response data here
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   context.setLoaderState(false);
  // };
  // const handleReset = () => {
  //   setFormValues(initialFormValues);
  // };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleReportData = (data) => {
    setReportTicker(data);
    setReportModal(true);
  };
  const options = {
    replace: (elememt) => {
      if (elememt?.name === "a") {
        return (
          <a
            onClick={() => {
              handleReportData(elememt?.children[0]?.data);
            }}
            href="#"
          >
            {typeof elememt?.children[0]?.data == "string"
              ? parse(elememt?.children[0]?.data)
              : elememt?.children[0]?.data}
          </a>
        );
      }
    },
  };
  const options2 = {
    replace(elememt) {
      if (elememt?.name == "img") {
        return (
          <React.Fragment>
            <img className="img-responsive" src={elememt?.attribs?.src} />
            <a
              onClick={() => {
                handleReportData(elememt?.next?.children[0]?.data);
              }}
              href="#"
            >
              {typeof elememt?.next?.children[0]?.data == "string"
                ? parse(elememt?.next?.children[0]?.data)
                : elememt?.next?.children[0]?.data}
            </a>
          </React.Fragment>
        );
      }
    },
  };
  // function extractAndConvert(inputString) {
  //   // Define regex patterns to match both cases
  //   const pathAndAnchorRegex = /(.*?\.jpg)\s(<a.*?<\/a>)/;
  //   const onlyPathRegex = /(.*?\.jpg)/;
  //   const onlyAnchorRegex = /(<a.*?<\/a>)/;

  //   // Try to match both path and anchor
  //   const matchPathAndAnchor = inputString.match(pathAndAnchorRegex);
  //   if (matchPathAndAnchor) {
  //     const filePath = matchPathAndAnchor[1];
  //     const anchorTag = matchPathAndAnchor[2];
  //     // Create img tag from file path
  //     // const imgTag = `<img src="https://jharvis.com/JarvisV2/downloadPDF?fileName=${filePath}" alt="Image">${anchorTag}`;
  //     const imgTag = `<img src="${fetchWithInterceptor(
  //       `/api/proxy?api=downloadPDF?fileName=${filePath}`,
  //       false
  //     )}" alt="Image">${anchorTag}`;
  //     return parse(imgTag, options2);
  //   }

  //   // Try to match only file path
  //   const matchOnlyPath = inputString.match(onlyPathRegex);
  //   if (matchOnlyPath) {
  //     const filePath = matchOnlyPath[1];
  //     // Create img tag from file path
  //     // const imgTag = `<img src="https://jharvis.com/JarvisV2/downloadPDF?fileName=${filePath}" alt="Image">`;
  //     const imgTag = `<img src="${fetchWithInterceptor(
  //       `/api/proxy?api=downloadPDF?fileName=${filePath}`,
  //       false
  //     )}" alt="Image">`;
  //     return parse(imgTag);
  //   }

  //   // Try to match only anchor tag
  //   const matchOnlyAnchor = inputString.match(onlyAnchorRegex);
  //   if (matchOnlyAnchor) {
  //     return parse(matchOnlyAnchor[1], options);
  //   }
  //   const pathAndTextRegex = /(.*?\.png)\s*(.*)/;
  //   const matchPathAndText = inputString.match(pathAndTextRegex);
  //   if (matchPathAndText) {
  //     const filePath = matchPathAndText[1];
  //     const additionalText = matchPathAndText[2];
  //     // Create img tag from file path
  //     // const imgTag = `<img src="https://jharvis.com/JarvisV2/downloadPDF?fileName=${filePath}" alt="Image"></br>`;
  //     const imgTag = `<img src="${fetchWithInterceptor(
  //       `/api/proxy?api=downloadPDF?fileName=${filePath}`,
  //       false
  //     )}" alt="Image"></br>`;
  //     // Combine img tag with additional text
  //     const resultHtml = `${imgTag} ${additionalText}`;
  //     return parse(resultHtml); // Adjust parse function as needed
  //   }
  //   // If neither pattern is matched, return an empty array
  //   return inputString;
  // }
  const closeReportModal = () => {
    setReportModal(false);
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
    // fetchColumnNames();
    // fetchTickersFunc();
    fetchData();
  }, []);
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
        setFilterData(items);
      }
    }
    run();
  }, [currentPage, tableData, sortConfig, limit]);
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
      const allColumnNames = columnNames.map((col) => col);
      setVisibleColumns(allColumnNames);
    }
  };
  // console.log("transformed Cols: " + transformedColumns, visibleColumns);

  return (
    <>
      {/* {loaderState && <Loader />} */}
      {/* <StockHistoryModal
        open={historyModal}
        handleClose={handleCloseModal}
        setCompareData={setCompareData}
        setSelectedOption={setActiveView}
        filterBydate={filterBydate}
      /> */}
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <Breadcrumb />
            {/* <div
              className={`collapsible-container ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <span>{activeView + " :"}</span>
              <button
                className="btn-primary main-button ms-2"
                onClick={toggleExpand}
              >
                <i
                  className={
                    isExpanded
                      ? "mdi mdi-chevron-right"
                      : "mdi mdi-chevron-left"
                  }
                ></i>
                +7 Action
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
                <button
                  className={`h-100 collapsible-item${
                    activeView == "Ranking PDF" ? ` active` : ""
                  }`}
                  type="button"
                  title="Ranking PDF"
                  onClick={rankingPDF}
                >
                  <span>Ranking PDF</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    activeView == "Calculate" ? ` active` : ""
                  }`}
                  type="button"
                  title="Calculate"
                  onClick={() => {
                    setCalculate(true), setIsExpanded(false);
                  }}
                >
                  <span>Calculate</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    activeView == "Chart View" ? ` active` : ""
                  }`}
                  type="button"
                  title="Chart View"
                  onClick={charts}
                >
                  <span>Chart View</span>
                </button>
                <button
                  className="collapsible-item h-100"
                  type="button"
                  title="Reset"
                  onClick={reset}
                >
                  <span>Reset</span>
                </button>
              </div>
            </div> */}
          </div>
          <div className="page-header">
            <h3 className="page-title">
              <span className="bg-gradient-primary text-white me-2 page-title-icon">
                <i className="mdi mdi-home"></i>
              </span>
              Stocks
            </h3>
          </div>
          <div className="d-flex align-items-center mb-3 selection-area">
            {/* <Form
              onSubmit={uploadFile}
              encType="multipart/form-data"
              className="d-none w-100"
            >
              <input
                type="hidden"
                name="metaDataName"
                value="Tickers_Watchlist"
              />
              <div className="d-flex flex-wrap align-items-end mb-3">
                <Select
                  className="col-md-3 mb-0 me-2"
                  isMulti
                  value={
                    selectedTicker &&
                    selectedTicker
                      .split(",")
                      .map((item) => ({ value: item, label: item }))
                  }
                  onChange={handleSelect}
                  style={{ minWidth: "200px", maxWidth: "300px", flex: "2" }}
                  options={
                    tickers && tickers.length > 0
                      ? tickers?.map((item, index) => ({
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
                <div className="form-group me-2">
                  <label htmlFor="uploadFile">Upload File</label>
                  <input
                    id="uploadFile"
                    type="file"
                    name="myfile"
                    className="form-control border-1"
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
            </Form> */}

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
          {/* <div className="d-flex mb-3">
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={() => { setCalculate(true) }}><span>Calculate</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Chart View" && " active")} type="button" onClick={charts}><span>Chart View</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ticker Home" && " active")} type="button" onClick={tickerHome}><span>Ticker Home</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ranking" && " active")} type="button" onClick={ranking}><span>Ranking</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={rankingPDF}><span>Ranking PDF</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary" + (activeView == "History" && " active")} type="button" title="History" onClick={() => { setHistoryModal(true) }}><span>History</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="PDF" onClick={pdfDownload}><span>PDF</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="Reset" onClick={reset}><span>Reset</span></button>
                    </div> */}
          {activeView == "Ticker Home" && (
            <>
              <div className="d-flex justify-content-between">
                <div style={{ width: "100%", overflow: "auto" }}>
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
                  <input
                    type="search"
                    placeholder=""
                    className="form-control"
                    onChange={filter}
                  />
                </div>
              </div>
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
                                  {getSortIcon(columnName, sortConfig)}
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
                      {/* {columnNames.map(
                        (columnName, index) =>
                          visibleColumns.includes(
                            columnName.elementInternalName
                          ) && (
                            <th
                              key={index}
                              onClick={() =>
                                handleSort(columnName.elementInternalName)
                              }
                              className={
                                columnName.elementInternalName === "element1" ||
                                columnName.elementInternalName === "element4"
                                  ? "sticky-column"
                                  : ""
                              }
                              style={{
                                left:
                                  columnName.elementInternalName === "element1"
                                    ? 0
                                    : columnName.elementInternalName ===
                                      "element4"
                                    ? firstColWidth
                                    : "auto",
                              }}
                              ref={
                                columnName.elementInternalName === "element1"
                                  ? firstColRef
                                  : null
                              }
                            >
                              {columnName.elementDisplayName}{" "}
                              {getSortIcon(columnName, sortConfig)}
                            </th>
                          )
                      )} */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {tableState === "companyOverview" ? ( */}
                    {/*please uncomment this upper check if symbol and name is different for each tableState, and add this check for each tableState, otherwise not required. along with this line uncomment line 1630 to 1634*/}
                    {
                      filterData.length > 0 &&
                        filterData?.map((rowData, rowIndex) => {
                          const rowDataLowercase = Object.fromEntries(
                            Object.entries(rowData).map(([key, value]) => [
                              key.toLowerCase(),
                              value,
                            ])
                          );
                          const isAllNull = Object.values(
                            rowDataLowercase
                          ).every((value) => value === null);

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
                                    ) : isNaN(
                                        rowDataLowercase[colNameLower]
                                      ) ? (
                                      colNameLower == "symbol" ? (
                                        <div style={{ width: "100px" }}>
                                          {rowData?.logoFileDetails != null &&
                                            parse(rowData?.logoFileDetails)}
                                          <p>
                                            {rowDataLowercase[colNameLower]}
                                          </p>
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
                                  urlPattern.test(
                                    rowDataLowercase[colNameLower]
                                  )
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
                        })
                      //) : (
                      // <tr>
                      // <td colSpan={columnNames?.length}>No data available</td>
                      //</tr>
                      //)
                    }
                    {/* <tr>
                      <td colSpan={columnNames?.length}>No data available</td>
                    </tr> */}
                    {/* {filterData?.map((rowData, rowIndex) => (
                        <tr key={rowIndex} style={{ overflowWrap: "break-word" }}>
                        {columnNames.map((columnName, colIndex) => {
                          if (
                            !visibleColumns.includes(
                              columnName.elementInternalName
                            )
                          )
                            return null;
                          let content;

                          if (columnName.elementInternalName === "element3") {
                            // content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                            content = rowData[columnName.elementInternalName];
                          } else if (
                            columnName.elementInternalName === "lastUpdatedAt"
                          ) {
                            content = new Date(
                              rowData[columnName.elementInternalName]
                            ).toLocaleDateString();
                          } else if (
                            columnName.elementInternalName === "element1"
                          ) {
                            content = extractAndConvert(
                              rowData[columnName.elementInternalName]
                            );
                          } else if (
                            columnName.elementInternalName === "element1"
                          ) {
                            content = parse(
                              rowData[columnName.elementInternalName],
                              options2
                            );
                          } else if (
                            columnName.elementInternalName === "element31" ||
                            columnName.elementInternalName === "element34" ||
                            columnName.elementInternalName === "element35" ||
                            columnName.elementInternalName === "element7" ||
                            columnName.elementInternalName === "element8" ||
                            columnName.elementInternalName === "element9" ||
                            columnName.elementInternalName === "element11" ||
                            columnName.elementInternalName === "element12" ||
                            columnName.elementInternalName === "element13" ||
                            // columnName.elementInternalName ==='element15' ||
                            // columnName.elementInternalName ==='element16' ||
                            // columnName.elementInternalName ==='element17'||
                            columnName.elementInternalName === "element30"
                          ) {
                            content = (
                              Number.parseFloat(
                                rowData[columnName.elementInternalName]
                              ) * 100 || 0
                            ).toFixed(2);
                          } else if (
                            columnName.elementInternalName === "element19"
                          ) {
                            // content = (rowData[columnName.elementInternalName] / 1000000000)
                            content =
                              rowData[columnName.elementInternalName] &&
                              (
                                rowData[columnName.elementInternalName] / 1000
                              ).toFixed(2);
                          } else {
                            content = rowData[columnName.elementInternalName];
                          }
                          if (
                            typeof content == "string" &&
                            columnName.elementInternalName != "element1"
                          ) {
                            content = parse(content, options);
                          }
                          // if(columnName.elementInternalName === 'element1'){
                          //     return <td key={colIndex} className={}>{content}</td>;
                          // }
                          return (
                            <td
                              key={colIndex}
                              className={
                                columnName.elementInternalName === "element1" ||
                                columnName.elementInternalName === "element4"
                                  ? "sticky-column"
                                  : ""
                              }
                              style={{
                                left:
                                  columnName.elementInternalName === "element1"
                                    ? 0
                                    : columnName.elementInternalName ===
                                      "element4"
                                    ? firstColWidth
                                    : "auto",
                              }}
                            >
                              {content}
                            </td>
                          );
                        })}
                      </tr> 
                    ))}*/}
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
        </div>
      </div>
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
