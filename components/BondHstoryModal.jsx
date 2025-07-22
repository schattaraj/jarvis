import { useState, useEffect, useContext } from "react";
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
import Swal from "sweetalert2";
import { Context } from "../contexts/Context";
import { fetchWithInterceptor } from "../utils/utils";

const BondsHistoryModal = ({
  open,
  handleClose,
  setCompareData,
  setSelectedOption,
  onClickImportDate,
}) => {
  const [data, setData] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [dates, setDates] = useState({ date1: null, date2: null });
  const [searchQuery, setSearchQuery] = useState("");
  // const [compareData,setCompareData] = useState(false)
  const context = useContext(Context);
  const fetchData = async () => {
    try {
      const result = await fetchWithInterceptor(
        "/api/proxy?api=findImportDatesByMonth?metaDataName=Bondpricing_Master&_=1705052752528"
      );
      // const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const filteredData = data.filter(
    (row) =>
      row.importDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.month.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    if (open) {
      fetchData();
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
  const options = {
    replace: (elememt) => {
      if (elememt?.attribs?.type === "checkbox") {
        return (
          <input
            type="checkbox"
            value={elememt?.attribs?.value}
            name="dateChkBox"
            checked={
              dates.date1 === elememt?.attribs?.value ||
              dates.date2 === elememt?.attribs?.value
            }
            onChange={handleDateChange}
          />
        );
      }
    },
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
      const bondHistoryCompareRes = await fetchWithInterceptor(
        `/api/proxy?api=getImportHistorySheetCompare?metadataName=Bondpricing_Master&date1=${dates.date1}&date2=${dates.date2}`
      );
      // const bondHistoryCompareRes = await bondHistoryCompare.json();
      setCompareData(bondHistoryCompareRes);
      setSelectedOption("History");
      handleClose();
      // console.log("bondHistoryCompareRes",bondHistoryCompareRes?.bestFiveStocks?.length)
    } catch (error) {}
    context.setLoaderState(false);
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          // maxHeight: '90vh',
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
          <Typography variant="h6">Bonds History</Typography>
          <IconButton onClick={handleClose}>
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
                <TableCell>Select</TableCell>
                <TableCell>Import Dates</TableCell>
                <TableCell>Months</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.idMarketDataFile}>
                    <TableCell>{parse(row.checkBoxHtml, options)}</TableCell>
                    <TableCell>
                      <Button
                        sx={{ color: "#719b5f" }}
                        onClick={() => onClickImportDate(row.importDate)}
                      >
                        {row.importDate}
                      </Button>{" "}
                    </TableCell>
                    <TableCell>{row.month}</TableCell>
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

export default BondsHistoryModal;
