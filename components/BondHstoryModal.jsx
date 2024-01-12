import React, { useState, useEffect } from 'react';
import { Modal, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, IconButton, Typography, Box, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import parse from 'html-react-parser';


const BondsHistoryModal = ({ open, handleClose }) => {
    const [data, setData] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch('https://www.jharvis.com/JarvisV2/findImportDatesByMonth?metaDataName=Bondpricing_Master&_=1705052752528');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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
        setDeleteItemId(null);
        setDeleteConfirmationOpen(false);
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
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography variant="h6">Bonds History</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Import Dates</TableCell>
                                <TableCell>Months</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.idMarketDataFile}>
                                    <TableCell>{parse(row.checkBoxHtml)}</TableCell>
                                    <TableCell>{row.importDate}</TableCell>
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
                <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete the item with ID <b>{deleteItemId}</b>?
                    </DialogContent>
                    <DialogActions>
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

export default BondsHistoryModal;
