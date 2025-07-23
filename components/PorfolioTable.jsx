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
import "jspdf-autotable"; // For PDF table auto-generation
import { fetchWithInterceptor, sortBySelection } from "../utils/utils";
import { PaginationNew } from "./PaginationNew";
function PortfolioTable({
  url,
  open,
  heading,
  handleCloseModal,
  editPortfolioName,
  getAllBondForPolios,

  currentPage3,
  setCurrentPage3,
  totalElements3,
  setTotalElements3,
  totalPages3,
  setTotalPages3,
  limit3,
  changeLimit3,
  handlePage3,
}) {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [fullMergedData, setFullMergedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [dates, setDates] = useState({ date1: null, date2: null });
  const context = useContext(Context);
  const [selectedStocks, setSelectedStocks] = useState([]);

  const fetchData = async () => {
    context.setLoaderState(true);
    try {
      // Step 1: Fetch paginated data
      const paginatedResult = await fetchWithInterceptor(url);
      const paginatedData = paginatedResult?.content || [];

      // // Step 2: Fetch all data once (you can cache this to avoid repeated calls)
      // const allDataUrl = `/api/proxy?api=${
      //   url.split("?api=")[1].split("&")[0]
      // }&pageNumber=0&pageSize=100000`;
      // const fullResult = await fetchWithInterceptor(allDataUrl);
      // const fullData = fullResult?.content || [];

      // // Step 3: Extract checked bonds from full data
      // const checkedData = fullData.filter((item) =>
      //   item.checkBoxHtml?.includes("checked")
      // );

      // // Step 4: Filter out checked items from paginatedData to avoid duplication
      // const uncheckedPaginated = paginatedData.filter(
      //   (paginatedItem) =>
      //     !checkedData.some(
      //       (checked) => checked.issuerName === paginatedItem.issuerName
      //     )
      // );

      // // Step 5: Combine checked + unchecked, then trim to pagination limit
      // const mergedData = [...checkedData, ...uncheckedPaginated];

      // setFullMergedData(mergedData);
      // const limitedMergedData =
      //   limit3 !== "all" ? mergedData.slice(0, parseInt(limit3)) : mergedData;

      // Step 6: Set states
      setData(paginatedData);
      setFilterData(paginatedData); // assuming you use this for search too
      setTotalPages3(paginatedResult.totalPages);
      setTotalElements3(paginatedResult.totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      context.setLoaderState(false);
    }
  };

  useEffect(() => {
    const filtered = data.filter((row) =>
      row?.issuerName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const slicedFiltered =
      limit3 !== "all" ? filtered.slice(0, parseInt(limit3)) : filtered;

    setData(slicedFiltered);
    setFilterData(slicedFiltered);
  }, [searchQuery, data, limit3]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Filter the data based on the search query
  const filteredData = data.filter((row) =>
    row?.issuerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCheckboxChange = (e, issuerName) => {
    const isChecked = e.target.checked;

    setSelectedStocks((prevStocks) => {
      if (isChecked) {
        // Add stock if checkbox is checked
        console.log("Output", {
          name: issuerName,
          share: "",
          purchaseDate: "",
          purchasePrice: "",
        });
        return [
          ...prevStocks,
          {
            issuerName: issuerName,
            share: "",
            purchaseDate: "",
            purchasePrice: "",
          },
        ];
      } else {
        console.log(
          "Output",
          prevStocks.filter((stock) => stock.issuerName !== issuerName)
        );
        // Remove stock if checkbox is unchecked
        return prevStocks.filter((stock) => stock.issuerName !== issuerName);
      }
    });

    console.log(selectedStocks);

    setFilterData((prev) => sortBySelection(prev, data));
    console.log("issuerName", issuerName, e.target.checked);
  };

  const handleInputChange = (e, issuerName) => {
    const { name, value } = e.target;

    setSelectedStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.issuerName === issuerName ? { ...stock, [name]: value } : stock
      )
    );
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
    return newErrors;
  };
  const updatePortfolio = async () => {
    const errors = validateStocks();
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        title: "Validation Errors",
        text: "Please fill in all required fields for selected symbols.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    if (!editPortfolioName) {
      Swal.fire({
        title: "Portfolio Name Required",
        text: "Please enter a portfolio name.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }
    const url = new URL(
      `/api/proxy?api=createBondPortfolio?name=${editPortfolioName}&visiblePortFolio=yes&userId=2&bodyType=form`
    );
    // const params = {
    //     name: editPortfolioName,
    //     visiblePortFolio: "yes",
    //     userId: 2 // Get userId dynamically if needed
    // };

    const formData = new FormData();
    selectedStocks.forEach((stock) => {
      const dataString = `${stock.issuerName.split(" |")[0]}~${stock.share}~${
        stock.purchaseDate
      }~${stock.purchasePrice}`;
      formData.append("myArray[]", dataString);
    });
    // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    context.setLoaderState(true);
    // console.log("url", url, selectedStocks);
    try {
      const response = await fetchWithInterceptor(url, false, false, {
        method: "POST",
        body: formData,
        // Note: Fetch does not support query parameters directly; add them manually to the URL if needed
        // params: params // fetch does not support params directly; append them to URL if needed
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      handleCloseModal(false);
      getAllBondForPolios();
      console.log("Portfolio created successfully:", data);
    } catch (error) {
      console.error("Error creating portfolio:", error);
    } finally {
      context.setLoaderState(false);
    }
  };
  useEffect(() => {
    if (data.length > 0) {
      setSelectedStocks(
        data.filter((bond) => bond.checkBoxHtml.includes("checked"))
      );
    }
  }, [data]);

  //fetch when modal opens
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  //fetch when changing limits or page
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [limit3, currentPage3]);

  const sortedData = [...filteredData].sort((a, b) => {
    const aChecked = selectedStocks.some(
      (stock) => stock.issuerName === a.issuerName
    );
    const bChecked = selectedStocks.some(
      (stock) => stock.issuerName === b.issuerName
    );
    return aChecked === bChecked ? 0 : aChecked ? -1 : 1; // Checked first
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        handleCloseModal;
      }}
      className="portfolio-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "80%",
          overflowY: "auto",
          maxHeight: "90vh",
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
          <Typography variant="h6">{heading}</Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 2,
          }}
        >
          {/* <TextField 
                    name='portfolioName'
                    label="Portfolio Name"
                    variant="outlined"
                    fullWidth
                    value={editPortfolioName} 
                    sx={{ marginBottom: 2,marginRight:5 }}
                    slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                />
                <button className='btn btn-primary text-nowrap' onClick={() => { }}>Edit Portfolio</button> */}
          <div className="row w-100 align-items-center">
            <div className="col-md-6">
              <div className="form-group d-flex mb-0">
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Portfolio Name"
                  name="portfolioName"
                  value={editPortfolioName}
                  readOnly
                />
                <button
                  className="btn btn-primary text-nowrap"
                  onClick={updatePortfolio}
                >
                  Update Portfolio
                </button>
              </div>
            </div>
            <div className="col-md-6 text-right">
              <TextField
                type="search"
                label="Search"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Share</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Purchase Price</TableCell>
              </TableRow>
            </TableHead>
            {/* filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => { */}
            <TableBody>
              {filterData.map((item, index) => {
                const isChecked = selectedStocks.some(
                  (stock) => stock.issuerName === item?.issuerName
                );

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <input
                        type="checkbox"
                        name="stockChkBox"
                        onChange={(e) =>
                          handleCheckboxChange(e, item?.issuerName)
                        }
                        checked={isChecked}
                      />
                    </TableCell>
                    <TableCell>{item?.issuerName || ""}</TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={
                          selectedStocks.find(
                            (stock) => stock.issuerName === item?.issuerName
                          )?.share || ""
                        }
                        name="share"
                        placeholder="Share"
                        className="form-control"
                        onChange={(e) => handleInputChange(e, item?.issuerName)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="date"
                        value={
                          selectedStocks.find(
                            (stock) => stock.issuerName === item?.issuerName
                          )?.purchaseDate || ""
                        }
                        name="purchaseDate"
                        className="form-control"
                        onChange={(e) => handleInputChange(e, item?.issuerName)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={
                          selectedStocks.find(
                            (stock) => stock.issuerName === item?.issuerName
                          )?.purchasePrice || ""
                        }
                        name="purchasePrice"
                        placeholder="Purchase Price"
                        className="form-control"
                        onChange={(e) => handleInputChange(e, item?.issuerName)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
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
          <div className="form-group d-flex align-items-center mb-0 me-3">
            <label
              style={{ textWrap: "nowrap" }}
              className="text-success ms-2 me-2 mb-0"
            >
              Show :{" "}
            </label>
            <select
              name="limit"
              className="form-select w-auto"
              onChange={changeLimit3}
              value={limit3}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>
          </div>
          <PaginationNew
            currentPage={currentPage3}
            totalItems={totalElements3}
            totalPage={totalPages3}
            limit={limit3}
            setCurrentPage={setCurrentPage3}
            handlePage={handlePage3}
          />
          {/* <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Box>
      </Box>
    </Modal>
  );
}

export default PortfolioTable;
