import React, { useContext, useEffect, useRef, useState } from "react";
import Navigation from "../../../components/navigation";
import Sidebar from "../../../components/sidebar";
import Loader from "../../../components/loader";
import { Context } from "../../../contexts/Context";
import parse from "html-react-parser";
import {
  calculateAverage,
  exportToExcel,
  fetchWithInterceptor,
  getSortIcon,
  searchTable,
  transformData,
} from "../../../utils/utils";
import { getImportsData } from "../../../utils/staticData";
import BondsHistoryModal from "../../../components/BondHstoryModal";
import {
  Autocomplete,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  TextField,
} from "@mui/material";
import Select from "react-select";
import BondChart from "../../../components/charts";
import { Pagination } from "../../../components/Pagination";
import SliceData from "../../../components/SliceData";
import HightChart from "../../../components/HighChart";
import { Dropdown, Form, Modal } from "react-bootstrap";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FilterAlt } from "@mui/icons-material";
import { useRouter } from "next/router";
import Breadcrumb from "../../../components/Breadcrumb";
import { elements } from "chart.js";
import ReportTable from "../../../components/ReportTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PaginationNew } from "../../../components/PaginationNew";
import HightChartOZero from "../../../components/HighChartOzero";
const extraColumns = [
  {
    elementId: null,
    elementName: "Stock",
    elementInternalName: "element98",
    elementDisplayName: "Stock",
    elementType: null,
    metadataName: "Bondpricing_Master",
    isAmountField: 0,
    isUniqueField: 0,
    isSearchCriteria: 0,
    isVisibleInDashboard: 0,
    isCurrencyField: 0,
  },
  {
    elementId: null,
    elementName: "Jarvis Rank",
    elementInternalName: "element99",
    elementDisplayName: "Jarvis Rank",
    elementType: null,
    metadataName: "Bondpricing_Master",
    isAmountField: 0,
    isUniqueField: 0,
    isSearchCriteria: 0,
    isVisibleInDashboard: 0,
    isCurrencyField: 0,
  },
  {
    elementId: null,
    elementName: "Date",
    elementInternalName: "lastUpdatedAt",
    elementDisplayName: "Date",
    elementType: null,
    metadataName: "Bondpricing_Master",
    isAmountField: 0,
    isUniqueField: 0,
    isSearchCriteria: 0,
    isVisibleInDashboard: 0,
    isCurrencyField: 0,
  },
];

export default function Bonds() {
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
  const [selectedOption, setSelectedOption] = useState("Bond Home");
  const [stocks, setStocks] = useState([]);
  const [selectedBond, setSelectedBond] = useState([]);
  const [chartData, setChartData] = useState();
  const [callChart, setCallChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageOld, setCurrentPageOld] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [compareData, setCompareData] = useState(false);
  const [risenStocks, setRisenStocks] = useState([]);
  const [risenStocksFiltered, setRisenStocksFiltered] = useState([]);
  const [dropStocks, setDropStocks] = useState([]);
  const [dropStocksFiltered, setDropStocksFiltered] = useState([]);
  const [rankingData, setRankingData] = useState(false);
  const [calculateModal, setCalculateModal] = useState(false);
  const [rating, setRating] = useState([]);
  const [treasuryYield, setTreasuryYield] = useState("");
  const [year, setYear] = useState("Any");
  const [maturityMin, setMaturityMin] = useState("Any");
  const [maturityMax, setMaturityMax] = useState("Any");
  const [ytwMin, setYtwMin] = useState("Any");

  const [ytwMax, setYtwMax] = useState("Any");
  const [callable, setCallable] = useState("Any");
  const [secured, setSecured] = useState("Any");
  const [tickers, setTickers] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: 2020,
    endDate: 2025,
  });
  const [chartHistory, setChartHistory] = useState([]);
  const [ViewOptions, setViewOptions] = useState({
    element9: "Price",
    element3: "YTW",
  });
  const [selectedView, setSelectedView] = useState("element9");
  const [dateModal, setDateModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileDate, setFileDate] = useState("");
  const [reportTicker, setReportTicker] = useState("");
  const [selectedTickerName, setSelectedTickerName] = useState(false);
  const [tickerModal, setTickerModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const tableContainerRef = useRef(null);
  const [companyTicker, setCompanyTicker] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columnNames.map((col) => col.elementInternalName)
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const contentRef = useRef(null);
  const router = useRouter();
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleStockChange = (event) => {
    setSelectedBond(event.target.value);
  };

  const option = [
    "Select an Option",
    "History",
    "PDF",
    "Bond Home",
    "Ranking",
    "Calculate",
    "Grid View",
    "Chart View",
    "Reset Bond Details",
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
    setIsExpanded(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSelectClick = async () => {
    const payload = {
      ticker: selectedBond.map((r) => r.value.split("-")[1]).join(","),
      metadataName: "Bondpricing_Master",
      _: new Date().getTime(),
    };

    const queryString = new URLSearchParams(payload).toString();
    context.setLoaderState(true);
    try {
      // const getBonds = await fetch(
      //   `https://www.jharvis.com/JarvisV2/getHistoryByTickerBond?${queryString}`
      // );
      // const getBondsRes = await getBonds.json();
      const getBonds = `/api/proxy?api=getHistoryByTickerBond?${queryString}`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false);
      setTableData(getBondsRes);
      setFilterData(getBondsRes);
      setSelectedOption("Bond Home");
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };

  const handleChartView = () => [];
  const handleClick = (data) => {
    console.log("handleClick", data);
  };
  const handleSelect = (inputs) => {
    let arr = inputs.map((item) => item.value);
    setSelectedTicker(arr.join(","));
  };
  const fetchCompanyTickers = async () => {
    try {
      const fetchTickers = `/api/proxy?api=getAllTicker?metadataName=Bondpricing_Master&ticker=onlyTicker`;
      const fetchTickersRes = await fetchWithInterceptor(fetchTickers, false);
      setCompanyTicker(fetchTickersRes);
    } catch (e) {}
  };

  const sliceTableData = (fullData) => {
    // Set total elements for pagination
    setTotalElements(fullData.length);

    // Calculate total pages
    const calculatedTotalPages = Math.ceil(
      fullData.length / (limit !== "all" ? limit : fullData.length)
    );
    setTotalPages(calculatedTotalPages);

    // Set the full data
    setTableData(fullData);

    // Apply pagination by slicing the data
    const startIndex =
      (currentPage - 1) * (limit !== "all" ? limit : fullData.length);
    const endIndex = Math.min(
      startIndex + (limit !== "all" ? limit : fullData.length),
      fullData.length
    );

    // Set the filtered data with pagination applied
    setFilterData(fullData.slice(startIndex, endIndex));
  };

  const getHistoryByTicker = async () => {
    if (!companyTicker) {
      Swal.fire({
        title: "Please Select a ticker",
        confirmButtonColor: "#719B5F",
      });
      return;
    }
    context.setLoaderState(true);
    try {
      const payload = {
        ticker: selectedTicker,
        metadataName: "Bondpricing_Master",
        _: new Date().getTime(),
      };

      const queryString = new URLSearchParams(payload).toString();
      const getBonds = `/api/proxy?api=getHistoryByTickerBondByTickerName?${queryString}`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false);

      // Store the full data set
      const fullData = getBondsRes;

      // Set total elements for pagination
      setTotalElements(fullData.length);

      // Calculate total pages
      const calculatedTotalPages = Math.ceil(
        fullData.length / (limit !== "all" ? limit : fullData.length)
      );
      setTotalPages(calculatedTotalPages);

      // Set the full data
      setTableData(fullData);

      // Apply pagination by slicing the data
      const startIndex =
        (currentPage - 1) * (limit !== "all" ? limit : fullData.length);
      const endIndex = Math.min(
        startIndex + (limit !== "all" ? limit : fullData.length),
        fullData.length
      );

      // Set the filtered data with pagination applied
      setFilterData(fullData.slice(startIndex, endIndex));
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };
  const handleReportData = (data) => {
    const regex = /\(([^)]+)\)$/;
    const match = data.match(regex);
    setReportTicker(match ? match[1] : "");
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
      // return <></>
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
  // https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1705052752517
  const fetchColumnNames = async () => {
    context.setLoaderState(true);
    try {
      // const columnApi = await fetch(
      //   "https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1705052752517"
      // );
      // const columnApiRes = await columnApi.json();
      const columnApi = `/api/proxy?api=getColumns?metaDataName=Bondpricing_Master&_=1705052752517`;
      const columnApiRes = await fetchWithInterceptor(columnApi, false);
      columnApiRes.push(...extraColumns);
      setColumnNames(columnApiRes);
      const defaultCheckedColumns = columnApiRes.map(
        (col) => col.elementInternalName
      );
      setVisibleColumns(defaultCheckedColumns);
      fetchData();
    } catch (e) {
      console.log("error", e);
      context.setLoaderState(false);
    }
  };

  const fetchData = async () => {
    context.setLoaderState(true);
    try {
      // const getBonds = await fetch(
      //   "https://www.jharvis.com/JarvisV2/getImportsData?metaDataName=Bondpricing_Master&_=1705052752518"
      // );
      // const getBondsRes = await getBonds.json();

      //uncomment for v3
      const getBonds = `/api/proxy?api=getImportsData?metaDataName=Bondpricing_Master&pageNumber=${
        currentPage - 1
      }&pageSize=${limit != "all" ? limit : 20000}&_=1705052752518`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false);
      setTableData(getBondsRes?.content);
      setFilterData(getBondsRes?.content);
      setStocks(getBondsRes?.content);
      setTotalPages(getBondsRes.totalPages);
      setTotalElements(getBondsRes.totalElements);
      console.log("data");
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };

  useEffect(() => {
    const transformedData = transformData(columnNames, tableData);
    console.log(tableData);
    console.log("transformedData", transformedData);
    context.setFormattedBotData(transformedData);
  }, [columnNames, tableData]);

  const getWeeklyData = async (importDate) => {
    context.setLoaderState(true);
    try {
      const result = await fetchWithInterceptor(
        `/api/proxy?api=getDataByWeek?metadataName=Bondpricing_Master&date=${importDate}&_=1744265661813`
      );
      // const result = await response.json();
      setTableData(result);
      setFilterData(result);
      setStocks(result);
      // console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setOpenModal(false);
    }
    context.setLoaderState(false);
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
            visibleColumns.includes(col.elementInternalName)
          );

          const pdfColumns = headers.map((col) => col.elementDisplayName);

          // Table rows
          const rows = filterData.map((rowData) => {
            return headers.map((col) =>
              rowData[col.elementInternalName]
                ? rowData[col.elementInternalName].toString()
                : ""
            );
          });
          console.log("rows", rows);
          pdf.autoTable({
            head: [pdfColumns],
            body: rows,
            startY: 20, // Adjust starting position
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            margin: { top: 10 },
            pageBreak: "auto", // Automatically creates new pages if content overflows
          });

          pdf.save("Bond_Table_Report.pdf");
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
  const downloadReport = async (reportName) => {
    try {
      const fetchReportRes = await fetchWithInterceptor(
        "/api/proxy?api=downloadTickerReport?fileName=" + reportName
      );
      // const fetchReportRes = await fetchReport.json();
      window.open(fetchReportRes.responseStr, "_blank");
    } catch (e) {}
  };
  const deleteReport = async (reportName) => {
    try {
      const deleteApiRes = await fetchWithInterceptor(
        "/api/proxy?api=deletePortfolioByName?name=" + reportName,
        false,
        false,
        { method: "DELETE" }
      );
      // const deleteApiRes = await deleteApi.json();
      alert(deleteApiRes.msg);
    } catch (e) {}
  };

  const getTickerCartDtata = async () => {
    try {
      const tickerName = selectedBond.map((item) => item.element1);
      const apiUrl = `/api/proxy?api=getChartForHistoryByTicker?metadataName=Bondpricing_Master&ticker=${encodeURIComponent(
        tickerName
      )}&year=2023&year2=2023`;

      const data = await fetchWithInterceptor(apiUrl);
      // const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
  const handlePageOld = async (action) => {
    switch (action) {
      case "prev":
        setCurrentPageOld(currentPageOld - 1);
        break;
      case "next":
        setCurrentPageOld(currentPageOld + 1);
        break;
      default:
        setCurrentPageOld(currentPageOld);
        break;
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

  const filterBestStocks = (e) => {
    const value = e.target.value;
    setRisenStocksFiltered(searchTable(risenStocks, value));
  };
  const filterWorstStocks = (e) => {
    const value = e.target.value;
    setDropStocksFiltered(searchTable(dropStocks, value));
  };
  const ranking = async () => {
    context.setLoaderState(true);
    try {
      const rankingApiRes = await fetchWithInterceptor(
        `/api/proxy?api=getImportHistorySheetCompare?metadataName=Bondpricing_Master&date1=1900-01-01&date2=1900-01-01&_=1719818279196`
      );
      // const rankingApiRes = await rankingApi.json();
      setRankingData(rankingApiRes);
      setCompareData(rankingApiRes);
      setSelectedOption("Ranking");
      setIsExpanded(false);
    } catch (error) {
      console.log("Erorr 258", error);
    }
    context.setLoaderState(false);
  };
  const handleSearch = async () => {
    const payload = {
      couponMin: "",
      couponMax: "",
      rating: rating.map((r) => r.value).join(","),
      treasuryYield,
      treasuryYr: year,
      ytwMin,
      ytwMax,
      maturityMin,
      maturityMax,
      callable,
      secured,
      metadataName: "Bondpricing_Master",
      _: new Date().getTime(), // This will generate a unique timestamp
    };

    const queryString = new URLSearchParams(payload).toString();
    console.log("queryString", queryString);
    const url = `/api/proxy?api=getCalculateBond?${queryString}`;
    context.setLoaderState(true);
    try {
      const data = await fetchWithInterceptor(url);
      // const data = await response.json();
      // setTableData(data);
      // setFilterData(data);
      setCalculateModal(false);
      setSelectedOption("Calculate");

      sliceTableData(data);

      console.log(data); // Handle the response data here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    context.setLoaderState(false);
  };

  const charts = async () => {
    setIsExpanded(false);
    if (!selectedBond || selectedBond.length == 0) {
      Swal.fire({ title: "Please Select Bond", confirmButtonColor: "#719B5F" });
      return;
    }
    context.setLoaderState(true);
    try {
      const payload = {
        ticker: selectedBond.map((r) => r.value.split("-")[1]).join(","),
        year: dateRange?.startDate,
        year2: dateRange?.endDate,
        metadataName: "Bondpricing_Master",
        _: new Date().getTime(), // This will generate a unique timestamp
      };
      const queryString = new URLSearchParams(payload).toString();
      const getChartHistroryRes = await fetchWithInterceptor(
        `/api/proxy?api=getChartForHistoryByTicker?${queryString}`
      );
      // const getChartHistroryRes = await getChartHistrory.json();
      console.log("getChartHistroryRes", getChartHistroryRes);
      setChartHistory(getChartHistroryRes);
      setSelectedOption("Chart View");
      setDateModal(false);
      setTableData(getChartHistroryRes);
      setFilterData(getChartHistroryRes);
    } catch (e) {}
    context.setLoaderState(false);
  };
  const fetchTickersFunc = async () => {
    context.setLoaderState(true);
    try {
      // const fetchTickers = await fetch(
      //   "https://jharvis.com/JarvisV2/getAllTicker?metadataName=Bondpricing_Master&_=" +
      //     new Date().getTime()
      // );
      // const fetchTickersRes = await fetchTickers.json();
      const fetchTickers = `/api/proxy?api=getAllTicker?metadataName=Bondpricing_Master&_=${new Date().getTime()}`;
      const fetchTickersRes = await fetchWithInterceptor(fetchTickers, false);
      setTickers(fetchTickersRes);
      fetchColumnNames();
    } catch (e) {
      console.log("Error: ", e);
      context.setLoaderState(false);
    }
    // context.setLoaderState(false)
  };
  const handleDateRange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: Number(e.target.value) });
  };
  const gridView = () => {
    setSelectedOption("Grid View");
    setIsExpanded(false);
  };
  const bondHome = () => {
    setSelectedOption("Bond Home");
    setIsExpanded(false);
    fetchData();
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
      formData.append("metaDataName", "Bondpricing_Master");
      console.log(fileDate);

      formData.append("fileDate", fileDate);
      formData.append("myfile", file);
      console.log("formData", formData);
      const accessToken = localStorage.getItem("access_token");
      const options = { body: formData, method: "POST" };
      const defaultHeaders = {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      };
      options.headers = {
        ...defaultHeaders,
        ...options.headers,
      };
      const uploadRes = await fetchWithInterceptor(
        "/api/proxy?api=uploadFileBondImport&bodyType=form",
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
      // if (upload.status == 200) {
      if (uploadRes.status === "success") {
        setFile(null);
        setFileDate("");
        // Reset file input field
        const fileInput = document.getElementById("uploadFile");
        if (fileInput) {
          fileInput.value = "";
        }
        // Reset date input field
        const dateInput = document.querySelector('input[name="fileDate"]');
        if (dateInput) {
          dateInput.value = "";
        }
        Swal.fire({
          title: uploadRes.message,
          icon: "success",
          confirmButtonColor: "var(--secondary)",
          timer: 2000,
        });
      } else {
        Swal.fire({
          title: uploadRes.message,
          icon: "error",
          confirmButtonColor: "var(--primary)",
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
    context.setLoaderState(false);
  };
  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
  };
  const changeLimit = (e) => {
    setLimit(e.target.value);
  };
  function extractAndConvert(inputString) {
    // Define regex patterns to match both cases
    const pathAndAnchorRegex = /(.*?\.jpg|.*?\.png|.*?\.svg)\s(<a.*?<\/a>)/;
    const onlyPathRegex = /(.*?\.jpg|.*?\.png|.*?\.svg)/;
    const onlyAnchorRegex = /(<a.*?<\/a>)/;

    // Try to match both path and anchor
    const matchPathAndAnchor = inputString.match(pathAndAnchorRegex);
    if (matchPathAndAnchor) {
      const filePath = matchPathAndAnchor[1];
      const anchorTag = matchPathAndAnchor[2];
      // Create img tag from file path
      const imgTag = `<img src="/api/proxy?api=downloadPDF?fileName=${encodeURIComponent(
        filePath
      )}" alt="Image"  loading="lazy">`;
      return (
        <>
          {parse(imgTag)}
          {parse(anchorTag, options)}
        </>
      );
    }

    // Try to match only file path
    const matchOnlyPath = inputString.match(onlyPathRegex);
    if (matchOnlyPath) {
      const filePath = matchOnlyPath[1];
      // Create img tag from file path
      const imgTag = `<img src="/api/proxy?api=downloadPDF?fileName=${filePath}" alt="Image">`;
      return parse(imgTag);
    }

    // Try to match only anchor tag
    const matchOnlyAnchor = inputString.match(onlyAnchorRegex);
    if (matchOnlyAnchor) {
      return parse(matchOnlyAnchor[1], options);
    }
    const pathAndTextRegex = /(.*?\.png)\s*(.*)/;
    const matchPathAndText = inputString.match(pathAndTextRegex);
    if (matchPathAndText) {
      const filePath = matchPathAndText[1];
      const additionalText = matchPathAndText[2];
      // Create img tag from file path
      const imgTag = `<img src="/api/proxy?api=downloadPDF?fileName=${filePath}" alt="Image"></br>`;
      // Combine img tag with additional text
      const resultHtml = `${imgTag} ${additionalText}`;
      return parse(resultHtml); // Adjust parse function as needed
    }
    // If neither pattern is matched, return an empty array
    return inputString;
  }
  const ParsedHtml = ({ htmlString }) => {
    const options = {
      replace: (domNode) => {
        if (
          domNode.name === "img" &&
          domNode.attribs &&
          domNode.attribs.src.startsWith("http://")
        ) {
          const updatedSrc = `/api/image-proxy?path=${encodeURIComponent(
            domNode.attribs.src
          )}`;
          return (
            <>
              <img src={updatedSrc} />
            </>
          );
        }
      },
    };

    return <div>{parse(htmlString, options)}</div>;
  };
  const closeReportModal = () => {
    setReportModal(false);
  };
  const bondDetails = () => {
    setIsExpanded(false);
    if (selectedBond.length < 1) {
      Swal.fire({ title: "Please Select Bond", confirmButtonColor: "#719B5F" });
      return;
    }
    if (selectedBond.length > 1) {
      setTickerModal(true);
      return;
    }
    const redirectUri = `${router.pathname}/${encodeURIComponent(
      selectedBond.map((item) => item.value)
    )}`;
    router.push(redirectUri);
  };
  const bondDetailsGo = () => {
    if (!selectedTickerName) {
      Swal.fire({
        title: "Please Select a Bond first",
        confirmButtonColor: "#719B5F",
      });
      return;
    }
    const redirectUri = `${router.pathname}/${encodeURIComponent(
      selectedTickerName
    )}`;
    router.push(redirectUri);
  };
  const handleSelectedTicker = (e) => {
    setSelectedTickerName(e.target.value);
    console.log("Selected Ticker", e.target.value);
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
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
    async function run() {
      if (filterData.length > 0) {
        let items = [...filterData];
        const numericValues = items.filter(
          (value) => !isNaN(parseFloat(value.element3))
        );
        const nanValues = items.filter((value) => isNaN(value.element3));
        if (sortConfig !== null) {
          if (sortConfig.key === "element3") {
            items = [
              ...numericValues.sort((a, b) => {
                if (sortConfig.direction === "asc") {
                  return (
                    Number.parseFloat(a[sortConfig.key]).toFixed(2) -
                    Number.parseFloat(b[sortConfig.key]).toFixed(2)
                  );
                } else {
                  return (
                    Number.parseFloat(b[sortConfig.key]).toFixed(2) -
                    Number.parseFloat(a[sortConfig.key]).toFixed(2)
                  );
                }
              }),
              ...nanValues,
            ];
          } else {
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
        }

        // ⚠️ DO NOT SLICE HERE, LET EXISTING PAGINATION HANDLE IT
        setFilterData(items);
      }
    }
    run(); // ✅ enable it
  }, [sortConfig]);

  useEffect(() => {
    fetchTickersFunc();
    fetchCompanyTickers();
    // fetchColumnNames()
    // getTickerCartDtata()
  }, []);
  useEffect(() => {
    if (compareData) {
      setRisenStocks(compareData?.bestFiveStocks);
      setRisenStocksFiltered(compareData?.bestFiveStocks);
      setDropStocks(compareData?.worstFiveStocks);
      setDropStocksFiltered(compareData?.worstFiveStocks);
    }
  }, [compareData]);
  // useEffect(() => {
  //     selectedStock.length && getTickerCartDtata()
  // }, [callChart])
  // useEffect(() => {}, [currentPage, limit]);

  useEffect(() => {
    if (tableData.length > 0 && selectedTicker) {
      const startIndex =
        (currentPage - 1) * (limit !== "all" ? limit : tableData.length);
      const endIndex = Math.min(
        startIndex + (limit !== "all" ? limit : tableData.length),
        tableData.length
      );
      setFilterData(tableData.slice(startIndex, endIndex));
    } else if (tableData.length > 0 && selectedOption === "Calculate") {
      const startIndex =
        (currentPage - 1) * (limit !== "all" ? limit : tableData.length);
      const endIndex = Math.min(
        startIndex + (limit !== "all" ? limit : tableData.length),
        tableData.length
      );

      setTotalPages(Math.ceil(tableData.length / limit));
      setTotalElements(tableData.length);
      setFilterData(tableData.slice(startIndex, endIndex));
    } else {
      fetchData();
    }
  }, [currentPage, limit, selectedTicker, selectedOption]);
  const customStyles = {
    container: (provided) => ({
      ...provided,
      zIndex: 4,
      maxWidth: "300px",
    }),
  };

  return (
    <>
      <div>
        <BondsHistoryModal
          open={openModal}
          handleClose={handleCloseModal}
          setCompareData={setCompareData}
          setSelectedOption={setSelectedOption}
          onClickImportDate={getWeeklyData}
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
              <span>{selectedOption + " :"}</span>
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
                +8 Action
              </button>
              <div
                className="collapsible-content"
                style={{ maxWidth: "max-content", width: contentWidth }}
                ref={contentRef}
              >
                <button
                  className={`h-100 collapsible-item ${
                    selectedOption == "History" ? ` active` : ""
                  }`}
                  type="button"
                  title="History"
                  onClick={handleOpenModal}
                >
                  <span>History</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    selectedOption == "Bond Home" ? ` active` : ""
                  }`}
                  type="button"
                  title="Bond Home"
                  onClick={bondHome}
                >
                  <span>Bond Home</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    selectedOption == "Ranking" ? ` active` : ""
                  }`}
                  type="button"
                  title="Ranking"
                  onClick={ranking}
                >
                  <span>Ranking</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    selectedOption == "Calculate" ? ` active` : ""
                  }`}
                  type="button"
                  title="Calculate"
                  onClick={() => {
                    setCalculateModal(true), setIsExpanded(false);
                  }}
                >
                  <span>Calculate</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    selectedOption == "Grid View" ? ` active` : ""
                  }`}
                  type="button"
                  title="Grid View"
                  onClick={gridView}
                >
                  <span>Grid View</span>
                </button>
                <button
                  className={`h-100 collapsible-item${
                    selectedOption == "Chart View" ? ` active` : ""
                  }`}
                  type="button"
                  title="Chart View"
                  onClick={charts}
                >
                  <span>Chart View</span>
                </button>
                <button
                  className="h-100  collapsible-item"
                  type="button"
                  title="Reset"
                  onClick={bondHome}
                >
                  <span>Reset</span>
                </button>
                <button
                  className="h-100  collapsible-item"
                  type="button"
                  title="Bond Details"
                  onClick={bondDetails}
                >
                  <span>Bond Details</span>
                </button>
              </div>
            </div>
            {/* <button className="btn btn-primary px-3 mb-0 me-3 d-flex align-items-center" style={{border:"0px solid var(--primary)"}} onClick={toggleDrawer(true)}><i className="mdi mdi-chevron-left"></i> <span>{selectedOption}</span></button> */}
          </div>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>
              Bonds
            </h3>
          </div>
          <div className="selection-area mb-3">
            <div className="row">
              {
                <div className="col-md-12">
                  <Form onSubmit={uploadFile} encType="multipart/form-data">
                    <input
                      type="hidden"
                      name="metaDataName"
                      value="Bondpricing_Master"
                    />
                    <div className="d-flex justify-content-between align-items-end flex-wrap mb-3">
                      <div
                        className="form-group d-flex align-items-center me-3"
                        style={{ flex: "2" }}
                      >
                        <div style={{ width: "100%" }}>
                          <ReactSelect
                            className="mb-0 me-2"
                            isMulti
                            onChange={setSelectedBond}
                            styles={customStyles}
                            options={
                              tickers &&
                              tickers.map((item, index) => ({
                                value: item.element1,
                                label: item.element1,
                              }))
                            }
                          />
                        </div>
                        <div className="actions flex-grow-1">
                          <button
                            className="btn btn-primary mb-0"
                            type="button"
                            onClick={() => {
                              if (
                                selectedBond.length &&
                                selectedOption === "Chart View"
                              ) {
                                charts();
                              } else {
                                handleSelectClick();
                              }
                            }}
                          >
                            GO
                          </button>
                        </div>

                        <div className="d-flex align-items-center mr-3 w-100">
                          <Select
                            className="mb-0 me-2 col-md-3 flex-grow-1"
                            isMulti
                            value={
                              selectedTicker &&
                              selectedTicker
                                .split(",")
                                .map((item) => ({ value: item, label: item }))
                            }
                            onChange={handleSelect}
                            style={{
                              minWidth: "200px",
                              maxWidth: "300px",
                              flex: "2",
                            }}
                            options={
                              companyTicker
                                ? companyTicker.map((item, index) => ({
                                    value: item.element1,
                                    label: item.element1,
                                  }))
                                : [{ value: "Loading", label: "Loading..." }]
                            }
                          />
                          <div className="actions">
                            <button
                              className="btn btn-primary mb-0"
                              type="button"
                              onClick={getHistoryByTicker}
                            >
                              GO
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="" className="form-label">
                          File Upload Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="fileDate"
                          required
                          onChange={(e) => {
                            // console.log(e.target.value);
                            //format date
                            const date = new Date(e.target.value);
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            const year = date.getFullYear();
                            const formattedDate = `${month}/${day}/${year}`;
                            // console.log(formattedDate);
                            setFileDate(formattedDate);
                          }}
                        />
                      </div>
                      <div className="form-group px-sm-2">
                        <label htmlFor="uploadFile" className="form-label">
                          Upload File
                        </label>
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
                        <button
                          className="btn btn-primary mb-0 px-4"
                          type="submit"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              }
            </div>
          </div>
          {/* <div className="selection-area mb-3" style={{ zIndex: "1" }}>
                        <Form onSubmit={uploadFile} encType="multipart/form-data">
                            <input type="hidden" name="metaDataName" value="Bondpricing_Master" />
                            <div className="row align-items-center">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>File Upload Date</label>
                                        <input type="date" className="form-control" name='fileDate' required onChange={(e) => { setFileDate(e.target.value) }} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="uploadFile">Upload File</label>
                                        <input id="uploadFile" type="file" name="myfile" className='border-1 form-control' required onChange={handleFileChange} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="actions">
                                        <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                                    </div></div>
                            </div>
                        </Form>
                    </div> */}
          {/* <div className="d-flex">
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "History" ? ` active` : ''}`} type="button" title="History" onClick={handleOpenModal}><span>History</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Bond Home" ? ` active` : ''}`} type="button" title="Bond Home" onClick={bondHome}><span>Bond Home</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Ranking" ? ` active` : ''}`} type="button" title="Ranking" onClick={ranking}><span>Ranking</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Calculate" ? ` active` : ''}`} type="button" title="Calculate" onClick={() => { setCalculateModal(true) }}><span>Calculate</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Grid View" ? ` active` : ''}`} type="button" title="Grid View" onClick={gridView}><span>Grid View</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Chart View" ? ` active` : ''}`} type="button" title="Chart View" onClick={charts}><span>Chart View</span></button>
                        <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3" type="button" title="Reset" onClick={bondHome}><span>Reset</span></button>
                        <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3" type="button" title="Bond Details" onClick={bondDetails}><span>Bond Details</span></button>
                    </div> */}

          {(selectedOption === "Bond Home" ||
            selectedOption === "Calculate" ||
            selectedOption === "Grid View") && (
            <>
              <div className="d-flex justify-content-between flex-wrap">
                <div className="dt-buttons mb-3 d-flex">
                  <button
                    className="dt-button buttons-pdf buttons-html5 btn-primary"
                    type="button"
                    title="PDF"
                    onClick={exportPdf}
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
                            checked={
                              visibleColumns.length === columnNames.length
                            }
                            onChange={handleAllCheckToggle}
                            label="Select All"
                            id={`${selectedOption}-selectAll`}
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
                <div className="form-group d-flex align-items-center">
                  <div className="form-group d-flex align-items-center mb-0 me-3">
                    {/* <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /> */}
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
                    onChange={filter}
                  />
                </div>
              </div>

              <div className="table-responsive" ref={tableContainerRef}>
                <table
                  className="table border display no-footer dataTable bond-table"
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
                              key={"column" + index + columnName}
                              style={{ width: "10% !imporatant" }}
                              onClick={() =>
                                handleSort(columnName.elementInternalName)
                              }
                            >
                              {columnName.elementDisplayName}
                              {getSortIcon(
                                columnName.elementInternalName,
                                sortConfig
                              )}
                            </th>
                          )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((rowData, rowIndex) => (
                      <tr
                        key={"rowIndex" + rowIndex}
                        style={{ overflowWrap: "break-word" }}
                      >
                        {columnNames.map((columnName, colIndex) => {
                          if (
                            !visibleColumns.includes(
                              columnName.elementInternalName
                            )
                          )
                            return null;
                          let content;

                          if (columnName.elementInternalName === "element3") {
                            content = Number.parseFloat(
                              rowData[columnName.elementInternalName]
                            ).toFixed(2);
                          } else if (
                            columnName.elementInternalName === "lastUpdatedAt"
                          ) {
                            content = new Date(
                              rowData[columnName.elementInternalName]
                            ).toLocaleDateString();
                          } else if (
                            columnName.elementInternalName === "element1"
                          ) {
                            // content = extractAndConvert(
                            //   rowData[columnName.elementInternalName]
                            // );
                            content = (
                              <ParsedHtml
                                htmlString={
                                  rowData[columnName.elementInternalName]
                                }
                              />
                            );
                          } else {
                            content = rowData[columnName.elementInternalName];
                          }

                          if (
                            typeof content == "string" &&
                            columnName.elementInternalName != "element1"
                          ) {
                            content = parse(content, options);
                          }
                          return <td key={colIndex}>{content}</td>;
                        })}
                      </tr>
                    ))}
                    {filterData.length == 0 && (
                      <tr>
                        <td colSpan={columnNames?.length}>No data available</td>
                      </tr>
                    )}
                  </tbody>
                  <thead>
                    <tr>
                      {filterData.length
                        ? columnNames.map((item, index) => {
                            {
                              if (
                                item.elementInternalName === "element3" ||
                                item.elementInternalName === "element9"
                              ) {
                                return (
                                  <th key={"thead" + index}>
                                    {calculateAverage(
                                      filterData,
                                      item.elementInternalName
                                    )}{" "}
                                    % <br />(
                                    {calculateAverage(
                                      tableData,
                                      item.elementInternalName
                                    )}
                                    ) %
                                  </th>
                                );
                              } else {
                                return <th key={index}></th>;
                              }
                            }
                          })
                        : null}
                    </tr>
                  </thead>
                </table>
              </div>
              {tableData.length > 0 && (
                <PaginationNew
                  currentPage={currentPage}
                  totalItems={totalElements}
                  totalPage={totalPages}
                  limit={limit}
                  setCurrentPage={setCurrentPage}
                  handlePage={handlePage}
                />
              )}
            </>
          )}
          {(selectedOption == "History" || selectedOption == "Ranking") && (
            <>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group d-flex align-items-center mb-2">
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
                      onChange={filterBestStocks}
                    />
                  </div>
                  <div className="table-responsive mb-3">
                    <table
                      className="table border display no-footer dataTable"
                      role="grid"
                      aria-describedby="exampleStocksPair_info"
                      id="my-table"
                    >
                      <thead>
                        <tr>
                          <th>Most Risen Stock</th>
                          <th>Price Risen By</th>
                          <th>% Increase</th>
                          <th>Current Price</th>
                          <th>Previous Price</th>
                          <th>Current YTM</th>
                          <th>Previous YTM</th>
                          <th>Maturity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risenStocksFiltered?.map((item, index) => {
                          return (
                            <tr key={"bestStock" + index}>
                              <td>{item?.bestMovedStock}</td>
                              <td>{item?.bestMovedBy}</td>
                              <td>{item?.percentageChangeRise}</td>
                              <td>{item?.bestMoveCurrValue}</td>
                              <td>{item?.bestMovePrevValue}</td>
                              <td>{item?.currytm}</td>
                              <td>{item?.prevytm}</td>
                              <td>{item?.maturityDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* <HightChart
                  data={compareData?.bestFiveStocks?.map((item) => [
                    item["bestMovedStock"],
                    parseFloat(item["percentageChangeRise"]),
                  ])}
                  title={"Bond Performance"}
                  typeCheck={{
                    categories: compareData?.bestFiveStocks?.map(
                      (item) => item?.bestMovedStock
                    ),
                  }}
                  yAxisTitle={"Risn in %"}
                  titleAlign={"center"}
                  subTitle={"Best Fifty"}
                /> */}
                </div>
                <div className="col-md-6">
                  <div className="form-group d-flex align-items-center mb-2">
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
                      onChange={filterWorstStocks}
                    />
                  </div>
                  <div className="table-responsive mb-3">
                    <table
                      className="table border display no-footer dataTable"
                      role="grid"
                      aria-describedby="exampleStocksPair_info"
                      id="my-table"
                    >
                      <thead>
                        <tr>
                          <th>Most Dropped Stock</th>
                          <th>Price Dropped By</th>
                          <th>% Decrease</th>
                          <th>Current Price</th>
                          <th>Previous Price</th>
                          <th>Current YTM</th>
                          <th>Previous YTM</th>
                          <th>Maturity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dropStocksFiltered?.map((item, index) => {
                          return (
                            <tr key={"worstStock" + index}>
                              <td>{item?.worstMovedStock}</td>
                              <td>{item?.worstMovedBy}</td>
                              <td>{item?.percentageChangeRise}</td>
                              <td>{item?.worstMoveCurrValue}</td>
                              <td>{item?.worstMovePrevValue}</td>
                              <td>{item?.currytm}</td>
                              <td>{item?.prevytm}</td>
                              <td>{item?.maturityDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <HightChartOZero
                    data={compareData?.bestFiveStocks?.map((item) => ({
                      name: item["bestMovedStock"],
                      y: parseFloat(item["percentageChangeRise"]),
                    }))}
                    typeCheck={{
                      categories: compareData?.bestFiveStocks?.map(
                        (item) => item?.bestMovedStock
                      ),
                    }}
                    title={"Bond Performance"}
                    yAxisTitle={"Rise in %"}
                    titleAlign={"center"}
                    subTitle={"Best Twenty"}
                  />
                  {/* <HightChart
                    data={compareData?.bestFiveStocks?.map((item) => [
                      item["bestMovedStock"],
                      parseFloat(item["percentageChangeRise"]),
                    ])}
                    title={"Bond Performance"}
                    typeCheck={{
                      categories: compareData?.bestFiveStocks?.map(
                        (item) => item?.bestMovedStock
                      ),
                    }}
                    yAxisTitle={"Risn in %"}
                    titleAlign={"center"}
                    subTitle={"Best Fifty"}
                    chartType="column"
                  /> */}
                </div>
              </div>
              <div className="row my-3">
                <div className="col-md-12">
                  <HightChartOZero
                    data={compareData?.worstFiveStocks?.map((item) => ({
                      name: item["worstMovedStock"],
                      y: parseFloat(item["percentageChangeDrop"]),
                    }))}
                    typeCheck={{
                      categories: compareData?.worstFiveStocks?.map(
                        (item) => item?.worstMovedStock
                      ),
                    }}
                    title={"Bond Performance"}
                    yAxisTitle={"Drop in %"}
                    titleAlign={"center"}
                    subTitle={"Best Twenty"}
                  />
                  {/* <HightChart
                    data={compareData?.worstFiveStocks?.map((item) => [
                      item["worstMovedStock"],
                      parseFloat(item["percentageChangeDrop"]),
                    ])}
                    title={"Bond Performance"}
                    typeCheck={{
                      categories: compareData?.worstFiveStocks?.map(
                        (item) => item?.worstMovedStock
                      ),
                    }}
                    yAxisTitle={"Drop in %"}
                    titleAlign={"center"}
                    subTitle={"Worst Fifty"}
                    chartType="column"
                  /> */}
                </div>
              </div>
            </>
          )}
          {selectedOption == "Chart View" && (
            <>
              <Tabs
                defaultActiveKey="price"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="price" title="Price">
                  <div className="d-flex align-items-center mx-2 mb-2">
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
                  <HightChart
                    data={chartHistory?.map((item) => [
                      new Date(item["lastUpdatedAt"]).getTime(),
                      parseFloat(item[selectedView]),
                    ])}
                    title={
                      ViewOptions[selectedView] &&
                      `Chart View For ${ViewOptions[selectedView]}`
                    }
                    yAxisTitle="Price"
                  />
                </Tab>
                <Tab eventKey="ytm" title="YTM">
                  <div className="d-flex align-items-center mx-2 mb-2">
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
                  <HightChart
                    data={chartHistory?.map((item) => [
                      new Date(item["lastUpdatedAt"]).getTime(),
                      parseFloat(item["element3"]),
                    ])}
                    title={
                      ViewOptions["element3"] &&
                      `Chart View For ${ViewOptions["element3"]}`
                    }
                    yAxisTitle="YTW"
                  />
                </Tab>
              </Tabs>
            </>
          )}
          <Modal
            show={calculateModal}
            onHide={() => {
              setCalculateModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Analysis - Bond</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Rating
                    </label>
                    <ReactSelect
                      className=""
                      isMulti
                      onChange={setRating}
                      style={{ minWidth: "200px", maxWidth: "300px" }}
                      value={rating}
                      options={[
                        { value: "Any", label: "Any" },
                        { value: "AAA", label: "AAA" },
                        { value: "AA", label: "AA" },
                        { value: "A", label: "A" },
                        { value: "BBB", label: "BBB" },
                        { value: "BB", label: "BB" },
                        { value: "B", label: "B" },
                        { value: "CCC", label: "CCC" },
                        { value: "CC", label: "CC" },
                        { value: "C", label: "C" },
                      ]}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="treasuryYield" className="form-label">
                      Treasury Yield
                    </label>
                    <input
                      type="text"
                      name="treasuryYield"
                      id="treasuryYield"
                      className="form-control"
                      value={treasuryYield}
                      onChange={(e) => {
                        e.preventDefault();
                        setTreasuryYield(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Year
                    </label>
                    <select
                      name="year"
                      id=""
                      className="form-select"
                      value={year}
                      onChange={(e) => {
                        e.preventDefault();
                        setYear(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="0-1">0-1</option>
                      <option value="1-3">1-3</option>
                      <option value="3-5">3-5</option>
                      <option value="5-7">5-7</option>
                      <option value="7-10">7-10</option>
                      <option value="10-20">10-20</option>
                      <option value="20+">20+</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Maturity Range(Min):
                    </label>
                    <select
                      name="maturityMin"
                      id=""
                      className="form-select"
                      value={maturityMin}
                      onChange={(e) => {
                        e.preventDefault();
                        setMaturityMin(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Maturity Range(Max):
                    </label>
                    <select
                      name="maturityMax"
                      id=""
                      className="form-select"
                      value={maturityMax}
                      onChange={(e) => {
                        e.preventDefault();
                        setMaturityMax(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      YTM Range(Min):
                    </label>
                    <select
                      name="ytwMin"
                      id=""
                      className="form-select"
                      value={ytwMin}
                      onChange={(e) => {
                        e.preventDefault();
                        setYtwMin(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      YTM Range(Max):
                    </label>
                    <select
                      name="ytwMax"
                      id=""
                      className="form-select"
                      value={ytwMax}
                      onChange={(e) => {
                        e.preventDefault();
                        setYtwMax(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Callable:
                    </label>
                    <select
                      name="callable"
                      id=""
                      className="form-select"
                      value={callable}
                      onChange={(e) => {
                        e.preventDefault();
                        setCallable(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Secured:
                    </label>
                    <select
                      name="secured"
                      id=""
                      className="form-select"
                      value={secured}
                      onChange={(e) => {
                        e.preventDefault();
                        setSecured(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setCalculateModal(false);
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </Modal.Footer>
          </Modal>
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
        </div>
      </div>
      <Modal
        show={tickerModal}
        onHide={() => {
          setTickerModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a bond for Bond Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              {selectedBond.map((item, index) => {
                return (
                  <>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        name="selectedTicker"
                        type="radio"
                        value={item.value}
                        id={"selectTicker" + index}
                        onClick={handleSelectedTicker}
                      />
                      <label
                        className="form-check-label"
                        for={"selectTicker" + index}
                      >
                        {item.value}
                      </label>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setTickerModal(false);
            }}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={bondDetailsGo}>
            Go
          </button>
        </Modal.Footer>
      </Modal>
      <ReportTable
        name={reportTicker}
        open={reportModal}
        handleCloseModal={closeReportModal}
        news={true}
      />
      <Drawer
        anchor={"right"}
        open={open}
        onClose={toggleDrawer(false)}
        className="bond-action-menu"
      >
        <List>
          <ListItem>
            <ListItemButton
              className={`${selectedOption == "History" ? "text-primary" : ""}`}
              onClick={handleOpenModal}
            >
              History
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              className={`${
                selectedOption == "Bond Home" ? "text-primary" : ""
              }`}
              onClick={bondHome}
            >
              Bond Home
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              className={`${selectedOption == "Ranking" ? "text-primary" : ""}`}
              onClick={ranking}
            >
              Ranking
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              className={`${
                selectedOption == "Calculate" ? "text-primary" : ""
              }`}
              onClick={() => {
                setCalculateModal(true);
              }}
            >
              Calculate
            </ListItemButton>
            {/* <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Calculate" ? ` active` : ''}`} type="button" title="Calculate" onClick={() => { setCalculateModal(true) }}><span>Calculate</span></button> */}
          </ListItem>
          <ListItem>
            <ListItemButton
              className={`${
                selectedOption == "Grid View" ? "text-primary" : ""
              }`}
              onClick={gridView}
            >
              Grid View
            </ListItemButton>
            {/* <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Grid View" ? ` active` : ''}`} type="button" title="Grid View" onClick={gridView}><span>Grid View</span></button> */}
          </ListItem>
          <ListItem>
            <ListItemButton
              className={`${
                selectedOption == "Chart View" ? "text-primary" : ""
              }`}
              onClick={charts}
            >
              Chart View
              {/* <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Chart View" ? ` active` : ''}`} type="button" title="Chart View" onClick={charts}><span>Chart View</span></button> */}
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={bondHome}>
              Reset
              {/* <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3" type="button" title="Reset" onClick={bondHome}><span>Reset</span></button> */}
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              className={`${
                selectedOption == "Calculate" ? "text-primary" : ""
              }`}
              onClick={bondDetails}
            >
              Bond Details
              {/* <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3" type="button" title="Bond Details" onClick={bondDetails}><span>Bond Details</span></button> */}
            </ListItemButton>
          </ListItem>
          {/* </div> */}
        </List>
      </Drawer>
      {isExpanded && <div className="backdrop"></div>}
    </>
  );
}
