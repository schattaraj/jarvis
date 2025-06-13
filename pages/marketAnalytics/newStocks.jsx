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
import { PaginationNew } from "../../components/PaginationNew";
const companyOverviewColumns = [
  "Symbol",
  "Name",
  "Price Change (%)",
  "Price ($)",
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
  "Date",
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
  const [activeView, setActiveView] = useState("Ticker Home");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(100);
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
  const context = useContext(Context);
  const toggleDescription = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleTableStateChange = (table) => {
    if (table != tableState) {
      setTableState(table);
      setCurrentPage(1);
    }
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
  useEffect(() => {
    switch (tableState) {
      case "companyOverview":
        fetchData(
          `getCompanyOverview?symbol=AAL&size=${
            limit != "all" ? limit : totalElements
          }&page=${currentPage - 1}`
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
      limit != "all" ? limit : totalElements
    }&page=${currentPage - 1}`
  ) => {
    try {
      context.setLoaderState(true);
      const getBonds = `/api/proxy?api=${api}`;
      const getBondsRes = await fetchWithInterceptor(getBonds, false);

      const newData =
        tableState == "companyOverview" ? getBondsRes?.content : getBondsRes;

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
      context.setLoaderState(true);
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
    fetchData();
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
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <Breadcrumb />
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
                    id="search"
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
                                        <p>{rowDataLowercase[colNameLower]}</p>
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
                              if (colNameLower === "date") {
                                content = (
                                  <td>{rowDataLowercase["exdividenddate"]}</td>
                                );
                              }
                              if (colNameLower === "price($)") {
                                content = <td>{rowDataLowercase["price"]}</td>;
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
        </div>
      </div>
    </>
  );
}
