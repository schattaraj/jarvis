import React, { useCallback, useContext, useEffect, useState } from "react";
import Footer from "../../components/footer";
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation as Nav2, Autoplay } from "swiper/modules";
import PDFViewer from "../../components/PDFViewer";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumb";
import { Form } from "react-bootstrap";
import { Context } from "../../contexts/Context";
import {
  formatDateString,
  getArchiveReports,
  getLatestReport,
  getRecentReports,
} from "../../utils/utils";
export default function Reports() {
  const [reports, setReports] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [archiveReports, setArchiveReports] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [orderType, setOrderType] = useState("Ticker Name");
  const [sortOrder, setSortOrder] = useState("Asc");
  const [categoryType, setCategoryType] = useState([]);
  const [filterText, setFilterText] = useState("");
  const context = useContext(Context);
  const fetchVideoes = async () => {
    setLoader(true);
    console.log(categoryType);
    try {
      const apiCall = await fetch(
        "https://jharvis.com/JarvisV2/getAllTickerReports?filterText=&catagoryType=&orderType=tickerName&_=1716192130144"
      );
      const response = await apiCall.json();
      setReports(response);
      setRecentReports(getRecentReports(response));
      setArchiveReports(getArchiveReports(response));
      setCurrentPdf(getLatestReport(response));
    } catch (e) {
      console.log("error", e);
    }
    setLoader(false);
  };
  const fetchVideoesFilters = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const filteredReports = reports.filter((report) =>
        categoryType.includes(report.catagoryType)
      );
      console.log(filteredReports);

      // setReports(filteredReports);
      setRecentReports(getRecentReports(filteredReports));
      setArchiveReports(getArchiveReports(filteredReports));
      setCurrentPdf(getLatestReport(reports));
    } catch (e) {
      console.log("error", e);
    }
    setLoader(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = (path) => {
    // setShow(true);
    setCurrentPdf(path);
    console.log("path", path);
  };
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleOpenAmount = () => {};
  const filter = async () => {
    // e.preventDefault();
    // const form = e.target;
    // if (form.checkValidity() === false) {
    //   e.preventDefault();
    //   e.stopPropagation();
    // }
    // console.log("filter", e);
    // Construct the payload

    const params = new URLSearchParams();
    params.append("orderType", "Ticker Name");
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
    // Make the API request
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response data
        const filteredReports =
          categoryType.length > 0
            ? data.filter((report) =>
                categoryType.includes(report.catagoryType)
              )
            : [];
        setReports(filteredReports.length > 0 ? filteredReports : data);
        setRecentReports(
          getRecentReports(
            filteredReports.length > 0 ? filteredReports : data,
            sortOrder,
            orderType
          )
        );
        setArchiveReports(
          getArchiveReports(
            filteredReports.length > 0 ? filteredReports : data,
            sortOrder,
            orderType
          )
        );
        setCurrentPdf(getLatestReport(data));
        // setCurrentPdf(data[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    context.setLoaderState(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "orderType") {
      setOrderType(value);
    } else if (name === "sortOrder") {
      setSortOrder(value);
    } else if (name === "filterText") {
      setFilterText(value);
    }
  };
  const handleCategoryChange = (selectedOptions) => {
    setCategoryType(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };
  // console.log(sortOrder);

  const fetchVideoesCallBack = useCallback(() => {
    // Fetch logic here
    fetchVideoes();
  }, []);
  useEffect(() => {
    filter();
  }, [
    categoryType,
    fetchVideoesCallBack,
    setCategoryType,
    sortOrder,
    setSortOrder,
    orderType,
    setOrderType,
  ]);

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
              Reports
            </h3>
          </div>
          {/* <h3 className='mb-3'>FIRST FOCUS, FRESH LOOK, READ & REACT & THE FUNDAMENTALS OF INVESTING - REPORTS</h3> */}
          <p className="mb-4">
            Complete and accurate information that has been gathered, evaluated,
            and merged into well integrated and consise reports that provide
            todays investors with sound analytics helping them make the best
            possible decisions for the future.
          </p>
          <Form onSubmit={(e) => e.preventDefault()}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex dt-buttons mb-3">
                <div className="d-flex align-items-center me-2">
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success me-2"
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
                    className="text-success me-2"
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
                    className="text-success me-2"
                  >
                    Options :{" "}
                  </label>
                  <Select
                    name="catagoryType"
                    className="w-100 mb-0 me-2 col-md-4"
                    isMulti
                    options={[
                      { value: "First Focus", label: "First Focus" },
                      { value: "Fresh Look", label: "Fresh Look" },
                      { value: "Read and React", label: "Read and React" },
                      {
                        value: "Grab and Go 7-packs",
                        label: "Grab and Go 7-packs",
                      },
                      { value: "Special Reports", label: "Special Reports" },
                      { value: "Annual Reports", label: "Annual Reports" },
                      {
                        value: "Shareholder Letters",
                        label: "Shareholder Letters",
                      },
                      { value: "Jarvis Weekly", label: "Jarvis Weekly" },
                      { value: "Logo", label: "Logo" },
                      { value: "One Page Reports", label: "One Page Reports" },
                    ]}
                    onChange={handleCategoryChange}
                    required
                  />
                </div>
                <div className="d-flex align-items-center me-2">
                  <label
                    htmlFor=""
                    style={{ textWrap: "nowrap" }}
                    className="text-success me-2"
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
                </div>
                <button className="dt-button buttons-html5 btn-primary h-auto">
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </Form>
          <div className="row">
            <div className="col-md-7">
              <div className="left" style={{ height: "auto" }}>
                <h3>Latest Post</h3>
                {!currentPdf && (
                  <SkeletonTheme>
                    <div className="w-100">
                      <Skeleton width={"100%"} height={"500px"} />
                    </div>
                  </SkeletonTheme>
                )}
                <h5 className="card-title d-flex align-items-center">
                  {currentPdf?.tickerName}
                  <span className="card-text card-text-company ms-2">
                    ({currentPdf?.companyName})
                  </span>
                </h5>

                <div className="d-flex mb-3 align-items-center">
                  <span className="card-text color-343a40">
                    {formatDateString(currentPdf?.reportDate)}
                  </span>
                  <span className="mx-2">|</span>
                  <span className="card-text color-357920 text-uppercase">
                    {currentPdf?.catagoryType}
                  </span>
                </div>

                {currentPdf?.reportfileDetails && (
                  <PDFViewer
                    pdfUrl={`https://jharvis.com/JarvisV2/playPdf?fileName=${currentPdf.reportfileDetails}`}
                  />
                )}
                {/* <iframe className="embed-responsive-item report-iframe" src={"https://jharvis.com/JarvisV2/playPdf?fileName=" + currentPdf.reportfileDetails} id="video" allowscriptaccess="always" allow="autoplay" style={{ width: "100%" }}></iframe> */}
              </div>
            </div>
            <div className="col-md-5">
              <div className="horizontal">
                <h3 className="mb-3">Recent Posts</h3>
                {recentReports.length == 0 && (
                  <SkeletonTheme>
                    <div className="w-100">
                      <Skeleton width={"100%"} height={"300px"} />
                    </div>
                  </SkeletonTheme>
                )}

                <Swiper
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={true}
                  modules={[Nav2, Autoplay]}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {recentReports.length > 0 &&
                    recentReports.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className="report me-0">
                            <img
                              src="/images/ReportsTN.png"
                              alt=""
                              className="image"
                            />
                            <h5 className="card-title">{item?.tickerName}</h5>
                            <p className="card-text mb-2 text-600">
                              {item?.companyName}
                            </p>

                            <div className="d-flex mb-3 align-items-center">
                              <p className="card-text color-343a40 mb-0">
                                {formatDateString(item?.reportDate)}
                              </p>
                              <p className="mx-2 mb-0">|</p>
                              <p className="card-text color-357920 text-uppercase mb-0">
                                {item?.catagoryType}
                              </p>
                            </div>
                            {/* <h5 className="card-title">{item.tickerName}</h5>
                            <p className="card-text">{item.companyName}</p> */}
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                handleShow(item);
                              }}
                            >
                              View
                            </button>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
              <div className="vertical">
                <h3 className="mb-3">Archive</h3>
                {archiveReports.length == 0 && (
                  <>
                    <SkeletonTheme className="mb-3">
                      <div className="w-100">
                        <Skeleton width={"100%"} height={"300px"} />
                      </div>
                    </SkeletonTheme>
                  </>
                )}
                {archiveReports.length > 0 &&
                  archiveReports.map((item, index) => {
                    return (
                      <div className="report" key={index}>
                        <img
                          src="/images/ReportsTN.png"
                          alt=""
                          className="image"
                        />
                        <h5 className="card-title ">{item?.tickerName}</h5>
                        <p className="card-text mb-2 text-600">
                          {item?.companyName}
                        </p>

                        <div className="d-flex mb-3 align-items-center">
                          <p className="card-text color-343a40 mb-0">
                            {formatDateString(item?.reportDate)}
                          </p>
                          <p className="mx-2 mb-0">|</p>
                          <p className="card-text color-357920 text-uppercase mb-0">
                            {item?.catagoryType}
                          </p>
                        </div>
                        {/* <h5 className="card-title">{item.tickerName}</h5>
                        <p className="card-text">{item.companyName}</p> */}
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            handleShow(item);
                          }}
                        >
                          View
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              className="embed-responsive-item"
              src={
                "https://jharvis.com/JarvisV2/playPdf?fileName=" +
                currentPdf.reportfileDetails
              }
              id="video"
              allowscriptaccess="always"
              allow="autoplay"
              style={{ width: "100%" }}
            ></iframe>
          </Modal.Body>
        </Modal>
        <Footer />
      </div>
    </>
  );
}
