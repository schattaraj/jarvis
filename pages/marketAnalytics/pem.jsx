import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import Loader from "../../components/loader";
import { Context } from "../../contexts/Context";
import parse from "html-react-parser";
import { Pagination } from "../../components/Pagination";
import SliceData from "../../components/SliceData";
import {
  amountSeperator,
  calculateAverage,
  exportToExcel,
  formatCurrency,
  generatePDF,
  getSortIcon,
  searchTable,
} from "../../utils/utils";
import { Form, Dropdown } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
import ReportTable from "../../components/ReportTable";
import { useRouter } from "next/router";
export default function PemDetails() {
  const context = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [portfolioNames, setPortfolioNames] = useState([]);
  const [selectedPortfolioId, setPortfolioId] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [reportTicker, setReportTicker] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const [show, setShow] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columnNames.map((col) => col.elementInternalName)
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef(null);
  const firstColRef = useRef(null);
  const [firstColWidth, setFirstColWidth] = useState(0);

  const router = useRouter();
  useEffect(() => {
    if (firstColRef.current) {
      setFirstColWidth(firstColRef.current.offsetWidth);
    }
  }, [firstColRef, filterData, visibleColumns]);
  const fetchColumnNames = async () => {
    try {
      const columnApi = await fetch(
        "https://jharvis.com/JarvisV2/getColumns?metaDataName=PEM_NEW&_=1725280625344"
      );
      const columnApiRes = await columnApi.json();
      columnApiRes.push(...extraColumns);
      // columnApiRes.splice(0, 0, extraColumns[0])
      // columnApiRes.push(...extraColumns.slice(1))
      setColumnNames(columnApiRes);
      const defaultCheckedColumns = columnApiRes.map(
        (col) => col.elementInternalName
      );
      setVisibleColumns(defaultCheckedColumns);
    } catch (e) {
      console.log("error", e);
    }
  };

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

  const fetchData = async () => {
    context.setLoaderState(true);
    try {
      const getBonds = await fetch(
        "https://jharvis.com/JarvisV2/getImportsData?metaDataName=PEM_NEW&_=1725280825673"
      );
      const getBondsRes = await getBonds.json();
      setTableData(getBondsRes);
      setFilterData(getBondsRes);
      // setTimeout(() => {
      //     setTableData(getImportsData)
      //     setFilterData(getImportsData)
      // }, 1500)
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
  };

  const handleClick = (elm) => {
    console.log("element", elm);
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
  const changeLimit = (e) => {
    setLimit(e.target.value);
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
      const formData = new FormData(form);
      const upload = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL_V2 + "uploadFilePEM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formData,
        }
      );
      const uploadRes = await upload.json();
      if (upload.status == 400) {
        Swal.fire({
          title: uploadRes?.message,
          icon: "warning",
          confirmButtonColor: "var(--primary)",
        });
      }
      console.log("form", form, upload);
    } catch (error) {
      console.log("Error", error);
    }
    context.setLoaderState(false);
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
    fetchData();
  }, []);
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
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (path) => {
    setShow(true);
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

  const handleReportData = (data) => {
    setReportTicker(data);
    setReportModal(true);
  };

  const anchorOptions = {
    replace: (elememt) => {
      if (elememt?.data) {
        return (
          <a
            onClick={() => {
              handleReportData(elememt?.data);
            }}
            href="javascript:void(0)"
          >
            {typeof elememt?.data == "string"
              ? parse(elememt?.data)
              : elememt?.data}
          </a>
        );
      }
    },
  };

  function extractAndConvert(inputString) {
    return parse(inputString, anchorOptions);
  }

  const closeReportModal = () => {
    setReportModal(false);
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <Breadcrumb />
            <div
              className={`collapsible-container ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <span></span>
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
                +2 Action
              </button>
              <div
                className="collapsible-content"
                style={{ maxWidth: "max-content", width: contentWidth }}
                ref={contentRef}
              >
                <button
                  className={`h-100 collapsible-item`}
                  type="button"
                  title="PEM Details"
                  onClick={() => {
                    router.push("/marketAnalytics/pem-details");
                  }}
                >
                  <span>PEM Details</span>
                </button>
                <button
                  className={`h-100 collapsible-item`}
                  type="button"
                  title="PEM Rule"
                  onClick={() => {
                    router.push("/marketAnalytics/pem-rule");
                  }}
                >
                  <span>PEM Rule</span>
                </button>
              </div>
            </div>
          </div>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>
              PEM NEW
            </h3>
          </div>
          <div className="selection-area my-3">
            <Form onSubmit={uploadFile} encType="multipart/form-data">
              <input type="hidden" name="metaDataName" value="PEM" />
              <div className="row align-items-end">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="uploadFile">Upload File</label>
                    <input
                      id="uploadFile"
                      type="file"
                      name="myfile"
                      className="border-1 form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="actions">
                    <button className="btn btn-primary mb-0" type="submit">
                      Upload
                    </button>
                    <button
                      className="btn btn-primary mb-0"
                      type="button"
                      onClick={handleShow}
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
            </Form>
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
                        id={`pemNew-selectAll`}
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
                          id={`${column.elementDisplayName}${index}`}
                        />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {/* <div>
                                        <Link href="/marketAnalytics/pem-details">
                                            <button className="dt-button buttons-excel buttons-html5 btn-primary mx-3" type="button"><span>PEM Details</span></button>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link href="/marketAnalytics/pem-rule">
                                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span>PEM Rule</span></button>
                                        </Link>
                                    </div> */}
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
                  {columnNames.map((columnName, index) => {
                    const columnClass =
                      columnName.elementInternalName === "element1" || columnName.elementInternalName === "element2" ? "sticky-column" : "";
                    return (
                      visibleColumns.includes(
                        columnName.elementInternalName
                      ) && (
                        <th
                          key={index}
                          ref={columnName.elementInternalName === "element1" ? firstColRef : null}
                          className={columnClass}
                          style={{
                            left:
                              columnName.elementInternalName === "element1"
                                ? 0
                                : columnName.elementInternalName === "element2"
                                ? firstColWidth
                                : "auto",
                          }}
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
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filterData.map((rowData, rowIndex) => (
                  <tr key={rowIndex} style={{ overflowWrap: "break-word" }}>
                    {columnNames.map((columnName, colIndex) => {
                      if (
                        !visibleColumns.includes(columnName.elementInternalName)
                      )
                        return null;
                      let content;

                      if (columnName.elementInternalName === "element3") {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName] * 1000
                          ) / 1000000 || 0
                        ).toFixed(2);
                        content = formatCurrency(content);
                      } else if (
                        columnName.elementInternalName === "element5"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) * 100 || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element6"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) * 100 || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element7"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) * 100 || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element26"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) * 100 || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element27"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) * 100 || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element9"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element10"
                      ) {
                        content = (
                          Number.parseFloat(
                            rowData[columnName.elementInternalName]
                          ) || 0
                        ).toFixed(2);
                      } else if (
                        columnName.elementInternalName === "element2"
                      ) {
                        content = extractAndConvert(
                          rowData[columnName.elementInternalName]
                        );
                      } else if (
                        columnName.elementInternalName === "lastUpdatedAt"
                      ) {
                        content = new Date(
                          rowData[columnName.elementInternalName]
                        ).toLocaleDateString();
                      } else if (
                        columnName.elementInternalName === "idMarketData"
                      ) {
                        content = rowData[columnName.elementInternalName];
                        return (
                          <td key={colIndex}>
                            <button className="btn btn-success">
                              <i className="mdi mdi-pen"></i>
                            </button>
                          </td>
                        );
                      } else {
                        content = rowData[columnName.elementInternalName];
                      }

                      if (typeof content == "string") {
                        content = parse(content, options);
                      }
                      const numericValue = parseFloat(content);
                      if (!isNaN(numericValue)) {
                        content = numericValue.toFixed(2);
                      }
                      // return <td key={colIndex}>{parse(JSON.stringify(content),options)}</td>;
                      const columnClass =
                        columnName.elementInternalName === "element1" || columnName.elementInternalName === "element2" ? "sticky-column" : "";
                      return (
                        <td
                          key={colIndex}
                          className={columnClass}
                          style={{
                            left:
                              columnName.elementInternalName === "element1"
                                ? 0
                                : columnName.elementInternalName === "element2"
                                ? firstColWidth
                                : "auto",
                          }}
                        >
                          {content}
                        </td>
                      );
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
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          className="pem-new-calculate-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Analysis - PEM</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="row">
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Revenue as a % of TAM
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Organic Sales Company
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Organic Growth TAM
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Fwd EV/Sales
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Price/Earnings
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Price/Free Cash Flow
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Revenue Consistency
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Normalized ROIC
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      FCF Margin
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Fwd Ebitda growth rate
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Ebitda Margins Expand
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      FCF Margins Expand
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      CompetitiveEnvironment
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Value Proposition
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>

                <div className="col-sm-2">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      rate % last 12 months
                    </label>
                    <select className="form-select">
                      <option value="0">-Select-</option>
                      <option value="<">Less Than</option>
                      <option value=">">Greater Than</option>
                      <option value="<=">Less Than Or Equal</option>
                      <option value=">=">Greater Than Or Equals</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-group">
                    <label className="form-label">Value</label>
                    <input type="text" name="" className="form-control" />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" class="btn btn-secondary">
              Cancel
            </button>
            <button type="button" class="btn btn-primary">
              Reset
            </button>
            <button type="button" class="btn btn-primary">
              Compare
            </button>
          </Modal.Footer>
        </Modal>
        <ReportTable
          name={reportTicker}
          open={reportModal}
          handleCloseModal={closeReportModal}
        />
      </div>
    </>
  );
}
