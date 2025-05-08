import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import parse from "html-react-parser";
import Modal from "react-bootstrap/Modal";
import Loader from "../../components/loader";
import { Context } from "../../contexts/Context";
import { Pagination } from "../../components/Pagination";
import Select from "react-select";
import { formatDateString, getRecentReports } from "../../utils/utils";
import Breadcrumb from "../../components/Breadcrumb";
import { Form } from "react-bootstrap";
import PDFViewer from "../../components/PDFViewer";
import SliceData from "../../components/SliceData";

export default function ReportsLibrary() {
  const context = useContext(Context);
  const columnNames = [
    {
      elementDisplayName: "Ticker Name",
      elementInternalName: "tickerName",
    },
    {
      elementDisplayName: "Company Name",
      elementInternalName: "companyName",
    },
    {
      elementDisplayName: "Report File Details",
      elementInternalName: "reportfileDetails",
    },
    {
      elementDisplayName: "Category",
      elementInternalName: "catagoryType",
    },

    {
      elementDisplayName: "Report Date",
      elementInternalName: "reportDate",
    },
    {
      elementDisplayName: "Description",
      elementInternalName: "description",
    },
    {
      elementDisplayName: "Action",
      elementInternalName: "action",
    },
  ];

  const [show, setShow] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pdfContainerRef = useRef(null);

  const [limit, setLimit] = useState(25);

  const [orderType, setOrderType] = useState("Ticker Name");
  const [sortOrder, setSortOrder] = useState("Asc");
  const [categoryType, setCategoryType] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [fetchData, setFetchData] = useState(false);
  const [reports, setReports] = useState([]);
  const [filterReports, setFilterReports] = useState([]);

  useEffect(() => {
    async function run() {
      if (reports.length > 0) {
        let items = [...reports];

        let dataLimit = limit;
        let page = currentPage;
        if (dataLimit == "all") {
          dataLimit = reports?.length;
          page = 1;
        }
        items = await SliceData(page, dataLimit, items);
        // console.log("items",items)
        setFilterReports(items);
      }
    }
    run();
  }, [currentPage, reports, limit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "orderType") {
      setOrderType(value);
    } else if (name === "sortOrder") {
      setSortOrder(value);
    } else if (name === "filterText") {
      setFilterText(value.toString().toUpperCase());
      if (value === "") {
        setFetchData(true);
      }
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setCategoryType(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const getAllReports = async () => {
    context.setLoaderState(true);
    console.log(categoryType);
    try {
      const apiCall = await fetch(
        "https://jharvis.com/JarvisV2/getAllTickerReports?filterText=&catagoryType=&orderType=tickerName&_=1716192130144"
      );
      const response = await apiCall.json();
      setReports(response);
      setFilterReports(getRecentReports(response, sortOrder, orderType, true));
    } catch (e) {
      console.log("error", e);
    }
    context.setLoaderState(false);
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

  const handleClose = () => setShow(false);

  // Modified to open PDF and trigger fullscreen
  const handleShow = (path) => {
    setCurrentPdf(path);
    setShow(true);
  };

  const filter = async () => {
    const params = new URLSearchParams();
    params.append("orderType", "Ticker Name");
    params.append("sortOrder", sortOrder);
    params.append("categoryType", categoryType.join(","));
    params.append("filterText", filterText);
    params.append("_", new Date().getTime());

    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL_V2 +
      "getAllTickerReports?" +
      params.toString()
    }`;
    context.setLoaderState(true);
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const filteredReports =
          categoryType.length > 0
            ? data.filter((report) =>
                categoryType.includes(report.catagoryType)
              )
            : [];
        setReports(filteredReports.length > 0 ? filteredReports : data);
        setFilterReports(
          getRecentReports(
            filteredReports.length > 0 ? filteredReports : data,
            sortOrder,
            orderType,
            true
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    context.setLoaderState(false);
  };

  const fetchReportsCallBack = useCallback(() => {
    // Fetch logic here
    getAllReports();
  }, []);
  useEffect(() => {
    setFetchData(false);
    filter();
  }, [
    categoryType,
    fetchReportsCallBack,
    setCategoryType,
    sortOrder,
    setSortOrder,
    orderType,
    setOrderType,
    fetchData,
    setFetchData,
  ]);

  const changeLimit = (e) => {
    setLimit(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("orderType", orderType);
    params.append("sortOrder", sortOrder);
    params.append("categoryType", categoryType.join(",")); // Convert array to comma-separated string
    params.append("filterText", filterText);
    params.append("_", new Date().getTime());

    // Example GET request URL with payload
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL_V2 +
      "getAllTickerReports?" +
      params.toString()
    }`;
    context.setLoaderState(true);

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const filteredData =
          categoryType.length > 0
            ? data.filter((report) =>
                categoryType.includes(report.catagoryType)
              )
            : [];

        const filteredReports =
          filteredData.length > 0
            ? filteredData.filter(
                (report) =>
                  report.tickerName.toUpperCase().includes(filterText) ||
                  report.companyName
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
              )
            : data.filter(
                (report) =>
                  report.tickerName.toUpperCase().includes(filterText) ||
                  report.companyName
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
              );

        setReports(filteredReports.length > 0 ? filteredReports : data);
        setFilterReports(
          getRecentReports(
            filteredReports.length > 0 ? filteredReports : data,
            sortOrder,
            orderType,
            true
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    context.setLoaderState(false);
  };

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
              Reports Library
            </h3>
          </div>

          <>
            <div className="d-flex justify-content-between">
              <div className="form-group d-flex align-items-center justify-content-between w-100">
                <Form onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex dt-buttons">
                      <div className="d-flex align-items-center me-2">
                        <label
                          htmlFor=""
                          style={{ textWrap: "nowrap" }}
                          className="text-success me-2 mb-0"
                        >
                          Sort By :{" "}
                        </label>
                        <select
                          name="orderType"
                          className="form-select"
                          onChange={handleChange}
                          style={{ width: "140px", marginRight: "8px" }}
                        >
                          <option value="Ticker Name">Ticker Name</option>
                          <option value="Report Date">Report Date</option>
                        </select>
                      </div>
                      <div className="d-flex align-items-center me-2">
                        <label
                          htmlFor=""
                          style={{ textWrap: "nowrap" }}
                          className="text-success me-2 mb-0"
                        >
                          Order :{" "}
                        </label>
                        <select
                          name="sortOrder"
                          className="form-select"
                          onChange={handleChange}
                          style={{ width: "130px", marginRight: "8px" }}
                        >
                          <option value="Asc">Ascending</option>
                          <option value="Desc">Descending</option>
                        </select>
                      </div>
                      <div className="d-flex align-items-center me-2">
                        <label
                          htmlFor=""
                          style={{ textWrap: "nowrap" }}
                          className="text-success me-2 mb-0"
                        >
                          Options :{" "}
                        </label>
                        <div style={{ zIndex: 999, minWidth: "200px" }}>
                          <Select
                            name="catagoryType"
                            className="w-100 mb-0 me-2 col-md-4"
                            isMulti
                            options={[
                              { value: "First Focus", label: "First Focus" },
                              { value: "Fresh Look", label: "Fresh Look" },
                              {
                                value: "Read and React",
                                label: "Read and React",
                              },
                              {
                                value: "Grab and Go 7-packs",
                                label: "Grab and Go 7-packs",
                              },
                              {
                                value: "Special Reports",
                                label: "Special Reports",
                              },
                              {
                                value: "Annual Reports",
                                label: "Annual Reports",
                              },
                              {
                                value: "Shareholder Letters",
                                label: "Shareholder Letters",
                              },
                              {
                                value: "Jarvis Weekly",
                                label: "Jarvis Weekly",
                              },
                              { value: "Logo", label: "Logo" },
                              {
                                value: "One Page Reports",
                                label: "One Page Reports",
                              },
                            ]}
                            onChange={handleCategoryChange}
                            // required
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center me-2">
                        <label
                          htmlFor=""
                          style={{ textWrap: "nowrap" }}
                          className="text-success me-2 mb-0"
                        >
                          Search :{" "}
                        </label>
                        <input
                          type="search"
                          name="filterText"
                          placeholder=""
                          className="form-control"
                          onChange={handleChange}
                        />
                        <button className="dt-button buttons-html5 btn-primary h-auto">
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
                <div className="d-flex align-items-center me-2 mb-0">
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
                    {columnNames.map((item, index) => {
                      if (item.elementInternalName == "action") {
                        return (
                          <th
                            key={index}
                            className="sticky-action"
                            style={{ left: 0 }}
                          >
                            <p>{item?.elementDisplayName} </p>
                          </th>
                        );
                      }
                      return (
                        <th key={index} style={{ left: 0 }}>
                          <p>{item?.elementDisplayName} </p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filterReports.map((item, index) => {
                    return (
                      <tr key={"tr" + index}>
                        {columnNames.map((inner, keyid) => {
                          if (inner.elementInternalName == "action") {
                            return (
                              <td
                                className="sticky-action"
                                style={{
                                  display: "table-cell",
                                  boxShadow: "none",
                                }}
                              >
                                <button
                                  className="px-4 btn btn-primary"
                                  onClick={() => {
                                    handleShow(
                                      `https://jharvis.com/JarvisV2/playPdf?fileName=${item.reportfileDetails}`
                                    );
                                  }}
                                  title="View Fullscreen"
                                >
                                  <i className="mdi mdi-eye-outline"></i>
                                </button>
                              </td>
                            );
                          }
                          if (
                            inner.elementInternalName == "reportfileDetails"
                          ) {
                            return (
                              <td
                                key={"keyid" + keyid}
                                style={{ textWrap: "wrap" }}
                              >
                                <img
                                  src="/images/ReportsTN.png"
                                  alt=""
                                  className="image me-2"
                                  width="80"
                                  height="80"
                                />
                                <span
                                  style={{
                                    color: "#357920",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    item?.reportfileDetails.split("/")[
                                      item?.reportfileDetails.split("/")
                                        .length - 1
                                    ]
                                  }
                                </span>
                              </td>
                            );
                          }
                          return (
                            <td
                              key={"keyid" + keyid}
                              style={{
                                textWrap:
                                  inner.elementInternalName == "description"
                                    ? "wrap"
                                    : "",
                              }}
                            >
                              {inner.elementInternalName == "reportDate"
                                ? formatDateString(item["reportDate"])
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
            <Pagination
              currentPage={currentPage}
              totalItems={reports}
              limit={limit}
              setCurrentPage={setCurrentPage}
              handlePage={handlePage}
            />
          </>
        </div>
      </div>

      {/* PDF Modal with Fullscreen Capability */}
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        centered
        fullscreen="true"
        id="pdf-modal"
      >
        <Modal.Header className="mb-2" closeButton>
          <Modal.Title>{currentPdf && currentPdf.split("/").pop()}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          id="pdf-modal-container"
          className="p-2"
          style={{ height: "90vh" }}
          ref={pdfContainerRef}
        >
          {currentPdf && <PDFViewer pdfUrl={currentPdf} />}
        </Modal.Body>
      </Modal>
    </>
  );
}
