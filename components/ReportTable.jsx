import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TablePagination,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import parse from "html-react-parser";
import { Context } from "../contexts/Context";
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export
import "jspdf-autotable"; // For PDF table auto-generation
import {
  fetchWithInterceptor,
  formatDate,
  formatDateTime,
  formatPublishedDate,
} from "../utils/utils";
import { Download } from "@mui/icons-material";
import Link from "next/link";
import { ListGroup, Nav } from "react-bootstrap";
import { IoMdArrowBack } from "react-icons/io";
import "animate.css";
import HightChart from "./HighChart";
function ReportTable({
  name,
  open,
  handleCloseModal,
  news,
//   activeTab={tab : "latest", selectedDate : "All"},
//   setActiveTab=null,
}) {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [dates, setDates] = useState({ date1: null, date2: null });
  const [newsSentiment, setNewsSentiment] = useState([]);
  const [archivedNewsSentiment, setArchivedNewsSentiment] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chartHistory, setChartHistory] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [ViewOptions, setViewOptions] = useState({
    element3: { name: "rankWithInTable", displayName: "Rank Within Table" },
    element32: { name: "enterPriseValue", displayName: "Enterprise value($M)" },
    element33: { name: "priceSale", displayName: "Price / Sales" },
    element34: { name: "grossMargin", displayName: "Gross Margin" },
    element35: { name: "roic", displayName: "ROIC" },
    element9: { name: "priceAvg", displayName: "Price vs 20-day Avg (%)" },
    element10: { name: "price", displayName: "Price" },
    element11: { name: "ytdReturn", displayName: "YTD Return" },
    element12: { name: "dividendYield", displayName: "Dividend Yield" },
    element13: { name: "shortFloat", displayName: "Short as % of Float" },
    element18: { name: "relativeStrength", displayName: "Relative Strength" },
    element22: { name: "priceEarning", displayName: "Price/Earnings" },
    element26: { name: "evEbitda", displayName: "EV / EBITDA" },
  });
  //   const [selectedMonth, setSelectedMonth] = useState("All");
  //   const [activeTab, setActiveTab] = useState("latest");
  const [activeTab, setActiveTab] = useState({tab : "latest", selectedDate : "All"});
  const context = useContext(Context);
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const fetchData = async () => {
    context.setLoaderState(true);
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getTickerReportsByTickerName?tickerName=${name}&_=${new Date().getTime()}`);
      // const result = await response.json();
      const api = `/api/proxy?api=getTickerReportsByTickerName?tickerName=${name}&_=${new Date().getTime()}`;
      const result = await fetchWithInterceptor(api, false);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    context.setLoaderState(false);
  };
  const fetchNewsSentiment = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${name}&apikey=TY1WA5LN5KU3SQIV `
      );
      const result = await response.json();
      const currentYear = new Date().getFullYear();
      const latestNews = [];
      const archivedNews = [];
      if (result?.Information) {
        Swal.fire({ icon: "warning", text: result.Information });
      }
      setActiveTab((prev) => ({ ...prev, tab: "latest", selectedDate: "All" }))
      result.feed.forEach((news) => {
        const newsYear = parseInt(news.time_published.substring(0, 4), 10);

        if (newsYear === currentYear) {
          latestNews.push(news);
        } else {
          archivedNews.push(news);
        }
      });
      setNewsSentiment(latestNews);
      setArchivedNewsSentiment(archivedNews);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const confirmedDelete = async () => {
    console.log(`Delete action triggered for ID ${deleteItemId}`);
    setDeleteConfirmationOpen(false);
    try {
      const response = await fetch(
        `https://www.jharvis.com/JarvisV2/deleteHistoryData?idMarketDataFile=${deleteItemId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result.msg);
        alert(result.msg);
        fetchData();
      } else {
        alert("Failed delete operation");
        console.error("Error deleting item:", result.msg);
      }
    } catch (error) {
      alert("Unknown Error");
      console.error("Error deleting item:", error);
    }
  };

  const cancelDelete = () => {
    handleCloseModal();
    // setDeleteItemId(null);
    // setDeleteConfirmationOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDelete = (id) => {
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
          console.log("Success", deleteApiRes);
        } catch (error) {
          console.log("Error", error);
        }
        context.setLoaderState(false);
      }
    });
  };
  const handleDownload = async (reportfileDetails) => {
    const url =
      process.env.NEXT_PUBLIC_BASE_URL_V2 +
      "downloadPDF?fileName=" +
      reportfileDetails;
    window.open(url, "_blank");
  };
  // Filter the data based on the search query
  const filteredData = data.filter((row) =>
    row.tickerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const showNewsDetails = (index) => {
    setSelectedIndex(index);
    setShowDetails(true);
  };
  useEffect(() => {
    if (open) {
      fetchData();
      fetchNewsSentiment();
    }
  }, [open]);
  const filterByMonth = (newsList) => {
    if (activeTab.selectedDate === "All") return newsList;
    return newsList.filter((news) => {
      const yearNumber = news.time_published.substring(0, 4);
      const monthNumber = news.time_published.substring(4, 6);
      const dayNumber = news.time_published.substring(6, 8);
      const monthName = new Date(
        `${monthNumber}/${dayNumber}/${yearNumber}`
      ).toLocaleString("default", {
        month: "long",
      });
      return monthName === activeTab.selectedDate;
    });
  };

  const displayedNews =
    activeTab.tab === "latest"
      ? filterByMonth(newsSentiment)
      : filterByMonth(archivedNewsSentiment);

  const getChartHistory = async () => {
    try {
      if(open){
        context.setLoaderState(true)
        const payload = {
            ticker: name,
            year: "2017",
            year2: "2025",
            metadataName: "Tickers_Watchlist",
            _: new Date().getTime(), // This will generate a unique timestamp
          };
          const queryString = new URLSearchParams(payload).toString();
          const api = `/api/proxy?api=getChartForHistoryByTicker?${queryString}`;
          const getChartHistroryRes = await fetchWithInterceptor(api, false);
          setChartHistory(getChartHistroryRes);
          context.setLoaderState(false)
      }
    } catch (error) {
        context.setLoaderState(false)
    }
  
  };

  useEffect(() => {
    getChartHistory();
  }, [name]);
  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          // position: 'absolute',
          // top: '50%',
          // left: '50%',
          // transform: 'translate(-50%, -50%)',
          marginLeft: "auto",
          marginRight: "auto",
          width: "80%",
          overflowY: "auto",
          height: "auto",
          maxHeight: "100vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
        }}
      >
        {data.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 2,
              }}
            >
              <Typography variant="h6">Report Table</Typography>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Report Type</TableCell>
                    <TableCell>Report Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row?.idTickerReports}>
                        <TableCell>{row?.tickerName}</TableCell>
                        <TableCell>{row?.companyName}</TableCell>
                        <TableCell>{row?.description}</TableCell>
                        <TableCell>{row?.catagoryType}</TableCell>
                        <TableCell>{formatDate(row?.reportDate)}</TableCell>
                        <TableCell className="text-center">
                          <IconButton
                            onClick={() =>
                              handleDownload(row.reportfileDetails)
                            }
                            className="text-primary"
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row.idTickerReports)}
                            className="text-danger"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <DialogActions>
                <button
                  className="btn btn-secondary"
                  type="button"
                  title="Cancel"
                  onClick={cancelDelete}
                >
                  <span>Cancel</span>
                </button>
                <div className="dt-buttons mb-3"></div>
              </DialogActions>
            </Box>
            <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                Are you sure you want to delete the item with ID{" "}
                <b>{deleteItemId}</b>?
              </DialogContent>
              <DialogActions style={{ padding: 4 }}>
                <button
                  className="dt-button buttons-pdf buttons-html5 btn-primary"
                  type="button"
                  title="Cancel"
                  onClick={cancelDelete}
                >
                  <span>Cancel</span>
                </button>
                <div className="dt-buttons mb-3"></div>
                <button
                  className="dt-button buttons-pdf buttons-html5 btn-primary"
                  type="button"
                  title="delete"
                  onClick={confirmedDelete}
                >
                  <span>Delete</span>
                </button>
                <div className="dt-buttons mb-3"></div>
              </DialogActions>
            </Dialog>
          </>
        )}
       {
        chartHistory && chartHistory.length > 0 &&
        <HightChart
        data={chartHistory?.map((item) => [
          new Date(item["lastUpdatedAt"]).getTime(),
          Number(item["element10"]),
        ])}
        title={
          "element10" &&
          `Chart View For ${ViewOptions["element10"].displayName}`
        }
        yAxisTitle={"Price"}
      />
}
      
        {news && displayedNews && (
          <>
            <div className="news-area">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">News Sentiment</h3>
                <div className="d-flex gap-2">
                  <select
                    className="form-select w-auto"
                    value={activeTab.selectedDate}
                    onChange={(e) =>
                      setActiveTab((prev) => ({
                        ...prev,
                        selectedDate: e.target.value,
                      }))
                    }
                  >
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {!showDetails && (
                    <Nav fill variant="tabs">
                      <Nav.Item>
                        <Nav.Link
                          className={`nav-link ${
                            activeTab.tab === "latest" ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveTab((prev) => ({ ...prev, tab: "latest" }))
                          }
                        >
                          Latest
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          className={`nav-link ${
                            activeTab.tab === "archived" ? "active" : ""
                          }`}
                          onClick={() =>
                            setActiveTab((prev) => ({
                              ...prev,
                              tab: "archived",
                            }))
                          }
                        >
                          Archived
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  )}
                </div>

                {showDetails && (
                  <button
                    className="btn btn-primary px-3 py-2 ps-2"
                    onClick={() => {
                      setShowDetails(false);
                    }}
                  >
                    <IoMdArrowBack style={{ fontSize: "20px" }} />{" "}
                    <span className="ms-1">Back</span>
                  </button>
                )}
              </div>
              {!showDetails && (
                <ListGroup
                  as="ul"
                  className="animate__animated animate__fadeInRight"
                >
                  {displayedNews?.length > 0 ? (
                    displayedNews?.map((item, index) => {
                      return (
                        <ListGroup.Item
                          as="li"
                          key={index}
                          onClick={() => {
                            showNewsDetails(index);
                          }}
                        >
                          <img src={item?.banner_image} alt="" loading="lazy" />
                          <div className="text">
                            <h5 className="mb-1">{item.title}</h5>
                            <div>
                              {formatDateTime(item?.time_published)} by{" "}
                              {item?.authors.map((name) => name + ",")}
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <ListGroup.Item as="line" disabled>
                      No Data Available
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
              {showDetails && (
                <div className="animate__animated animate__fadeInLeft">
                  <h4>
                    <Link href={displayedNews[0]?.url}>
                      {displayedNews[selectedIndex]?.title}
                    </Link>
                  </h4>
                  {displayedNews[selectedIndex]?.banner_image && (
                    <img
                      src={displayedNews[selectedIndex]?.banner_image}
                      alt=""
                      className="image"
                      loading="lazy"
                    />
                  )}
                  <p>
                    By{" "}
                    <span className="name">
                      {displayedNews[selectedIndex]?.authors[0]}
                    </span>{" "}
                    -{" "}
                    {formatPublishedDate(
                      displayedNews[selectedIndex]?.time_published
                    )}
                  </p>
                  <p>Summary : {displayedNews[selectedIndex]?.summary}</p>
                  <h6>Topics :</h6>
                  <ul>
                    {displayedNews[selectedIndex]?.topics?.map((item) => {
                      return (
                        <li>
                          {item?.topic} - {item?.relevance_score}
                        </li>
                      );
                    })}
                  </ul>
                  <h6>
                    Overall Sentiment Score :{" "}
                    {displayedNews[selectedIndex]?.overall_sentiment_score}
                  </h6>
                </div>
              )}
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default ReportTable;
