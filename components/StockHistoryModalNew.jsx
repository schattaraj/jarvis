import {
  Box,
  IconButton,
  Modal,
  Typography,
  Button,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Context } from "../contexts/Context";
import {
  balanceSheetColumn,
  cashFlowColumn,
  companyOverviewColumns,
  earningsColumn,
  fetchWithInterceptor,
  incomeStatementColumn,
  quarterlyEarningsColumn,
} from "../utils/utils";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export
import "jspdf-autotable"; // For PDF table auto-generation

const StockHistoryModalNew = ({
  open,
  handleClose,
  setCompareData,
  setSelectedOption,
  filterBydate,
  tableState,
  handleTableStateChange,
  setColumnNames,
}) => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [dates, setDates] = useState({ date1: null, date2: null });
  const [searchQuery, setSearchQuery] = useState("");
  // const [compareData,setCompareData] = useState(false)
  const context = useContext(Context);
  const months = [
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
    try {
      const api =
        tableState === "companyOverview"
          ? `/api/proxy?api=getCompanyOverviewDates`
          : tableState === "incomeStatement"
          ? "/api/proxy?api=getIncomeStatementDates"
          : tableState === "balanceSheet"
          ? "/api/proxy?api=getBalanceSheetDates"
          : tableState === "cashFlow"
          ? "/api/proxy?api=getCashFlowDates"
          : tableState === "quarterlyEarnings"
          ? "/api/proxy?api=getQuarterlyEarningDates"
          : tableState === "earnings"
          ? "/api/proxy?api=getEarningDates"
          : "/api/proxy?api=getSmaTradingDates";
      const result = await fetchWithInterceptor(api, false);
      const correspondingMonths = result.map((dateStr) => {
        const date = new Date(dateStr);
        return months[date.getMonth()];
      });
      setData(result);
      setMonth(correspondingMonths);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const filteredData = data.filter((row) =>
    row.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  // Reset selected dates when modal is closed
  useEffect(() => {
    if (!open) {
      setDates({ date1: null, date2: null });
    }
  }, [open]);

  const handleDelete = (idMarketDataFile) => {
    setDeleteItemId(idMarketDataFile);
    setDeleteConfirmationOpen(true);
  };

  const confirmedDelete = async () => {
    // console.log(`Delete action triggered for ID ${deleteItemId}`);
    setDeleteConfirmationOpen(false);
    try {
      const result = await fetchWithInterceptor(
        `/api/proxy?api=deleteHistoryData?idMarketDataFile=${deleteItemId}`,
        false,
        false,
        {
          method: "DELETE",
        }
      );

      // const result = await response.json();

      if (response.ok) {
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
    setDeleteItemId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    setDates((prevDates) => {
      if (!prevDates.date1) {
        return { ...prevDates, date1: selectedDate };
      } else if (!prevDates.date2 && prevDates.date1 !== selectedDate) {
        return { ...prevDates, date2: selectedDate };
      } else if (prevDates.date1 === selectedDate) {
        return { ...prevDates, date1: null };
      } else if (prevDates.date2 === selectedDate) {
        return { ...prevDates, date2: null };
      } else {
        Swal.fire({
          title: "You can only select up to two dates.",
          icon: "warning",
          confirmButtonColor: "var(--primary)",
        });
        return prevDates;
      }
    });
  };

  const bondCompare = async () => {
    if (!dates.date1 || !dates.date2) {
      Swal.fire({
        title: "Please select two dates",
        icon: "warning",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }
    context.setLoaderState(true);
    try {
      // const bondHistoryCompare = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getImportHistorySheetCompare?metadataName=Tickers_Watchlist&date1=${dates.date1}&date2=${dates.date2}`)
      // const bondHistoryCompareRes = await bondHistoryCompare.json()
      const bondHistoryCompare = `/api/proxy?api=getCompanyOverviewCompareByPrice?date1=${dates.date1}&date2=${dates.date2}`;
      const bondHistoryCompareRes = await fetchWithInterceptor(
        bondHistoryCompare,
        false
      );
      setCompareData(bondHistoryCompareRes);
      setSelectedOption("History");
      handleClose();
      // console.log("bondHistoryCompareRes",bondHistoryCompareRes?.bestFiveStocks?.length)
    } catch (error) {}
    context.setLoaderState(false);
  };

  // Export table to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "HistoryData.xlsx");
  };

  // Export table to CSV
  const exportToCSV = () => {
    const csvData = filteredData.map((row) => ({
      "Import Date": row.importDate,
      Month: row.month,
    }));
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HistoryData.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export table to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("History Data", 20, 10);
    doc.autoTable({
      head: [["Import Date", "Month"]],
      body: filteredData.map((row, index) => [row, month[index]]),
    });
    doc.save("HistoryData.pdf");
  };

  useEffect(() => {
    fetchData();
  }, [tableState]);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
          <Typography variant="h6">
            Import History -{" "}
            {tableState === "companyOverview"
              ? `Company Overview`
              : tableState === "incomeStatement"
              ? `Income Statement`
              : tableState === "balanceSheet"
              ? `Balance Sheet`
              : tableState === "cashFlow"
              ? `Cash Flow`
              : tableState === "quarterlyEarnings"
              ? `Quaterly Earnings`
              : tableState === "earnings"
              ? `Earnings`
              : `SMA`}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box className="mb-3">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                exportToExcel();
              }}
              sx={{ marginRight: 1 }}
            >
              Export to Excel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={exportToCSV}
              sx={{ marginRight: 1 }}
            >
              Export to CSV
            </Button>
            <Button variant="contained" color="error" onClick={exportToPDF}>
              Export to PDF
            </Button>
          </Box>
          <div style={{ width: "50%", overflow: "auto" }}>
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
                    tableState === "balanceSheet" ? "active-table-button" : ""
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
                    setColumnNames(incomeStatementColumn);
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
                <TableCell>Select</TableCell>
                <TableCell>Import Dates</TableCell>
                <TableCell>Months</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row + "-" + index}>
                    {/* <TableCell>{parse(row.checkBoxHtml, options)}</TableCell> */}
                    <TableCell>
                      <input
                        type="checkbox"
                        value={row}
                        name="dateChkBox"
                        checked={dates.date1 === row || dates.date2 === row}
                        onChange={handleDateChange}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        className="p-0 border-0 bg-transparent"
                        onClick={() => {
                          filterBydate(row, tableState);
                        }}
                      >
                        {row}
                      </button>
                    </TableCell>
                    <TableCell>{month[index]}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(row.idMarketDataFile)}
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
              onClick={handleClose}
            >
              <span>Cancel</span>
            </button>
            <div className="dt-buttons mb-3"></div>
            <button
              className="btn btn-primary"
              type="button"
              title="Compare"
              onClick={bondCompare}
            >
              <span>Compare</span>
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
      </Box>
    </Modal>
  );
};

export default StockHistoryModalNew;
