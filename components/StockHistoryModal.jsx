import { useState, useEffect, useContext } from 'react';
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
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import { Context } from '../contexts/Context';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For PDF table auto-generation
const StockHistoryModal = ({ open, handleClose, setCompareData, setSelectedOption,filterBydate }) => {
    const [data, setData] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [dates, setDates] = useState({ date1: null, date2: null });
    const [searchQuery, setSearchQuery] = useState(''); 
    // const [compareData,setCompareData] = useState(false)
    const context = useContext(Context)
    const fetchData = async () => {
        try {
            const response = await fetch('https://www.jharvis.com/JarvisV2/findImportDatesByMonth?metaDataName=Tickers_Watchlist&_=1705052752528');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const filteredData = data.filter((row) =>
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
            const response = await fetch(`https://www.jharvis.com/JarvisV2/deleteHistoryData?idMarketDataFile=${deleteItemId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.msg);
                fetchData();
            } else {
                alert('Failed delete operation');
                console.error('Error deleting item:', result.msg);
            }
        } catch (error) {
            alert('Unknown Error');
            console.error('Error deleting item:', error);
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
            }
            else {
                Swal.fire({title:'You can only select up to two dates.',icon:'warning',confirmButtonColor:"var(--primary)"});
                return prevDates;
              }
        });
    };
    const options = {
        replace: (elememt) => {
            if (elememt?.attribs?.type === 'checkbox') {
                return (
                <input
                type="checkbox"
                value={elememt?.attribs?.value}
                name="dateChkBox"
                checked={dates.date1 === elememt?.attribs?.value || dates.date2 === elememt?.attribs?.value}
                onChange={handleDateChange}
              />
                );
            }
        }
    }
    const bondCompare = async()=>{
        if (!dates.date1 || !dates.date2) {
            Swal.fire({title:'Please select two dates',icon:'warning',confirmButtonColor:"var(--primary)"});
            return;
          }
          context.setLoaderState(true)
          try {
            const bondHistoryCompare = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getImportHistorySheetCompare?metadataName=Tickers_Watchlist&date1=${dates.date1}&date2=${dates.date2}`)
            const bondHistoryCompareRes = await bondHistoryCompare.json()
            setCompareData(bondHistoryCompareRes)
            setSelectedOption("History")
            handleClose()
            // console.log("bondHistoryCompareRes",bondHistoryCompareRes?.bestFiveStocks?.length) 
          } catch (error) {
            
          }
          context.setLoaderState(false)
    }
        
// Export table to Excel
const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "HistoryData.xlsx");
};

// Export table to CSV
const exportToCSV = () => {
    const csvData = filteredData.map(row => ({
        "Import Date": row.importDate,
        "Month": row.month,
    }));
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HistoryData.csv';
    a.click();
    window.URL.revokeObjectURL(url);
};

// Export table to PDF
const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("History Data", 20, 10);
    doc.autoTable({
        head: [['Import Date', 'Month']],
        body: filteredData.map(row => [row.importDate, row.month]),
    });
    doc.save('HistoryData.pdf');
};
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '90vh',
                    overflowY:"auto",
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                    <Typography variant="h6">Import History - Tickers Watchlist</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box className="mb-3">
                        <Button variant="contained" color="primary" onClick={()=>{exportToExcel()}} sx={{ marginRight: 1 }}>
                            Export to Excel
                        </Button>
                        <Button variant="contained" color="secondary" onClick={exportToCSV} sx={{ marginRight: 1 }}>
                            Export to CSV
                        </Button>
                        <Button variant="contained" color="error" onClick={exportToPDF}>
                            Export to PDF
                        </Button>
                    </Box>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Table className='table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Import Dates</TableCell>
                                <TableCell>Months</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow key={row.idMarketDataFile}>
                                    <TableCell>{parse(row.checkBoxHtml,options)}</TableCell>
                                    <TableCell><button className='p-0 border-0 bg-transparent' onClick={()=>{filterBydate(row.importDate)}}>{row.importDate}</button></TableCell>
                                    <TableCell>{row.month}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDelete(row.idMarketDataFile)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
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
                        <button className="btn btn-secondary" type="button" title="Cancel" onClick={handleClose}><span>Cancel</span></button>
                        <div className="dt-buttons mb-3"></div>
                        <button className="btn btn-primary" type="button" title="Compare" onClick={bondCompare}><span>Compare</span></button>
                        <div className="dt-buttons mb-3"></div>
                    </DialogActions>
                </Box>
                <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete the item with ID <b>{deleteItemId}</b>?
                    </DialogContent>
                    <DialogActions style={{ padding: 4 }}>
                        <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="Cancel" onClick={cancelDelete}><span>Cancel</span></button>
                        <div className="dt-buttons mb-3"></div>
                        <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="delete" onClick={confirmedDelete}><span>Delete</span></button>
                        <div className="dt-buttons mb-3"></div>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default StockHistoryModal;
