import React, { useContext, useEffect, useState } from "react";
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
import Breadcrumb from "../../components/Breadcrumb";
import { Context } from "../../contexts/Context";
import { fetchWithInterceptor, formatDate } from "../../utils/utils";
export default function OnePageReport() {
  const [reports, setReports] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(false);
  const [loader, setLoader] = useState(false);
  const [orderType, setOrderType] = useState("Ticker Name");
  const [sortOrder, setSortOrder] = useState("Asc");
  const [categoryType, setCategoryType] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [orderBy, setOrderBy] = useState("asc");
  const [filteredReports, setFilterReports] = useState([]);
  const context = useContext(Context);
  const fetchVideoes = async () => {
    setLoader(true);
    try {
      const response = await fetchWithInterceptor(
        "/api/proxy?api=getAllTickerOnePageReports?filterText=&_=1706882102005"
      );
      // const response = await apiCall.json()
      setReports(response);
      setCurrentPdf(response[0]);
      console.log(response);
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
  const filter = async (e) => {
    const filterText = e.target.value;
    setFilterText(filterText);
    const filteredReports = reports.filter((item) => {
      return item.tickerName.toLowerCase().includes(filterText.toLowerCase());
    });
    setFilterReports(filteredReports);
  };
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  // Function to sort by newest to oldest
  function sortReportsNewestToOldest(reports) {
    return reports.sort(
      (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
    );
  }

  // Function to sort by oldest to newest
  function sortReportsOldestToNewest(reports) {
    return reports.sort(
      (a, b) => new Date(a.reportDate) - new Date(b.reportDate)
    );
  }

  const handleOrder = (e) => {
    setOrderBy(e.target.value);
  };
  useEffect(() => {
    if (reports.length > 0) {
      if (orderBy == "asc") {
        setFilterReports(sortReportsNewestToOldest(reports));
      } else {
        setFilterReports(sortReportsOldestToNewest(reports));
      }
    }
  }, [reports, orderBy]);
  useEffect(() => {
    fetchVideoes();
  }, []);
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
              One Page Reports
            </h3>
            <nav aria-label="breadcrumb">
              <ul className="breadcrumb">
                {/* <li className="breadcrumb-item active" aria-current="page">
                  <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                </li> */}
              </ul>
            </nav>
          </div>
          {/* <h3 className='mb-3'>FIRST FOCUS, FRESH LOOK, READ & REACT & THE FUNDAMENTALS OF INVESTING - REPORTS</h3> */}
          <p className="mb-4 mt-3">
            Complete and accurate information that has been gathered, evaluated,
            and merged into well integrated and consise reports that provide
            todays investors with sound analytics helping them make the best
            possible decisions for the future.
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex dt-buttons mb-3">
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
                  placeholder=""
                  className="form-control"
                  onChange={filter}
                />
              </div>
              <button
                className="dt-button buttons-html5 btn-primary h-auto"
                type="button"
                onClick={() => {
                  console.log("filter");
                }}
              >
                <span>Filter</span>
              </button>
            </div>
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
                onChange={handleOrder}
                style={{ maxWidth: "200px", marginRight: "8px" }}
              >
                <option value="desc">Oldest to newest</option>
                <option value="asc">Newest to oldest</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7">
              <div className="left">
                <h3>Latest Post</h3>
                {!currentPdf && (
                  <SkeletonTheme>
                    <div className="w-100">
                      <Skeleton width={"100%"} height={"500px"} />
                    </div>
                  </SkeletonTheme>
                )}
                <h5 className="card-title">{currentPdf?.tickerName}</h5>
                <p className="card-text">{currentPdf?.companyName}</p>
                {currentPdf?.reportfileDetails && (
                  <PDFViewer
                    pdfUrl={`/api/image-proxy?path=http://35.226.245.206:9092/JarvisV3/${
                      currentPdf.reportfileDetails.split("C:/")[1]
                    }`}
                  />
                )}
                {/* <iframe className="embed-responsive-item report-iframe" src={"https://jharvis.com/JarvisV2/playPdf?fileName=" + currentPdf.reportfileDetails} id="video" allowscriptaccess="always" allow="autoplay" style={{ width: "100%" }}></iframe> */}
                {/* <PDFViewer pdfUrl={`https://jharvis.com/JarvisV2/playPdf?fileName=${currentPdf.reportfileDetails}`}/> */}
                {/* {console.log("pDF url",`https://jharvis.com/JarvisV2/playPdf?fileName=${currentPdf.reportfileDetails}`)} */}
              </div>
            </div>
            <div className="col-md-5">
              <div className="horizontal">
                <h3 className="mb-3">Recent Posts</h3>
                {reports.length == 0 && (
                  <SkeletonTheme>
                    <div className="w-100">
                      <Skeleton width={"100%"} height={"300px"} />
                    </div>
                  </SkeletonTheme>
                )}

                <Swiper
                  spaceBetween={30}
                  slidesPerView={1}
                  onSlideChange={() => console.log("slide change")}
                  navigation={true}
                  modules={[Nav2, Autoplay]}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {reports.length > 0 &&
                    filteredReports.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className="report me-0">
                            <img
                              src="/images/ReportsTN.png"
                              alt=""
                              className="image"
                            />
                            <h5 className="card-title">{item.tickerName}</h5>
                            <p className="card-text">{item.companyName}</p>
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
                {reports.length == 0 && (
                  <>
                    <SkeletonTheme className="mb-3">
                      <div className="w-100">
                        <Skeleton width={"100%"} height={"300px"} />
                      </div>
                    </SkeletonTheme>
                  </>
                )}
                {reports.length > 0 &&
                  filteredReports.map((item, index) => {
                    return (
                      <div className="report" key={index}>
                        <img
                          src="/images/ReportsTN.png"
                          alt=""
                          className="image"
                        />
                        <h5 className="card-title">{item.tickerName}</h5>
                        <p className="card-text">{item.companyName}</p>
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
          {/* <div className="row">{
    loader ?
<>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    </>
    :
       reports.length > 0 && reports.map((item,index)=>{
            return  <div className="col-md-4 stretch-card grid-margin" key={index}>
                <div className="report">
                <img src="/images/ReportsTN.png" alt="" className='image'/>
                <h5 className='card-title'>{item.tickerName}</h5>
                <p className ="card-text">{item.companyName}</p>
                <button className='btn btn-success' onClick={()=>{handleShow(item.reportfileDetails)}}>View</button>
                </div>
            </div>
        })
}
</div> */}
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              className="embed-responsive-item"
              src={
                "/api/image-proxy?path=http://35.226.245.206:9092/JarvisV3/" +
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
