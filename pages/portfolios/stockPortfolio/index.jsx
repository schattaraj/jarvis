import React, { useContext, useEffect, useRef, useState } from "react";
import Footer from "../../../components/footer";
import Navigation from "../../../components/navigation";
import Sidebar from "../../../components/sidebar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import parse from "html-react-parser";
import Modal from "react-bootstrap/Modal";
import Loader from "../../../components/loader";
import { Context } from "../../../contexts/Context";
import {
  buildQueryString,
  calculateAverage,
  calculateAveragePercentage,
  decodeJWT,
  fetchWithInterceptor,
  formDataToJSON,
  formatDate,
  getSortIcon,
  searchTable,
  sortBySelection,
  transformData,
} from "../../../utils/utils";
import SliceData from "../../../components/SliceData";
import * as Icon from "react-icons/fa";
import { Pagination } from "../../../components/Pagination";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Breadcrumb from "../../../components/Breadcrumb";
import { PaginationNew } from "../../../components/PaginationNew";
export default function Portfolio() {
  const context = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [portfolioNames, setPortfolioNames] = useState([]);
  const [selectedPortfolioId, setPortfolioId] = useState(false);
  const [selectedPortfolioText, setSelectedPortfolioText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);
  const [stockPortfolioShow, setStockPortfolioShow] = useState(false);
  const [allStocks, setAllStocks] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [manageView, setManageView] = useState(false);
  const [stockPortfolios, setStockportfolios] = useState(false);
  const [filteredStockPortfolios, setfilteredStockPortfolios] = useState([]);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [sortConfig2, setSortConfig2] = useState({
    key: null,
    direction: null,
  });
  const [limit2, setLimit2] = useState(25);
  const [editStatus, setEditStatus] = useState(false);
  const [filteredAllStockPortfolios, setfilteredAllStockPortfolios] = useState(
    []
  );
  const [currentPage3, setCurrentPage3] = useState(1);
  const [sortConfig3, setSortConfig3] = useState({
    key: null,
    direction: null,
  });
  const [limit3, setLimit3] = useState(100);
  const [totalPages3, setTotalPages3] = useState(0);
  const [totalElements3, setTotalElements3] = useState(0);
  const [isLastPage3, setIsLastPage3] = useState(false);
  const [portfolioPayload, setPortfolioPayload] = useState({
    myArr: [],
    portfolioName: "",
    share: "",
    purchaseDate: "",
    purchasePrice: "",
  });
  const [formData, setFormData] = useState({
    portfolioName: "",
    allStocks: [
      // { stockName: "", share: "", purchaseDate: "", purchasePrice: "" },
    ],
  });
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [countApiCall, setCountApiCall] = useState(0);
  //pagination
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [stockPrices, setStockPrices] = useState({});
  const tableRef = useRef(null);
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

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=TY1WA5LN5KU3SQIV&datatype=json`
      );
      const data = await response.json();

      if (data["Time Series (1min)"]) {
        const firstTimeKey = Object.keys(data["Time Series (1min)"])[0];
        const closePrice = data["Time Series (1min)"][firstTimeKey]["4. close"];
        setStockPrices((prev) => ({
          ...prev,
          [symbol]: closePrice,
        }));
      }
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }
  };

  useEffect(() => {
    if (tableData.length > 0) {
      tableData.forEach((item) => {
        if (item.element71) {
          fetchStockPrice(item.element71);
        }
      });
    }
  }, [tableData]);

  const handleClick = async (name) => {
    setReportModal(true);
    try {
      const fetchReport = await fetch(
        "https://jharvis.com/JarvisV2/getTickerReportsByTickerName?tickerName=" +
          name
      );
      const fetchReportRes = await fetchReport.json();
      console.log("fetchReportRes", fetchReportRes);
      setReportData(fetchReportRes);
    } catch (e) {
      console.log("error", e);
    }
  };
  const fetchColumnNames = async () => {
    try {
      const columnApi = await fetch(
        "https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Tickers_Watchlist&_=170004124669"
      );
      const columnApiRes = await columnApi.json();
      setColumnNames(columnApiRes);
    } catch (e) {
      console.log("error", e);
    }
  };
  const fetchPortfolioNames = async () => {
    try {
      context.setLoaderState(true);
      const baseUrl = `/api/proxy?api=getAllPortFolioTicker`;
      // const {payload} = await fetchWithInterceptor(baseUrl,true)
      const portfolioApiRes = await fetchWithInterceptor(baseUrl, true);
      setPortfolioNames(portfolioApiRes);
      setPortfolioId(portfolioApiRes[0]?.idPortfolio);
      setCountApiCall(countApiCall + 1);
    } catch (e) {
      console.log("error", e);
    } finally {
      context.setLoaderState(false);
    }
  };
  const fetchData = async () => {
    try {
      context.setLoaderState(true);
      if (selectedPortfolioId) {
        // const baseUrl = `/api/proxy?api=portfolio/getPortFolioStockSet?idPortfolio=${selectedPortfolioId}`;
        const baseUrl = `/api/proxy?api=getPortFolioStockSet?idPortfolio=${selectedPortfolioId}`;
        // const {payload} = await fetchWithInterceptor(baseUrl,false)
        const getPortfolioRes = await fetchWithInterceptor(baseUrl, false);
        setTableData(getPortfolioRes);
        setFilterData(getPortfolioRes);
        const totalItems = getPortfolioRes.length;
        setTotalItems(totalItems);
        const items = await SliceData(1, limit, getPortfolioRes);
        setFilterData(items);
        setTotalPages(Math.ceil(totalItems / limit));
      }
    } catch (e) {
      console.log("error", e);
    } finally {
      context.setLoaderState(false);
    }
  };

  useEffect(() => {
    const transformedData = transformData(columnNames, tableData);
    console.log(tableData);
    console.log("transformedData", transformedData);
    context.setFormattedBotData(transformedData);
  }, [columnNames, tableData]);

  const handleChange = (e) => {
    const selectedText = e.target.selectedOptions[0].text;
    setPortfolioId(e.target.value);
    setSelectedPortfolioText(selectedText);
  };
  const exportPdf = () => {
    if (tableData.length > 0) {
      const parentDiv = document.createElement("div");
      parentDiv.id = "loader";
      parentDiv.classList.add("loader-container", "flex-column");
      const loaderDiv = document.createElement("div");
      loaderDiv.className = "loader";
      parentDiv.appendChild(loaderDiv);
      document.body.appendChild(parentDiv);

      const input = document.getElementById("my-table");
      const headers = ["Symbol", "Portfolio Name"];
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          const pdf = new jsPDF({
            orientation: "landscape",
            format: "a1",
          });

          // Table rows
          const rows = filteredStockPortfolios.map((rowData) => {
            return [rowData?.name, rowData?.ticker];
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

          pdf.save("Jarvis Ticker for " + formatDate(new Date()) + ".pdf");
          const loaderDiv = document.getElementById("loader");
          if (loaderDiv) {
            loaderDiv.remove();
          }
        })
        .catch((error) => {
          context.setLoaderState(false);
        });
    }
    // if (tableData.length > 0) {
    //   const doc = new jsPDF();

    //   autoTable(doc, { html: "#my-table" });

    //   doc.save("table.pdf");
    // }
  };
  const generatePDF = () => {
    const input = document.getElementById("my-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Jarvis Ticker for " + formatDate(new Date()) + ".pdf");
    });
  };
  const exportToExcel = () => {
    // Get table data and convert to a 2D array
    const table = tableRef.current;
    const tableData = [];
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell) => {
        rowData.push(cell.textContent);
      });
      tableData.push(rowData);
    });

    // Create a new workbook and a new worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate a binary string representation of the workbook
    const workbookBinary = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(workbookBinary)], {
      type: "application/octet-stream",
    });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_data.xlsx";
    link.click();
    URL.revokeObjectURL(link.href); // Clean up the URL object
  };

  // Helper function to convert a string to an array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  const getAllStock = async () => {
    context.setLoaderState(true);
    try {
      // const allStocksApi = await fetch(
      //   "https://jharvis.com/JarvisV2/getAllStocksForPolio"
      // );
      // const allStocksApiRes = await allStocksApi.json();

      const apiEndpoint = `/api/proxy?api=getAllStocksForPolio?pageSize=${
        limit3 != "all" ? limit3 : totalElements3
      }&pageNumber=${currentPage3 - 1}`;
      const response = await fetchWithInterceptor(apiEndpoint, false);
      setAllStocks(response?.content);
      setfilteredAllStockPortfolios(response?.content);
      setTotalPages3(response.totalPages);
      setTotalElements3(response.totalElements);
      setIsLastPage3(response.lastPage);
    } catch (e) {
      console.log("error", e);
    } finally {
      context.setLoaderState(false);
    }
  };
  const handleClose = () => {
    setEditStatus(false);
    formData.portfolioName = "";
    setfilteredAllStockPortfolios([]);
    setCurrentPage3(1);
    setLimit3(25);
    formData.allStocks = [
      { stockName: "", share: "", purchaseDate: "", purchasePrice: "" },
    ];
    setAllStocks([]);
    setShow(false);
  };
  const handleShow = (path) => {
    setShow(true);
  };

  const handleProtfolioShow = () => {
    getAllStock();
    handleShow();
  };
  const filter = (e) => {
    console.log("search", e.target.value);
    const value = e.target.value;
    const filtered = tableData.filter((elememt) =>
      elememt.element4.toLowerCase().includes(value.toLowerCase())
    );
    //   const filtered = tableData.map(elememt => {
    //    return elememt['element4'].toLowerCase().includes(value.toLowerCase())
    // columnNames.map((item,index)=>{
    //     // (elememt.element+(index+1)).toLowerCase().includes(value.toLowerCase())
    //     console.log(elememt['element4'].includes(value))
    //      if(elememt['element4'] == value){
    //    return elememt
    //     }

    // })
    // });
    // console.log('searchdata', filtered)
    // console.log('tableData', tableData)
    setFilterData(searchTable(tableData, value));
  };
  const downloadReport = async (reportName) => {
    try {
      const fetchReport = await fetch(
        "https://jharvis.com/JarvisV2/downloadTickerReport?fileName=" +
          reportName
      );
      const fetchReportRes = await fetchReport.json();
      window.open(fetchReportRes.responseStr, "_blank");
    } catch (e) {
      console.log("error", e);
    }
  };
  const deleteReport = async (reportName) => {
    try {
      const deleteApi = await fetch(
        "https://jharvis.com/JarvisV2/deletePortfolioByName?name=" + reportName
      );
      const deleteApiRes = await deleteApi.json();
      alert(deleteApiRes.msg);
    } catch (e) {
      console.log("error", e);
    }
  };
  const selectStock = (e, stockName) => {
    const isChecked = e.target.checked;

    let updatedSelectedStocks;
    if (isChecked) {
      const stock = filteredAllStockPortfolios.find(
        (s) => s.stockName === stockName
      );
      //add the stock if it is Checked
      updatedSelectedStocks = [...selectedStocks, { ...stock }];
    } else {
      //remove the stock if it is Unchecked
      updatedSelectedStocks = selectedStocks.filter(
        (s) => s.stockName !== stockName
      );
    }

    setSelectedStocks(updatedSelectedStocks);

    // Reorder filtered list
    setfilteredAllStockPortfolios((prev) =>
      sortBySelection(prev, updatedSelectedStocks)
    );
  };
  const updateSelectedStock = (e, stockName) => {
    const { name, value } = e.target;
    console.log(name, value);
    setSelectedStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.stockName === stockName ? { ...stock, [name]: value } : stock
      )
    );
  };
  const portfolioInputs = (e, index) => {
    // setPortfolioPayload({ ...portfolioPayload, [e.target.name]: e.target.value })
    const { name, value } = e.target;

    if (name === "portfolioName") {
      // Update portfolio name
      setFormData((prevData) => ({
        ...prevData,
        portfolioName: value,
      }));
    } else {
      const updatedStocks = [...formData.allStocks];

      // Update the specific stock at the given index
      updatedStocks[index] = {
        ...updatedStocks[index],
        [name]: value,
      };

      // Set the updated array in state
      setFormData((prevData) => ({
        ...prevData,
        allStocks: updatedStocks,
      }));
    }
  };
  const validateStocks = () => {
    const newErrors = {};
    selectedStocks.forEach((stock) => {
      if (!stock.share)
        newErrors[stock.stockName] = {
          ...newErrors[stock.stockName],
          share: "Share is required",
        };
      if (!stock.purchaseDate)
        newErrors[stock.stockName] = {
          ...newErrors[stock.stockName],
          purchaseDate: "Purchase Date is required",
        };
      if (!stock.purchasePrice)
        newErrors[stock.stockName] = {
          ...newErrors[stock.stockName],
          purchasePrice: "Purchase Price is required",
        };
    });
    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    return newErrors;
  };
  const ShowTarget = (errorLabel) => {
    setSearchQuery(errorLabel);
    Swal.close();
  };
  const createPortfolio = async (e) => {
    console.log("form-data", formData, selectedStocks);
    const subscribersOnly = formData?.subscribersOnly;
    const errors = validateStocks();
    if (Object.keys(errors).length > 0) {
      let errorHtml = `Please fill in all required fields for selected symbols.`;
      for (const error in errors) {
        // If the error is an object, loop through and handle nested errors
        if (typeof errors[error] === "object") {
          errorHtml += `<ul><button class="btn show-target-btn outline" data-error="${error}" title="Go to the field"><u>${error}</u></button>`;
          for (const err in errors[error]) {
            errorHtml += `<li style='text-align:left;color:red;text-transform:capitalize'>${err
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace("share", "quantity")} field is required</li>`;
          }
          errorHtml += "</ul>";
        } else {
          errorHtml += `<p>${errors[error]}</p>`;
        }
      }
      await Swal.fire({
        title: "Validation Errors",
        html: errorHtml,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--primary)",
        didOpen: () => {
          document.querySelectorAll(".show-target-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
              ShowTarget(e.target.textContent);
            });
          });
        },
      });
      return;
    }
    if (!formData?.portfolioName) {
      Swal.fire({
        title: "Portfolio Name Required",
        text: "Please enter a portfolio name.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }
    if (selectedStocks.length < 1) {
      Swal.fire({
        title: "Please select a stock",
        text: "You have to select atleast one stock",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }
    const stockFormData = new FormData();
    // const stockArray =
    selectedStocks.forEach((stock) => {
      if (
        stock?.stockName &&
        stock?.share &&
        stock?.purchaseDate &&
        stock?.purchasePrice
      ) {
        // return `${stock.stockName}~${stock.share}~${stock.purchaseDate}~${stock.purchasePrice}`;
        const formattedStock = `${stock.stockName}~${stock.share}~${stock.purchaseDate}~${stock.purchasePrice}`;
        stockFormData.append(`myArray[]`, formattedStock);
      }
      // return null; // Return null for invalid stocks
    });
    // .filter(Boolean); // Filter out null values
    // const jsonObject = {
    //   name: formData.portfolioName,
    //   stockNames: stockArray,
    //   visiblePortFolio: "yes",
    // };
    try {
      const accessToken = localStorage.getItem("access_token");
      const { userID } = decodeJWT(accessToken);

      const apiEndpoint = `/api/proxy?api=createPortfolio?name=${
        formData.portfolioName
      }&visiblePortFolio=${
        subscribersOnly ? "yes" : "no"
      }&userId=${userID}&bodyType=form`;
      // const options = { body: JSON.stringify(jsonObject), method: "POST" };
      console.log(stockFormData);

      const options = { body: stockFormData, method: "POST" };
      const defaultHeaders = {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      };

      options.headers = {
        ...defaultHeaders,
        ...options.headers,
      };
      // const response = await fetchWithInterceptor(
      //   apiEndpoint,
      //   true,
      //   {},
      //   options
      // );
      const apiFetch = await fetch(apiEndpoint, options);
      const response = await apiFetch.json();
      console.log("response", response);

      if (response?.msg) {
        Swal.fire({
          title: response?.msg,
          confirmButtonColor: "var(--primary)",
        });
        handleClose();
        getAllStockForPolios();
      }
      if (response?.statusCode == 0) {
        Swal.fire({
          title: response?.payload?.msg,
          confirmButtonColor: "var(--primary)",
        });
        handleClose();
        getAllStockForPolios();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed", error);
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

  const handlePage2 = async (action) => {
    switch (action) {
      case "prev":
        setCurrentPage2(currentPage2 - 1);
        break;
      case "next":
        setCurrentPage2(currentPage2 + 1);
        break;
      default:
        setCurrentPage2(currentPage2);
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

  const handleSort2 = (key) => {
    let direction = "asc";
    if (
      sortConfig2 &&
      sortConfig2.key === key &&
      sortConfig2.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig2({ key, direction });
  };

  const changeLimit = (e) => {
    setLimit(e.target.value);
  };

  const changeLimit2 = (e) => {
    setLimit2(e.target.value);
  };

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
    fetchColumnNames();
    fetchPortfolioNames();
  }, []);
  useEffect(() => {
    if (countApiCall == 1) {
      fetchData();
    }
  }, [countApiCall]);

  const sortedData = [...filteredStockPortfolios].sort((a, b) => {
    const aChecked = selectedStocks.some(
      (stock) => stock.stockName === a.stockName
    );
    const bChecked = selectedStocks.some(
      (stock) => stock.stockName === b.stockName
    );
    return aChecked === bChecked ? 0 : aChecked ? -1 : 1; // Checked first
  });

  const getAllStockForPolios = async () => {
    setManageView(true);
    context.setLoaderState(true);
    try {
      const allStockApi = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL_V2
        }getAllPortfolio?userId=2&_=${new Date().getTime()}`
      );
      const allStockApiRes = await allStockApi.json();
      setStockportfolios(allStockApiRes);
    } catch (error) {}
    context.setLoaderState(false);
  };

  const stockFilterData = () => {
    if (stockPortfolios.length > 0) {
      let items = [...stockPortfolios];
      if (sortConfig2 !== null) {
        items.sort((a, b) => {
          if (a[sortConfig2.key] < b[sortConfig2.key]) {
            return sortConfig2.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig2.key] > b[sortConfig2.key]) {
            return sortConfig2.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      let dataLimit = limit2;
      if (dataLimit == "all") {
        dataLimit = items?.length;
      }
      const startIndex = (currentPage2 - 1) * dataLimit;
      const endIndex = startIndex + dataLimit;
      items = items.slice(startIndex, endIndex);
      setfilteredStockPortfolios(items);
    }
  };

  useEffect(() => {
    stockFilterData();
  }, [currentPage2, stockPortfolios, sortConfig2, limit2]);

  const stockFilter = (e) => {
    const value = e.target.value;
    setfilteredStockPortfolios(searchTable(stockPortfolios, value));
  };

  const deleteStockPortFolio = async (name) => {
    Swal.fire({
      title: "Are you sure ?",
      icon: "warning",
      confirmButtonText: "Delete",
      showCancelButton: true,
      customClass: { confirmButton: "btn-danger" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          context.setLoaderState(true);
          // const baseUrl = `/api/proxy?api=deletePortfolioByName?name=${name}`;
          const baseUrl = `https://jharvis.com/JarvisV2/deletePortfolioByName?name=${name}&_=1724828770137`;
          const response = await fetch(baseUrl);
          const result = await response.json();

          Swal.fire({
            title: result.msg,
            confirmButtonColor: "var(--primary)",
          });
          // const response = await fetch(`https://jharvis.com/JarvisV2/deletePortfolioByName?name=${name}&_=1724828770137`);
          console.log("response:", response);
          context.setLoaderState(false);
          getAllStockForPolios();
          stockFilterData();
          // if (response.status == 200) {
          //     const result = await response.json();
          //     context.setLoaderState(false);
          //     alert("Portfolio Stock set has been deleted");
          //     getAllStockForPolios();
          //     stockFilterData();
          // } else {
          //     console.error('Error:', response.statusText);
          //     context.setLoaderState(false);
          // }
        } catch (error) {
          console.error("Request failed", error);
          context.setLoaderState(false);
        }
      }
    });
  };

  const handleEditModal = async (name) => {
    context.setLoaderState(true);
    try {
      const apiEndpoint = `/api/proxy?api=getAllPortfolioByName?name=${name}&pageNumber=${
        currentPage3 - 1
      }&pageSize=${limit3 !== "all" ? limit3 : totalElements3}`;
      const options = { method: "GET" };

      const response = await fetchWithInterceptor(
        apiEndpoint,
        false,
        {},
        options
      );
      const allStocksApiRes = response?.content;

      setTotalPages3(response.totalPages);
      setTotalElements3(response.totalElements);
      setIsLastPage3(response.lastPage);

      // Set all stocks
      setAllStocks(allStocksApiRes);

      // Extract selected stocks (with share or purchaseDate)
      const selected = allStocksApiRes
        .filter((item) => item.share || item.purchaseDate)
        .map((item) => ({
          stockName: item.stockName,
          share: item.share,
          purchaseDate: item.purchaseDate,
          purchasePrice: item.purchasePrice,
        }));

      setSelectedStocks(selected); // Set selected state

      // Sort allStocks with selected ones at top
      setfilteredAllStockPortfolios(sortBySelection(allStocksApiRes, selected));

      // Prefill formData
      formData.portfolioName = name;
      formData.allStocks = selected;

      setEditStatus(true);
      handleShow();
      context.setLoaderState(false);
    } catch (e) {
      console.log("error", e);
      context.setLoaderState(false);
    }
  };

  const handleStockPortfolioStatus = () => {
    stockPortfoliohandleShow();
  };

  const stockPortfoliohandleShow = () => {
    setStockPortfolioShow(true);
  };

  const stockPortfoliohandleClose = () => {
    setStockPortfolioShow(false);
    setSelectedPortfolioText("");
  };

  const allStockFilterData = () => {
    if (allStocks.length > 0) {
      let items = [...allStocks];
      if (sortConfig3 !== null) {
        items.sort((a, b) => {
          if (a[sortConfig3.key] < b[sortConfig3.key]) {
            return sortConfig3.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig3.key] > b[sortConfig3.key]) {
            return sortConfig3.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      let dataLimit = limit3;
      if (dataLimit == "all") {
        dataLimit = items?.length;
      }
      const startIndex = (currentPage3 - 1) * dataLimit;
      const endIndex = startIndex + dataLimit;
      items = items.slice(startIndex, endIndex);
      setfilteredAllStockPortfolios(items);
    }
  };

  useEffect(() => {
    getAllStock();
  }, [currentPage3, limit3]);

  const allStockFilter = (e) => {
    const value = e.target.value;
    const filtered = searchTable(allStocks, value);

    // Check which tickers are selected
    const selectedStockNames = selectedStocks.map((s) => s.stockName);

    // Clean filtered list: reset share/purchaseDate/purchasePrice if not selected already
    const updatedFiltered = filtered.map((stock) => {
      if (!selectedStockNames.includes(stock.stockName)) {
        return {
          ...stock,
          share: "",
          purchaseDate: "",
          purchasePrice: "",
        };
      }
      return stock;
    });

    setfilteredAllStockPortfolios(
      sortBySelection(updatedFiltered, selectedStocks)
    );
  };

  const handleSort3 = (key) => {
    let direction = "asc";
    if (
      sortConfig3 &&
      sortConfig3.key === key &&
      sortConfig3.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig3({ key, direction });
  };

  const changeLimit3 = (e) => {
    setLimit3(e.target.value);
    setCurrentPage3(1); // Reset to first page when limit changes
  };

  const handlePage3 = async (action) => {
    switch (action) {
      case "prev":
        setCurrentPage3(currentPage3 - 1);
        break;
      case "next":
        setCurrentPage3(currentPage3 + 1);
        break;
      default:
        setCurrentPage3(currentPage3);
        break;
    }
  };

  const options1 = {
    replace: (elememt) => {
      if (elememt?.name === "a") {
        return (
          <a
            onClick={() => {
              handleClick(elememt.children[0].data);
            }}
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
            {/* <a
              onClick={() => {
                handleClick(elememt.children[0].data);
              }}
            >
              {typeof elememt?.children[0]?.data == "string"
                ? parse(elememt?.children[0]?.data)
                : elememt?.children[0]?.data}
            </a> */}
          </React.Fragment>
        );
      }
    },
  };
  const options3 = {
    replace(elememt) {
      if (elememt?.name === "a") {
        return (
          <a
            onClick={() => {
              handleClick(elememt.children[0].data);
            }}
          >
            {typeof elememt?.children[0]?.data == "string"
              ? parse(elememt?.children[0]?.data)
              : elememt?.children[0]?.data}
          </a>
        );
      }
    },
  };
  const options4 = {
    replace(element) {
      if (element?.name === "img" && element?.next?.type === "text") {
        return (
          <React.Fragment>
            <img className="img-responsive" src={element?.attribs?.src} />
            <a
              onClick={() => {
                handleClick(elememt.children[0].data);
              }}
            >
              {element?.next?.data}
            </a>
          </React.Fragment>
        );
      }
    },
  };
  function extractAndConvert(inputString) {
    const fullImgAnchorRegex =
      /<img[^>]+src=['"]([^'"]+\.(?:jpg|png))['"][^>]*>\s*(<a.*?<\/a>)/i;

    // Match <img ...> followed by <a ...>Text</a>
    const matchFull = inputString.match(fullImgAnchorRegex);
    if (matchFull) {
      const childElem = matchFull[matchFull.length - 1];

      const filePath = matchFull[1]; // The actual image URL
      const anchorText = matchFull[2]; // The text inside the anchor tag

      // console.log(filePath, anchorText);
      const imgTag = `<img src="/api/image-proxy?path=${encodeURIComponent(
        filePath
      )}" alt="Image">${childElem}`;
      return parse(imgTag, options);
    }

    // Fallback cases below
    const onlyPathRegex = /(https?:\/\/[^\s'"]+\.(jpg|png))/i;
    const onlyAnchorRegex = /<a[^>]*>(.*?)<\/a>/i;
    const matchOnlyPath = inputString.match(onlyPathRegex);
    const matchOnlyAnchor = inputString.match(onlyAnchorRegex);

    if (matchOnlyPath && matchOnlyAnchor) {
      const filePath = matchOnlyPath[1];
      const anchorText = matchOnlyAnchor[1];
      return parse(
        `<img src="/api/image-proxy?path=${encodeURIComponent(
          filePath
        )}" alt="Image" />
         <a>${anchorText}</a>`,
        options2
      );
    }

    if (matchOnlyPath) {
      const filePath = matchOnlyPath[1];
      return parse(
        `<img src="/api/image-proxy?path=${encodeURIComponent(
          filePath
        )}" alt="Image" />`,
        options1
      );
    }

    if (matchOnlyAnchor) {
      const anchorText = matchOnlyAnchor[1];
      return parse(`<a>${anchorText}</a>`, options1);
    }

    if (inputString.split(" ").length == 1) {
      return parse(`<a>${inputString.split(" ")[0]}</a>`, options3);
    }
    if (inputString.split(" ").length == 2) {
      return parse(`<a>${inputString.split(" ")[1]}</a>`, options3);
    }

    return null;
  }

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <Breadcrumb />
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>
              Stock Portfolio
            </h3>
          </div>
          {!manageView && (
            <>
              <div className="selection-area my-3">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="">Portfolio Name</label>
                      <select
                        name="portfolio_name"
                        className="form-select"
                        onChange={handleChange}
                        value={selectedPortfolioId}
                      >
                        <option>Select Portfolio</option>
                        {Array.isArray(portfolioNames) &&
                          portfolioNames.length > 0 &&
                          portfolioNames.map((item, index) => {
                            return (
                              <option
                                value={item?.idPortfolio}
                                key={"name" + index}
                              >
                                {item?.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="actions">
                      <button className="btn btn-primary" onClick={fetchData}>
                        GO
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={getAllStockForPolios}
                      >
                        MANAGE
                      </button>
                      {/* <button
                        className="btn btn-primary"
                        onClick={handleStockPortfolioStatus}
                      >
                        PORTFOLIO PROFIT AND LOSS
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
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
                </div>
                <div className="form-group d-flex align-items-center">
                  <div className="form-group d-flex align-items-center mb-0 me-3">
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
              <div className="table-responsive">
                <table
                  ref={tableRef}
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
                              onClick={() =>
                                handleSort(item.elementInternalName)
                              }
                            >
                              {item?.elementDisplayName}{" "}
                              {getSortIcon(item, sortConfig)}
                            </th>
                          );
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((item, index) => {
                      return (
                        <tr key={"tr" + index}>
                          {columnNames.map((inner, keyid) => {
                            const percentColumns = [
                              "element31",
                              "element34",
                              "element35",
                              "element7",
                              "element8",
                              "element9",
                              "element11",
                              "element13",
                            ];
                            if (
                              percentColumns.includes(
                                inner["elementInternalName"],
                                0
                              )
                            ) {
                              return (
                                <td key={"keyid" + keyid}>
                                  {(
                                    parse(
                                      item[inner["elementInternalName"]],
                                      options
                                    ) * 100
                                  ).toFixed(2)}
                                </td>
                              );
                            } else if (
                              inner.elementInternalName === "element1"
                            ) {
                              return (
                                <td key={"keyid" + keyid}>
                                  {extractAndConvert(
                                    item[inner.elementInternalName]
                                  )}
                                </td>
                              );
                            } else if (
                              inner.elementInternalName === "element10"
                            ) {
                              return (
                                <td key={"keyid" + keyid}>
                                  {Number(stockPrices[item.element71]).toFixed(
                                    2
                                  ) || "Loading..."}
                                </td>
                              );
                            } else {
                              return (
                                <td key={"keyid" + keyid}>
                                  {parse(
                                    item[inner["elementInternalName"]],
                                    options
                                  )}
                                </td>
                              );
                            }
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                  <thead>
                    <tr>
                      {filterData.length
                        ? columnNames.map((item, index) => {
                            if (item.elementInternalName === "element31") {
                              return (
                                <th key={index}>
                                  {calculateAveragePercentage(
                                    filterData,
                                    "element31"
                                  )}{" "}
                                  % <br />(
                                  {calculateAveragePercentage(
                                    tableData,
                                    "element31"
                                  )}
                                  ) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element33") {
                              return (
                                <th key={index}>
                                  {calculateAverage(filterData, "element33")} %{" "}
                                  <br />(
                                  {calculateAverage(tableData, "element33")}) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element34") {
                              return (
                                <th key={index}>
                                  {calculateAveragePercentage(
                                    filterData,
                                    "element34"
                                  )}{" "}
                                  % <br />(
                                  {calculateAveragePercentage(
                                    tableData,
                                    "element34"
                                  )}
                                  ) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element35") {
                              return (
                                <th key={index}>
                                  {calculateAveragePercentage(
                                    filterData,
                                    "element35"
                                  )}{" "}
                                  % <br />(
                                  {calculateAveragePercentage(
                                    tableData,
                                    "element35"
                                  )}
                                  ) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element9") {
                              return (
                                <th key={index}>
                                  {calculateAveragePercentage(
                                    filterData,
                                    "element9"
                                  )}{" "}
                                  % <br />(
                                  {calculateAveragePercentage(
                                    tableData,
                                    "element9"
                                  )}
                                  ) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element11") {
                              return (
                                <th key={index}>
                                  {calculateAveragePercentage(
                                    filterData,
                                    "element11"
                                  )}{" "}
                                  % <br />(
                                  {calculateAveragePercentage(
                                    tableData,
                                    "element11"
                                  )}
                                  ) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element12") {
                              return (
                                <th key={index}>
                                  {calculateAveragePercentage(
                                    filterData,
                                    "element12"
                                  )}{" "}
                                  % <br />(
                                  {calculateAveragePercentage(
                                    tableData,
                                    "element12"
                                  )}
                                  ) %
                                </th>
                              );
                            }
                            if (item.elementInternalName === "element22") {
                              return (
                                <th key={index}>
                                  {calculateAverage(filterData, "element22")} %{" "}
                                  <br />(
                                  {calculateAverage(tableData, "element22")}) %
                                </th>
                              );
                            } else {
                              return <th key={index}></th>;
                            }
                          })
                        : null}
                    </tr>
                  </thead>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={tableData}
                limit={limit}
                setCurrentPage={setCurrentPage}
                handlePage={handlePage}
              />
            </>
          )}
          {manageView && (
            <div className="manage mt-3">
              <div className="d-flex">
                <button
                  className="btn btn-primary me-2 mb-3"
                  onClick={handleProtfolioShow}
                >
                  Create New Portfolio
                </button>
                <button
                  className="btn btn-primary mx-2 mb-3"
                  onClick={() => {
                    setManageView(false);
                  }}
                >
                  View Portfolio
                </button>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="dt-buttons mb-3">
                  <button
                    className="dt-button buttons-pdf buttons-html5 btn-primary"
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
                <div className="form-group d-flex align-items-center">
                  <div className="form-group d-flex align-items-center mb-0 me-3">
                    <label
                      style={{ textWrap: "nowrap" }}
                      className="text-success ms-2 me-2 mb-0"
                    >
                      Show :{" "}
                    </label>
                    <select
                      name="limit"
                      className="form-select w-auto"
                      onChange={changeLimit2}
                      value={limit2}
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
                    onChange={stockFilter}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table
                  className="table border display no-footer dataTable"
                  role="grid"
                  aria-describedby="exampleStocksPair_info"
                  id="my-table"
                >
                  <thead>
                    <tr>
                      <th
                        onClick={() => {
                          handleSort2("name");
                        }}
                      >
                        Portfolio Name {getSortIcon("name", sortConfig2)}
                      </th>
                      <th
                        onClick={() => {
                          handleSort2("ticker");
                        }}
                      >
                        Symbol {getSortIcon("ticker", sortConfig2)}
                      </th>
                      <th className="sticky-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStockPortfolios.map((item, index) => {
                      return (
                        <tr key={"portfolio" + index}>
                          <td>{item?.name}</td>
                          <td>{item?.ticker}</td>
                          <td className="sticky-action">
                            <button
                              className="px-4 btn btn-primary"
                              onClick={() => {
                                handleEditModal(item?.name);
                              }}
                              title="Edit"
                            >
                              <i className="mdi mdi-pen"></i>
                            </button>
                            <button
                              className="px-4 btn btn-danger"
                              onClick={() => {
                                deleteStockPortFolio(item?.name);
                              }}
                              title="Delete"
                            >
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage2}
                totalItems={stockPortfolios}
                limit={limit2}
                setCurrentPage={setCurrentPage2}
                handlePage={handlePage2}
              />
            </div>
          )}
        </div>
        <Footer />
        <Modal show={show} onHide={handleClose} className="portfolio-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              {!editStatus ? "Create Portfolio" : "Update Portfolio"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group d-flex">
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Portfolio Name"
                    name="portfolioName"
                    value={formData.portfolioName}
                    onChange={portfolioInputs}
                    readOnly={editStatus ? true : false}
                  />
                  <button
                    className="btn btn-primary text-nowrap"
                    onClick={() => {
                      createPortfolio();
                    }}
                  >
                    {!editStatus ? "Create Portfolio" : "Update Portfolio"}
                  </button>
                  <div className="form-check ms-3 d-inline-block">
                    <input
                      style={{ marginTop: "0.1rem", cursor: "pointer" }}
                      className="form-check-input"
                      type="checkbox"
                      name="subscribersOnly"
                      id="subscribersOnly"
                      checked={formData.subscribersOnly}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          subscribersOnly: e.target.checked,
                        });
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="subscribersOnly"
                    >
                      Subscribers Only
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="dt-buttons mb-3"></div>
              <div className="form-group d-flex align-items-center">
                <div className="form-group d-flex align-items-center mb-0 me-3">
                  <label
                    style={{ textWrap: "nowrap" }}
                    className="text-success ms-2 me-2 mb-0"
                  >
                    Show :{" "}
                  </label>
                  <select
                    name="limit"
                    className="form-select w-auto"
                    onChange={changeLimit3}
                    value={limit3}
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
                  onChange={allStockFilter}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th
                      onClick={() => {
                        handleSort3("stockName");
                      }}
                    >
                      Select
                    </th>
                    <th
                      onClick={() => {
                        handleSort3("stockName");
                      }}
                    >
                      Symbol
                    </th>
                    <th>Share</th>
                    <th>Purchase Date</th>
                    <th>Purchase Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllStockPortfolios.length > 0 &&
                    filteredAllStockPortfolios.map((item, index) => {
                      const isChecked = selectedStocks.some(
                        (stock) => stock.stockName === item?.stockName
                      );
                      // console.log(item);
                      return (
                        <tr key={"stock" + index}>
                          <td>
                            <input
                              type="checkbox"
                              name="stockName"
                              defaultValue={item?.stockName}
                              defaultChecked={item?.share || item?.purchaseDate}
                              //onChange={(e) => portfolioInputs(e, index)}
                              onChange={(e) => {
                                selectStock(e, item?.stockName);
                              }}
                              checked={isChecked}
                            />
                          </td>
                          <td>{item?.stockName}</td>
                          <td>
                            <input
                              type="text"
                              // defaultValue={item?.share}
                              value={
                                selectedStocks.find(
                                  (s) => s.stockName === item?.stockName
                                )?.share || ""
                              }
                              name="share"
                              placeholder="Share"
                              className="form-control"
                              //onChange={(e) => portfolioInputs(e, index)}
                              onChange={(e) =>
                                updateSelectedStock(e, item?.stockName)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              // defaultValue={item?.purchaseDate}
                              value={
                                selectedStocks.find(
                                  (s) => s.stockName === item?.stockName
                                )?.purchaseDate || ""
                              }
                              name="purchaseDate"
                              className="form-control"
                              //onChange={(e) => portfolioInputs(e, index)}
                              onChange={(e) =>
                                updateSelectedStock(e, item?.stockName)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              // defaultValue={item?.purchasePrice}
                              value={
                                selectedStocks.find(
                                  (s) => s.stockName === item?.stockName
                                )?.purchasePrice || ""
                              }
                              name="purchasePrice"
                              placeholder="Purchase Price"
                              className="form-control"
                              //onChange={(e) => portfolioInputs(e, index)}
                              onChange={(e) =>
                                updateSelectedStock(e, item?.stockName)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <PaginationNew
              currentPage={currentPage3}
              totalItems={totalElements3}
              totalPage={totalPages3}
              limit={limit3}
              setCurrentPage={setCurrentPage3}
              handlePage={handlePage3}
            />
          </Modal.Body>
        </Modal>
        <Modal
          className="report-modal"
          show={reportModal}
          onHide={() => {
            setReportModal(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Report Table</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table report-table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Company</th>
                    <th>Description</th>
                    <th>Report Type</th>
                    <th>Report Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => {
                    return (
                      <tr key={"report" + index}>
                        <td>{item?.tickerName}</td>
                        <td>{item?.companyName}</td>
                        <td>
                          <p
                            style={{ maxWidth: "400px" }}
                            className="text-wrap"
                          >
                            {item?.description}
                          </p>
                        </td>
                        <td>{item?.catagoryType}</td>
                        <td>{item?.reportDate}</td>
                        <td>
                          <button
                            onClick={() => {
                              downloadReport(item?.reportfileDetails);
                            }}
                            className="btn me-2"
                          >
                            <img src="/icons/download.svg" alt="" />
                          </button>
                          <button
                            onClick={() => {
                              deleteReport(item?.idTickerReports);
                            }}
                            className="btn bg-danger"
                          >
                            <img src="/icons/trash-2.svg" alt="" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2">Showing {reportData.length} entries</p>
          </Modal.Body>
        </Modal>
        <Modal
          show={stockPortfolioShow}
          onHide={stockPortfoliohandleClose}
          className="portfolio-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedPortfolioText} Profit And Loss</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Company</th>
                    <th>Purchase Date</th>
                    <th>Purchase Price</th>
                    <th>Purchase Quantity</th>
                    <th>Invested Value</th>
                    <th>Current Date</th>
                    <th>Current Price</th>
                    <th>Merket Value</th>
                    <th>Profit/Loss</th>
                    <th>Profit/Loss%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>TSLA</td>
                    <td>TESLA</td>
                    <td>01-01-2020</td>
                    <td>100</td>
                    <td>1</td>
                    <td>100</td>
                    <td>30-08-2024</td>
                    <td>180</td>
                    <td>180</td>
                    <td style={{ color: "#00ff00" }}>80</td>
                    <td style={{ color: "#00ff00" }}>80%</td>
                  </tr>
                  <tr>
                    <td>NFLX</td>
                    <td>Netflix</td>
                    <td>01-01-2019</td>
                    <td>100</td>
                    <td>1</td>
                    <td>100</td>
                    <td>30-08-2024</td>
                    <td>80</td>
                    <td>80</td>
                    <td style={{ color: "#ff0000" }}>20</td>
                    <td style={{ color: "#ff0000" }}>20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
