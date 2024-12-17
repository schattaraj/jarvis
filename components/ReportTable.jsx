import React, { useState, useEffect, useContext } from 'react';
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
import { Context } from '../contexts/Context';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For PDF table auto-generation
import { fetchWithInterceptor, formatDate, formatPublishedDate } from '../utils/utils';
import { Download } from '@mui/icons-material';
import Link from 'next/link';
function ReportTable({name, open, handleCloseModal,news }) {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [dates, setDates] = useState({ date1: null, date2: null });
    const [newsSentiment,setNewsSentiment] = useState(false)
    const context = useContext(Context)
    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getTickerReportsByTickerName?tickerName=${name}&_=${new Date().getTime()}`);
            // const result = await response.json();
            const api = `/api/proxy?api=getTickerReportsByTickerName?tickerName=${name}&_=${new Date().getTime()}`
            const result = await fetchWithInterceptor(api,false)
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        context.setLoaderState(false)
    };
    const fetchNewsSentiment = async()=>{
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${name}&apikey=TY1WA5LN5KU3SQIV `);
            const result = await response.json();
            setNewsSentiment(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const confirmedDelete = async () => {
        console.log(`Delete action triggered for ID ${deleteItemId}`);
        setDeleteConfirmationOpen(false);
        try {
            const response = await fetch(`https://www.jharvis.com/JarvisV2/deleteHistoryData?idMarketDataFile=${deleteItemId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.msg);
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
        handleCloseModal()
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
    const handleDelete = (id)=>{
        Swal.fire({
            title:"Are you sure ?",
            icon:"warning",
            confirmButtonText:"Delete",
            showCancelButton:true,
            customClass: { confirmButton: 'btn-danger'}
        }).then(async (result)=>{
            if (result.isConfirmed) {
                context.setLoaderState(true)
                try {
                    const deleteApi = await fetch(`https://jharvis.com/JarvisV2/deleteBondPortfolioByName?name=${name}&_=${new Date().getTime()}`)
                const deleteApiRes = deleteApi.json()
                console.log("Success",deleteApiRes)
                } catch (error) {
                    console.log("Error",error)
                }
                context.setLoaderState(false)
            }
        })
    }
    const handleDownload = async(reportfileDetails)=>{
        const url = process.env.NEXT_PUBLIC_BASE_URL_V2+"downloadPDF?fileName="+reportfileDetails
        window.open(url,"_blank")
    }
    // Filter the data based on the search query
    const filteredData = data.filter((row) =>
        row.tickerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    useEffect(() => {
        if (open) {
            fetchData();
            fetchNewsSentiment()
        }
    }, [open]);
  return (
      <Modal open={open} onClose={handleCloseModal}>
            <Box
                sx={{
                    // position: 'absolute',
                    // top: '50%',
                    // left: '50%',
                    // transform: 'translate(-50%, -50%)',
                    marginLeft:"auto",
                    marginRight:"auto",
                    width: '80%',
                    overflowY:"auto",
                    height:'auto',
                    maxHeight: '100vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2, }}>
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
                <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Table className='table'>
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
                            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow key={row?.idTickerReports}>
                                    <TableCell>{row?.tickerName}</TableCell>
                                    <TableCell>{row?.companyName}</TableCell>
                                    <TableCell>{row?.description}</TableCell>
                                    <TableCell>{row?.catagoryType}</TableCell>
                                    <TableCell>{formatDate(row?.reportDate)}</TableCell>
                                    <TableCell className='text-center'>
                                    <IconButton onClick={() => handleDownload(row.reportfileDetails)} className='text-primary'>
                                            <Download />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(row.idTickerReports)} className='text-danger'>
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
                        <button className="btn btn-secondary" type="button" title="Cancel" onClick={cancelDelete}><span>Cancel</span></button>
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
                {
                    news && newsSentiment &&
                    <>
                    <div className="news-area">
                    <h3>News Sentiment</h3>                    
                    <h4><Link href={newsSentiment?.feed[0]?.url}>{newsSentiment?.feed[0]?.title}</Link></h4>
                   {newsSentiment?.feed[0]?.banner_image && <img src={newsSentiment?.feed[0]?.banner_image} alt="" className="image" loading='lazy'/>}
                    <p>By <span className='name'>{newsSentiment?.feed[0]?.authors[0]}</span> - {formatPublishedDate(newsSentiment?.feed[0]?.time_published)}</p>
                    <p>Summary : {newsSentiment?.feed[0]?.summary}</p>
                    <h6>Topics :</h6>
                    <ul>
                        {
                            newsSentiment?.feed[0]?.topics?.map((item)=>{
                                return <li>{item?.topic} - {item?.relevance_score}</li>
                            })
                        }
                    </ul>
                    <h6>Overall Sentiment Score : {newsSentiment?.feed[0]?.overall_sentiment_score}</h6>
                    </div>
                    </>
                }
                
            </Box>
        </Modal>
  )
}

export default ReportTable