import Navigation from "../../../components/navigation";
import Sidebar from "../../../components/sidebar";
import { useState, useEffect, useContext } from "react";
import parse from "html-react-parser";
import Modal from "react-bootstrap/Modal";
import Loader from "../../../components/loader";
import { Context } from "../../../contexts/Context";
import { Pagination } from "../../../components/Pagination";
import {
  ValueDisplay,
  calculateAverage,
  exportToExcel,
  formatDate,
  formatWithSeparator,
  generatePDF,
  getSortIcon,
  searchTable,
} from "../../../utils/utils";
import SliceData from "../../../components/SliceData";
import Swal from "sweetalert2";
import Breadcrumb from "../../../components/Breadcrumb";
import { Box, TablePagination, TextField } from "@mui/material";
import PortfolioTable from "../../../components/PorfolioTable";
import ReportTable from "../../../components/ReportTable";
export default function BondPortfolio() {
  const context = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [portfolioNames, setPortfolioNames] = useState([]);
  const [selectedPortfolioId, setPortfolioId] = useState("false");
  const [selectedPortfolioText, setSelectedPortfolioText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);
  const [bondPortfolioShow, setBondPortfolioShow] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(25);
  const [limit2, setLimit2] = useState(25);
  const [subscriberOnly, setSubscriberOnly] = useState(false);
  const [countApiCall, setCountApiCall] = useState(0);
  const [allBondPortfoilo, setAllBondPortfolio] = useState([]);
  const [portfolioPayload, setPortfolioPayload] = useState({
    myArr: [],
    portfolioName: "",
    share: "",
    purchaseDate: "",
    purchasePrice: "",
  });
  const [manageView, setManageView] = useState(false);
  const [bondPortfolios, setBondportfolios] = useState([]);
  const [filteredBondPortfolios, setfilteredBondportfolios] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [sortConfig2, setSortConfig2] = useState({
    key: null,
    direction: null,
  });
  const [editModal, setEditModal] = useState(false);
  const [editPortfolioName, setEditPortfolioName] = useState("");
  const [portfolioName, setPortfolioName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [reportTicker, setReportTicker] = useState("");
  const [profitValue, setProfitValue] = useState([]);
  const options = {
    replace: (elememt) => {
      if (elememt.name === "a") {
        // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
        return (
          <a
            onClick={(e) => {
              handleClick(e, elememt.children[0].data);
            }}
            href="#"
          >
            {parse(elememt.children[0].data)}
          </a>
        );
      }
    },
  };

  const handleChange = (e) => {
    const selectedText = e.target.selectedOptions[0].text;
    setPortfolioId(e.target.value);
    setSelectedPortfolioText(selectedText);
  };
  const fetchPortfolioNames = async () => {
    try {
      const portfolioApi = await fetch(
        "https://jharvis.com/JarvisV2/getAllBondPortFolioTicker?userId=2&_=1716292770931"
      );
      const portfolioApiRes = await portfolioApi.json();
      setPortfolioNames(portfolioApiRes);
      setPortfolioId(portfolioApiRes[0]?.idBondPortfolio);
      setCountApiCall(countApiCall + 1);
    } catch (e) {
      console.log("error", e);
    }
  };
  const fetchColumnNames = async () => {
    try {
      // const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1716356733282")
      const columnApi = await fetch(
        "https://jharvis.com/JarvisV2/getColumnsBondPortfolio?metaDataName=Bondpricing_Master"
      );
      const columnApiRes = await columnApi.json();
      const extraColumns = [
        {
          elementId: null,
          elementName: "Stock",
          elementInternalName: "element10",
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
          elementInternalName: "element11",
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
          elementName: "Average Years to Maturity",
          elementInternalName: "averageYearToMaturity",
          elementDisplayName: "Average Years to Maturity",
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
          elementName: "Current Yield",
          elementInternalName: "element95",
          elementDisplayName: "Current Yield",
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
      setColumnNames([...columnApiRes, ...extraColumns]);
    } catch (e) {
      console.log("error", e);
    }
  };
  const fetchData = async () => {
    context.setLoaderState(true);
    try {
      if (selectedPortfolioId) {
        const getPortfolio = await fetch(
          "https://jharvis.com/JarvisV2/getBondPortFolioSet?idPortfolio=" +
            selectedPortfolioId
        );
        const getPortfolioRes = await getPortfolio.json();
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
    }
    context.setLoaderState(false);
  };
  const getAllStock = async () => {
    context.setLoaderState(true);
    try {
      const allStocksApi = await fetch(
        "https://jharvis.com/JarvisV2/getAllBondForPolio?_=1716357445057"
      );
      const allStocksApiRes = await allStocksApi.json();
      setAllBondPortfolio(allStocksApiRes);
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };
  const handleShow = () => {
    if (selectedStocks.length > 0) {
      Swal.fire({
        title: "Do you want to clear the previous filled data?",
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          setSelectedStocks([]);
          setPortfolioName("");
          setSearchQuery("");
          setShow(true);
        } else if (result.isDenied) {
          setShow(true);
        }
      });
      return;
    } else {
    }
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const portfolioInputs = (e) => {
    setPortfolioPayload({
      ...portfolioPayload,
      [e.target.name]: e.target.value,
    });
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
    // console.log('search', e.target.value)
    const value = e.target.value;
    const filtered = tableData.filter((elememt) =>
      elememt.element4.toLowerCase().includes(value.toLowerCase())
    );
    setFilterData(searchTable(tableData, value));
  };
  const handleClick = (e, name) => {
    e.preventDefault();
    const tickerName = name.slice(name.indexOf("(") + 1, name.indexOf(")"));
    setReportTicker(tickerName);
    setReportModal(true);
  };
  const changeLimit = (e) => {
    setLimit(e.target.value);
  };
  const changeLimit2 = (e) => {
    setLimit2(e.target.value);
  };
  const handlePage2 = async (action) => {
    switch (action) {
      case "prev":
        setCurrentPage(currentPage2 - 1);
        break;
      case "next":
        setCurrentPage(currentPage2 + 1);
        break;
      default:
        setCurrentPage(currentPage2);
        break;
    }
  };
  const getAllBondForPolios = async () => {
    setManageView(true);
    context.setLoaderState(true);
    try {
      const allBondApi = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL_V2 +
          "getAllBondPortfolio?userId=2&_=1721819897846"
      );
      const allBondApiRes = await allBondApi.json();
      setBondportfolios(allBondApiRes);
    } catch (error) {}
    context.setLoaderState(false);
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
  const filter2 = (e) => {
    const value = e.target.value;
    setfilteredBondportfolios(searchTable(bondPortfolios, value));
  };
  const handleEditModal = (name) => {
    setEditModal(true);
    setEditPortfolioName(name);
  };
  const deleteBondPortFolio = (name) => {
    Swal.fire({
      title: "Are you sure ?",
      icon: "warning",
      confirmButtonText: "Delete",
      showCancelButton: true,
      customClass: { confirmButton: "btn-danger" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        context.setLoaderState(true);
        try {
          const deleteApi = await fetch(
            `https://jharvis.com/JarvisV2/deleteBondPortfolioByName?name=${name}&_=${new Date().getTime()}`
          );
          const deleteApiRes = deleteApi.json();
          getAllBondForPolios();
        } catch (error) {
          console.log("Error", error);
        }
        context.setLoaderState(false);
      }
    });
  };
  const validateStocks = () => {
    const newErrors = {};
    selectedStocks.forEach((stock) => {
      if (!stock.share)
        newErrors[stock.name] = {
          ...newErrors[stock.name],
          share: "Share is required",
        };
      if (!stock.purchaseDate)
        newErrors[stock.name] = {
          ...newErrors[stock.name],
          purchaseDate: "Purchase Date is required",
        };
      if (!stock.purchasePrice)
        newErrors[stock.name] = {
          ...newErrors[stock.name],
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
  const createPortfolio = async () => {
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

    if (!portfolioName) {
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
        title: "You need to select minimum 1 Bond to create Portfolio",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_BASE_URL_V2}createBondPortfolio?name=${portfolioName}&visiblePortFolio=yes&userId=2`;
    const formData = new FormData();
    selectedStocks.forEach((stock) => {
      const dataString = `${stock?.name.split(" |")[0]}~${stock.share}~${
        stock.purchaseDate
      }~${stock.purchasePrice}`;
      formData.append(`myArray[]`, dataString);
    });
    context.setLoaderState(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      setShow(false);
      getAllBondForPolios();
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
    context.setLoaderState(false);
  };
  const selectStock = (e, issuerName) => {
    const isChecked = e.target.checked;

    setSelectedStocks((prevStocks) => {
      if (isChecked) {
        // Add stock if checkbox is checked
        // console.log("Output", { name: issuerName, share: "", purchaseDate: "", purchasePrice: "" });
        return [
          ...prevStocks,
          { name: issuerName, share: "", purchaseDate: "", purchasePrice: "" },
        ];
      } else {
        // console.log("Output", prevStocks.filter(stock => stock.name !== issuerName));
        // Remove stock if checkbox is unchecked
        return prevStocks.filter((stock) => stock.name !== issuerName);
      }
    });
  };
  const updateSelectedBond = (e, issuerName) => {
    const { name, value } = e.target;

    setSelectedStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.name === issuerName ? { ...stock, [name]: value } : stock
      )
    );
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredPortfolio = allBondPortfoilo.filter((row) =>
    row.issuerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const closeEditModal = () => {
    setEditModal(false);
  };
  const closeReportModal = () => {
    setReportModal(false);
  };
  useEffect(() => {
    fetchPortfolioNames();
    fetchColumnNames();
    getAllStock();
  }, [manageView]);
  useEffect(() => {
    if (countApiCall == 1) {
      fetchData();
    }
  }, [countApiCall]);
  useEffect(() => {
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
      if (dataLimit == "all") {
        dataLimit = items?.length;
      }
      const startIndex = (currentPage - 1) * dataLimit;
      const endIndex = startIndex + dataLimit;
      items = items.slice(startIndex, endIndex);
      setFilterData(items);
    }
  }, [currentPage, tableData, sortConfig, limit]);
  useEffect(() => {}, [allBondPortfoilo]);
  useEffect(() => {
    if (bondPortfolios.length > 0) {
      let items = [...bondPortfolios];
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
      let dataLimit = limit;
      if (dataLimit == "all") {
        dataLimit = items?.length;
      }
      const startIndex = (currentPage2 - 1) * dataLimit;
      const endIndex = startIndex + dataLimit;
      items = items.slice(startIndex, endIndex);
      setfilteredBondportfolios(items);
    }
  }, [currentPage2, bondPortfolios, sortConfig2, limit2]);

  const handleBondPortfolioStatus = () => {
    bondPortfoliohandleShow();
  };

  const bondPortfoliohandleShow = () => {
    setBondPortfolioShow(true);
  };

  const bondPortfoliohandleClose = () => {
    setBondPortfolioShow(false);
    setSelectedPortfolioText("");
  };
  const totalElement24 = profitValue?.reduce((sum, item) => {
    const value = parseFloat(item);
    return sum + (isNaN(value) ? 0 : value); // Avoid NaN
  }, 0);
  const totalYearMatyrity = tableData.reduce(
    (acc, item) => {
      const purchaseVolume = parseFloat(item.element22);
      const value = purchaseVolume * parseFloat(item.element95);
      acc.totalValue += isNaN(value) ? 0 : value;
      acc.totalPV += isNaN(purchaseVolume) ? 0 : purchaseVolume;
      return acc;
    },
    { totalValue: parseFloat(0), totalPV: parseFloat(0) }
  );

  const totalYTW = tableData.reduce(
    (acc, item) => {
      const purchaseVolume = parseFloat(item.element22);
      const value = purchaseVolume * parseFloat(item.element3);
      acc.totalValue += isNaN(value) ? 0 : value;
      acc.totalPV += isNaN(purchaseVolume) ? 0 : purchaseVolume;
      return acc;
    },
    { totalValue: parseFloat(0), totalPV: parseFloat(0) }
  );

  const totalPurchasePrice = tableData.reduce(
    (acc, item) => {
      const purchaseVolume = parseFloat(item.element22);
      const value = purchaseVolume * parseFloat(item.element21);
      acc.totalValue += isNaN(value) ? 0 : value;
      acc.totalPV += isNaN(purchaseVolume) ? 0 : purchaseVolume;
      return acc;
    },
    { totalValue: parseFloat(0), totalPV: parseFloat(0) }
  );

  const totalPrice = tableData.reduce(
    (acc, item) => {
      const purchaseVolume = parseFloat(item.element22);
      const value = purchaseVolume * parseFloat(item.element9);
      acc.totalValue += isNaN(value) ? 0 : value;
      acc.totalPV += isNaN(purchaseVolume) ? 0 : purchaseVolume;
      return acc;
    },
    { totalValue: parseFloat(0), totalPV: parseFloat(0) }
  );

  const totalAvgYearsToMaturity = filterData.reduce(
    (acc, item) => {
      const purchaseVolume = parseFloat(item.element22);
      const today = new Date();
      const maturityDate = new Date(item["element7"]);
      // Calculate the difference in milliseconds
      const diffInMilliseconds = maturityDate - today;
      // Convert milliseconds to days
      const diffInDays = Math.ceil(
        diffInMilliseconds / (1000 * 60 * 60 * 24) / 360
      );
      const value = purchaseVolume * parseFloat(diffInDays);
      acc.totalValue += isNaN(value) ? 0 : value;
      acc.totalPV += isNaN(purchaseVolume) ? 0 : purchaseVolume;
      return acc;
    },
    { totalValue: parseFloat(0), totalPV: parseFloat(0) }
  );

  const getProfitValue = (price, purchasePrice, purchaseVolume) => {
    const value =
      ((parseFloat(price) - parseFloat(purchasePrice)) *
        (parseFloat(purchaseVolume) * 1000)) /
      100;
    return Number(value).toFixed(2);
  };
  useEffect(() => {
    const calculatedProfits = filterData.map((item) =>
      getProfitValue(item["element9"], item["element21"], item["element22"])
    );
    setProfitValue(calculatedProfits);
  }, [filterData]);

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
              Bond Portfolio
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
                        {portfolioNames.length > 0 &&
                          portfolioNames.map((item, index) => {
                            return (
                              <option
                                value={item?.idBondPortfolio}
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
                        onClick={getAllBondForPolios}
                      >
                        Manage
                      </button>
                      {/* <button className='btn btn-primary' onClick={handleBondPortfolioStatus}>Portfolio Profit And Loss</button> */}
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
                      {columnNames.length > 0 &&
                        columnNames.map((item, index) => {
                          const columnClass =
                            item.elementInternalName === "element1"
                              ? "sticky-column"
                              : "";
                          const wrapText =
                            item["elementInternalName"] == "element11" ||
                            item["elementInternalName"] == "element21" ||
                            item["elementInternalName"] == "element22" ||
                            item["elementInternalName"] ==
                              "averageYearToMaturity" ||
                            item["elementInternalName"] == "element95" ||
                            item["elementInternalName"] == "element23"
                              ? "text-wrap my-0 d-flex gap-2"
                              : "";
                          return (
                            <th
                              key={index}
                              className={columnClass}
                              style={{ left: 0 }}
                              onClick={() =>
                                handleSort(item?.elementInternalName)
                              }
                            >
                              <p className={wrapText}>
                                {item?.elementDisplayName}{" "}
                                {getSortIcon(
                                  item?.elementInternalName,
                                  sortConfig
                                )}
                              </p>
                            </th>
                          );
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((item, index) => {
                      const profit = getProfitValue(
                        item["element9"],
                        item["element21"],
                        item["element22"]
                      );

                      return (
                        <tr key={"tr" + index}>
                          {columnNames.map((inner, keyid) => {
                            // return <td key={"keyid" + keyid}>{parse(item['element' + (keyid + 1)], options)}</td>
                            const columnClass =
                              inner.elementInternalName === "element1"
                                ? "sticky-column"
                                : "";

                            // if(keyid === 0){
                            //   return <td key={"keyid" + keyid} className={columnClass} style={{left: 0}}>{item[inner['elementInternalName']]}</td>
                            // }
                            if (inner["elementInternalName"] == "element10") {
                              return (
                                <td key={"keyid" + keyid}>
                                  <a
                                    onClick={(e) => {
                                      handleClick(
                                        e,
                                        item[inner["elementInternalName"]]
                                      );
                                    }}
                                  >
                                    {item[inner["elementInternalName"]]}
                                  </a>
                                </td>
                              );
                            }
                            if (
                              inner["elementInternalName"] ==
                              "averageYearToMaturity"
                            ) {
                              const today = new Date();
                              const maturityDate = new Date(item["element7"]);
                              // Calculate the difference in milliseconds
                              const diffInMilliseconds = maturityDate - today;

                              // Convert milliseconds to days
                              const diffInDays = Math.ceil(
                                diffInMilliseconds / (1000 * 60 * 60 * 24) / 360
                              );
                              return (
                                <td key={"keyid" + keyid}>{diffInDays}</td>
                              );
                            }
                            if (inner["elementInternalName"] == "element3") {
                              return (
                                <td key={"keyid" + keyid}>
                                  {Number(
                                    Math.ceil(
                                      item[inner["elementInternalName"]] * 100
                                    ) / 100
                                  ).toFixed(2)}
                                </td>
                              );
                            }
                            if (inner["elementInternalName"] == "element24") {
                              return (
                                <td key={"keyid" + keyid}>
                                  <ValueDisplay
                                    value={formatWithSeparator(profit)}
                                  />
                                </td>
                              );
                            }
                            if (inner["elementInternalName"] == "element95") {
                              return (
                                <td key={"keyid" + keyid}>
                                  {Number(
                                    item[inner["elementInternalName"]]
                                  ).toFixed(2)}
                                  %
                                </td>
                              );
                            }
                            return (
                              <td
                                key={"keyid" + keyid}
                                className={columnClass}
                                style={{ left: keyid === 0 ? 0 : "auto" }}
                              >
                                {inner["elementInternalName"] == "lastUpdatedAt"
                                  ? formatDate(item["lastUpdatedAt"])
                                  : typeof item[inner["elementInternalName"]] ==
                                    "string"
                                  ? parse(
                                      item[inner["elementInternalName"]],
                                      options
                                    )
                                  : item[inner["elementInternalName"]]}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* <tfoot className='fixed'>
                                <tr>
                                    <td colSpan={2}>Total Amount</td>
                                    <td>{formatAmount(totalAssests)}</td>
                                    <td></td>
                                    <td>{formatAmount(totalAssestsManagement)}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot> */}
                  <tfoot>
                    <tr>
                      {columnNames.map((inner, index) => {
                        if (inner["elementInternalName"] == "element24") {
                          return (
                            <td key={index}>
                              {formatWithSeparator(totalElement24)}
                            </td>
                          );
                        } else if (
                          inner["elementInternalName"] === "element21"
                        ) {
                          return (
                            <td key={index}>
                              {Number(
                                totalPurchasePrice.totalValue /
                                  totalPurchasePrice.totalPV
                              ).toFixed(2)}
                            </td>
                          );
                        } else if (
                          inner["elementInternalName"] === "element9"
                        ) {
                          return (
                            <td key={index}>
                              {Number(
                                totalPrice.totalValue / totalPrice.totalPV
                              ).toFixed(2)}
                            </td>
                          );
                        } else if (
                          inner["elementInternalName"] ===
                          "averageYearToMaturity"
                        ) {
                          return (
                            <td key={index}>
                              {Number(
                                totalAvgYearsToMaturity.totalValue /
                                  totalAvgYearsToMaturity.totalPV
                              ).toFixed(2)}
                            </td>
                          );
                        } else if (
                          inner["elementInternalName"] === "element95"
                        ) {
                          return (
                            <td key={index}>
                              {Number(
                                totalYearMatyrity.totalValue /
                                  totalYearMatyrity.totalPV
                              ).toFixed(2)}
                            </td>
                          );
                        } else if (
                          inner["elementInternalName"] === "element3"
                        ) {
                          return (
                            <td key={index}>
                              {Number(
                                totalYTW.totalValue / totalYTW.totalPV
                              ).toFixed(2)}
                            </td>
                          );
                        } else {
                          return <td></td>;
                        }
                      })}
                    </tr>
                    {/* <tr>
          <td>Total</td>
          <td>{totalElement24.toFixed(2)}</td>
        </tr> */}
                  </tfoot>
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
                  className="btn btn-primary mx-2 mb-3 ms-0"
                  onClick={handleShow}
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
                      generatePDF();
                    }}
                  >
                    <span className="mdi mdi-file-pdf-box me-2"></span>
                    <span>PDF</span>
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
                    onChange={filter2}
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
                    onChange={changeLimit2}
                    value={limit}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="all">All</option>
                  </select>
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
                        PortFolio Name {getSortIcon("name", sortConfig2)}
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
                    {filteredBondPortfolios.map((item, index) => {
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
                                deleteBondPortFolio(item?.name);
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
                totalItems={bondPortfolios}
                limit={limit2}
                setCurrentPage={setCurrentPage2}
                handlePage={handlePage2}
              />
            </div>
          )}
        </div>
        <Modal show={show} onHide={handleClose} className="portfolio-modal">
          <Modal.Header closeButton>
            <Modal.Title>Create Portfolio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group d-flex">
                  <input
                    type="text"
                    className="form-control me-3"
                    value={portfolioName || ""}
                    placeholder="Portfolio Name"
                    name="portfolioName"
                    onChange={(e) => setPortfolioName(e.target.value)}
                  />
                  <button
                    className="btn btn-primary text-nowrap"
                    onClick={() => {
                      createPortfolio();
                    }}
                  >
                    Create Portfolio
                  </button>
                  <div className="form-check ms-3 d-inline-block">
                    <input
                      style={{ marginTop: "0.1rem", cursor: "pointer" }}
                      className="form-check-input"
                      type="checkbox"
                      name="subscribersOnly"
                      id="subscribersOnly"
                      checked={subscriberOnly}
                      onChange={(e) => {
                        setSubscriberOnly(e.target.checked);
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
              <div className="col-md-4">
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Purchase Date</th>
                    <th>Purchase Price</th>
                  </tr>
                </thead>
                <tbody>
                  {allBondPortfoilo.length > 0 &&
                    filteredPortfolio
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => {
                        const isChecked = selectedStocks.some(
                          (stock) => stock.name === item?.issuerName
                        );
                        return (
                          <tr key={"stock" + index}>
                            <td>
                              <input
                                type="checkbox"
                                name="stockChkBox"
                                value={item?.idBond || ""}
                                onChange={(e) => {
                                  selectStock(e, item?.issuerName);
                                }}
                                checked={isChecked}
                              />
                            </td>
                            <td>{item?.issuerName}</td>
                            <td>
                              <input
                                type="text"
                                value={
                                  selectedStocks.find(
                                    (stock) => stock.name === item?.issuerName
                                  )?.share || ""
                                }
                                name="share"
                                placeholder="Quantity"
                                className="form-control"
                                onChange={(e) =>
                                  updateSelectedBond(e, item?.issuerName)
                                }
                                style={{ minWidth: "150px" }}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={
                                  selectedStocks.find(
                                    (stock) => stock.name === item?.issuerName
                                  )?.purchaseDate || ""
                                }
                                name="purchaseDate"
                                className="form-control"
                                onChange={(e) =>
                                  updateSelectedBond(e, item?.issuerName)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={
                                  selectedStocks.find(
                                    (stock) => stock.name === item?.issuerName
                                  )?.purchasePrice || ""
                                }
                                name="purchasePrice"
                                placeholder="Purchase Price"
                                className="form-control"
                                onChange={(e) =>
                                  updateSelectedBond(e, item?.issuerName)
                                }
                                style={{ minWidth: "150px" }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
              }}
            >
              <TablePagination
                rowsPerPageOptions={[20, 50, 100]}
                component="div"
                count={allBondPortfoilo.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Modal.Body>
        </Modal>
        {/* <Modal show={editModal} onHide={()=>{setEditModal(false)}} className='portfolio-modal'>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Portfolio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group d-flex">
                                    <input type="text" className="form-control me-3" placeholder='Portfolio Name' name="portfolioName" value={editPortfolioName} readOnly />
                                    <button className='btn btn-primary text-nowrap' onClick={() => { }}>Edit Portfolio</button>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Symbol</th>
                                        <th>Share</th>
                                        <th>Purchase Date</th>
                                        <th>Purchase Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allBondPortfoilo.length > 0 && allBondPortfoilo.map((item, index) => {
                                            return <tr key={"stock" + index}><td><input type="checkbox" name='stockChkBox' value={item?.stockName} /></td><td>{item?.issuerName}</td><td><input type="text" value={item?.share} name="share" placeholder="Share" className='form-control' onChange={portfolioInputs} /></td><td><input type="date" value={item?.purchaseDate} name="purchaseDate" className='form-control' onChange={portfolioInputs} /></td><td><input type="text" value={item?.purchasePrice} name="purchasePrice" placeholder='Purchase Price' className='form-control' onChange={portfolioInputs} /></td></tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal> */}
        <PortfolioTable
          url={`${
            process.env.NEXT_PUBLIC_BASE_URL_V2
          }getAllBondForPolioByName?name=${editPortfolioName}&_=${new Date().getTime()}`}
          open={editModal}
          heading={"Edit Portfolio"}
          handleCloseModal={closeEditModal}
          editPortfolioName={editPortfolioName}
          getAllBondForPolios={getAllBondForPolios}
        />
        <Modal
          show={bondPortfolioShow}
          onHide={bondPortfoliohandleClose}
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
                    <th>Purchase Quantity (Lot)</th>
                    <th>Invested Value</th>
                    <th>Current Date</th>
                    <th>Current Price</th>
                    <th>Market Value</th>
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
                    <td>1000</td>
                    <td>100000</td>
                    <td>30-08-2024</td>
                    <td>180000</td>
                    <td>180000</td>
                    <td style={{ color: "#00ff00" }}>80</td>
                    <td style={{ color: "#00ff00" }}>80%</td>
                  </tr>
                  <tr>
                    <td>NFLX</td>
                    <td>Netflix</td>
                    <td>01-01-2019</td>
                    <td>100</td>
                    <td>1000</td>
                    <td>100000</td>
                    <td>30-08-2024</td>
                    <td>80000</td>
                    <td>80000</td>
                    <td style={{ color: "#ff0000" }}>20</td>
                    <td style={{ color: "#ff0000" }}>20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>
        <ReportTable
          name={reportTicker}
          open={reportModal}
          handleCloseModal={closeReportModal}
          news={true}
        />
      </div>
    </>
  );
}
