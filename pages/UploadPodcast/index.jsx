import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  fetchWithInterceptor,
  formatDate,
  getSortIcon,
  searchTable,
} from "../../utils/utils";
import { Pagination } from "../../components/Pagination";
import Loader from "../../components/loader";
import { Context } from "../../contexts/Context";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SliceData from "../../components/SliceData";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
export default function UploadPodcast() {
  const [tickers, setTickers] = useState([]);
  const [allPodcastData, setallPodcastData] = useState([]);
  const [allPodcastDataFiltered, setallPodcastDataFiltered] = useState([]);
  const [show, setShow] = useState(false);
  const [analystVideo, setAnalystVideo] = useState(false);
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const context = useContext(Context);
  const fetchTickersFunc = async () => {
    context.setLoaderState(true);
    try {
      const fetchTickersRes = await fetchWithInterceptor(
        "/api/proxy?api=getAllTicker?metadataName=Tickers_Watchlist&_=1716538528361"
      );
      //   const fetchTickersRes = await fetchTickers.json();
      setTickers(fetchTickersRes);
    } catch (e) {}
    context.setLoaderState(false);
  };
  const handleChange = () => {};
  const fetchHistoryFuc = () => {};
  const fetchAllPodcastVideos = async () => {
    context.setLoaderState(true);
    try {
      const getAllAnalystRes = await fetchWithInterceptor(
        "/api/proxy?api=getAllPodCasts?_=1716548464958"
      );
      //   const getAllAnalystRes = await getAllAnalyst.json();
      setallPodcastData(getAllAnalystRes);
      setallPodcastDataFiltered([...getAllAnalystRes]);
    } catch (error) {
      console.log("error", error);
    }
    context.setLoaderState(false);
  };
  const handleClose = () => setShow(false);
  const handleShow = (path) => {
    setShow(true);
    setAnalystVideo(path);
  };
  const filter = (e) => {
    const value = e.target.value;
    setallPodcastDataFiltered(searchTable(allPodcastData, value));
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
  const uploadPodcast = async (e) => {
    context.setLoaderState(true);
    try {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const result = await fetchWithInterceptor(
        "/api/proxy?api=uploadPodCast&bodyType=form",
        false,
        false,
        {
          method: "POST",
          body: formData,
        }
      );

      if (result.msg) {
        // const result = await response.json();
        Swal.fire({
          title: result.msg,
          icon: "success",
          confirmButtonColor: "#719B5F",
        });
        form.reset();
        fetchAllPodcastVideos();
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {}
    context.setLoaderState(false);
  };
  const deletePodcast = async (id) => {
    let text = "Are you sure ?";
    Swal.fire({
      title: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      customClass: { confirmButton: "btn-danger" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        context.setLoaderState(true);
        try {
          const formData = new FormData();
          formData.append("idPodCast", id);
          const rowDeleteRes = await fetchWithInterceptor(
            "/api/proxy?api=deletePodCast?idPodCast=" + id,
            false,
            false,
            {
              method: "DELETE",
            }
          );
          if (rowDeleteRes.msg) {
            // const rowDeleteRes = await rowDelete.json();
            Swal.fire({
              title: rowDeleteRes?.msg,
              icon: "success",
              confirmButtonColor: "#719B5F",
            });
            fetchAllPodcastVideos();
          }
        } catch (error) {
          console.log(error);
        }
        context.setLoaderState(false);
      }
    });
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
  useEffect(() => {
    async function run() {
      if (allPodcastData.length > 0) {
        let items = [...allPodcastData];
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
        items = await SliceData(currentPage, limit, items);
        setallPodcastDataFiltered(items);
      }
    }
    run();
  }, [currentPage, allPodcastData, sortConfig]);
  useEffect(() => {
    fetchTickersFunc();
    fetchAllPodcastVideos();
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
              Upload Podcast
            </h3>
          </div>
          <div className="selection-area mb-3">
            {/* <form action="https://jharvis.com/JarvisV2/uploadPodCast" method='post' encType='multipart/form-data'> */}
            <form
              //   action="https://jharvis.com/JarvisV2/uploadPodCast"
              onSubmit={uploadPodcast}
              method="post"
              encType="multipart/form-data"
            >
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Select Ticker</label>
                    <select
                      name="tickerName"
                      className="form-select"
                      onChange={handleChange}
                      required
                    >
                      <option value={""}>--Select Ticker--</option>
                      {tickers.map((item, index) => (
                        <option key={index} value={item?.element1}>
                          {item?.element1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      name="description"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Podcast Date</label>
                    {/* <input type="text" className='form-control' name='podCastDate' required/> */}
                    <ReactDatePicker
                      className="form-control"
                      name="podCastDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Upload File</label>
                    <input
                      type="file"
                      name="podCastsDetails"
                      className="border-1 form-control"
                      required
                    />
                  </div>
                </div>
                <div className="actions">
                  <button className="btn btn-primary" type="submit">
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="d-flex justify-content-end">
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
            <table className="table">
              <thead>
                <tr>
                  <th
                    onClick={() => {
                      handleSort("tickerName");
                    }}
                  >
                    Ticker {getSortIcon("tickerName", sortConfig)}
                  </th>
                  <th
                    onClick={() => {
                      handleSort("companyName");
                    }}
                  >
                    Company {getSortIcon("companyName", sortConfig)}
                  </th>
                  <th
                    onClick={() => {
                      handleSort("description");
                    }}
                  >
                    Description {getSortIcon("description", sortConfig)}
                  </th>
                  <th
                    onClick={() => {
                      handleSort("reportDate");
                    }}
                  >
                    Report Date {getSortIcon("reportDate", sortConfig)}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allPodcastDataFiltered.map((item, index) => {
                  return (
                    <tr key={"analyst" + index}>
                      <td>{item?.tickerName}</td>
                      <td>{item?.companyName}</td>
                      <td>{item?.description}</td>
                      <td>
                        {item?.podCastDate && formatDate(item?.podCastDate)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-primary me-2 px-4"
                          onClick={() => {
                            handleShow(item?.podCastsDetails);
                          }}
                          title="Video"
                        >
                          <i className="mdi mdi-video menu-icon"></i>
                        </button>
                        <button
                          className="btn btn-danger px-4"
                          onClick={() => {
                            deletePodcast(item?.idPodCast);
                          }}
                          title="delete"
                        >
                          <i className="mdi mdi-delete menu-icon"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {allPodcastData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={allPodcastData}
              limit={limit}
              setCurrentPage={setCurrentPage}
              handlePage={handlePage}
            />
          )}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Podcasts</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <video
            playsInline=""
            autoPlay=""
            muted=""
            loop=""
            height="240"
            controls={true}
          >
            <source
              id="videoSource"
              src={
                "api/image-proxy?path=http://35.226.245.206:9092/JarvisV3/JarvisVideo/" +
                analystVideo
              }
              type="video/mp4"
            />
          </video>
        </Modal.Body>
      </Modal>
    </>
  );
}
