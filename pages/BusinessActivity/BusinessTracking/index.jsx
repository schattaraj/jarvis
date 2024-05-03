import { useContext, useEffect, useState } from 'react'
import Navigation from '../../../components/navigation';
import Sidebar from '../../../components/sidebar';
import Loader from '../../../components/loader';
import { Context } from '../../../contexts/Context';
import parse from 'html-react-parser';
import { calculateAverage, searchTable } from '../../../utils/utils';
import { getImportsData } from '../../../utils/staticData';
import BondsHistoryModal from '../../../components/BondHstoryModal';
import { Autocomplete, TextField } from '@mui/material';
import BondChart from '../../../components/charts';
import { Pagination } from '../../../components/Pagination';
import SliceData from '../../../components/SliceData';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import formatAmount from '../../../components/formatAmount.js';

export default function BusinessTracking() {
    const [columnNames, setColumnNames] = useState([
        { "data": "advisorName", "column_name": "Advisor Name" },
        { "data": "date", "column_name": "Date" },
        { "data": "assetBroughtIn", "column_name": "Assets Brought In" },
        { "data": "assetBroughtFrom", "column_name": "Assets Brought in from?" },
        { "data": "totalAssetManagement", "column_name": "Total Assets Under Management" },
        { "data": "firstMeeting", "column_name": "1st Meetings" },
        { "data": "firstMeetingWhom", "column_name": "1st meeting with whom?" },
        { "data": "clientReview", "column_name": "Id of client review meetings" },
        { "data": "reviewMeetingWhom", "column_name": "Review meetings with whom" },
        { "data": "newClientId", "column_name": "Id of new clients" },
        { "data": "newClientName", "column_name": "New client name" },
        { "data": "outBoundId", "column_name": "Id of Outbound prospect/client engagement requests sent" },
        { "data": "idBusinessTracking", "column_name": "Action" }
    ])
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [openModal, setOpenModal] = useState(false);
    const [totalAssests, setTotalAssests] = useState(false);
    const [totalAssestsManagement, setTotalAssestsManagement] = useState(false);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const fetchData = async () => {
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllBusinessTracking?_=1710413237817")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const handlePage = async (action) => {
        switch (action) {
            case 'prev':
                setCurrentPage(currentPage - 1)
                break;
            case 'next':
                setCurrentPage(currentPage + 1)
                break;
            default:
                setCurrentPage(currentPage)
                break;
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig && sortConfig.key === columnName) {
            return sortConfig.direction === 'asc' ? <div className="arrow-icons up">
                <ArrowDropUpIcon />
                <ArrowDropDownIcon />
            </div>
                :
                <div className="arrow-icons down">
                    <ArrowDropUpIcon />
                    <ArrowDropDownIcon />
                </div>
        }
        else {
            return <div className="arrow-icons">
                <ArrowDropUpIcon />
                <ArrowDropDownIcon />
            </div>
        }
        return null;
    };
    const handleClose = () => {
        setOpenModal(false);
    }
    const handleOpen = () => {
        setOpenModal(true);
    }
    useEffect(() => {
        fetchData()
    }, [])
    useEffect(() => {
        async function run() {
            if (tableData.length > 0) {
                let items = [...tableData];
                if (sortConfig !== null) {
                    items.sort((a, b) => {
                        if (a[sortConfig.key] < b[sortConfig.key]) {
                            return sortConfig.direction === 'asc' ? -1 : 1;
                        }
                        if (a[sortConfig.key] > b[sortConfig.key]) {
                            return sortConfig.direction === 'asc' ? 1 : -1;
                        }
                        return 0;
                    });
                }
                const startIndex = (currentPage - 1) * limit;
                const endIndex = startIndex + limit;
                items = items.slice(startIndex, endIndex);
                setFilterData(items);
                const totalAssetBroughtIn = items.reduce((acc, item) => {
                    return acc + (Number(item.assetBroughtIn) ? Number(item.assetBroughtIn) : 0);
                }, 0);
                setTotalAssests(totalAssetBroughtIn)
                const totalAssetManagement = items.reduce((acc, item) => {
                    return acc + (Number(item.totalAssetManagement) ? Number(item.totalAssetManagement) : 0);
                }, 0);
                setTotalAssestsManagement(totalAssetManagement)
            }
        }
        run();
    }, [currentPage, tableData, sortConfig]);
    return (
        <>
            <div className="container-scroller">
                <Navigation />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="page-header">
                                <h3 className="page-title">
                                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                                        <i className="mdi mdi-home"></i>
                                    </span>Business Tracking
                                </h3>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                                    <button className="dt-button buttons-html5 btn-primary" type="button" onClick={handleOpen}><span>Add Business Tracking</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                            </div>
                            <div className="table-responsive">
                                <table className="table border display no-footer dataTable" style={{ width: "", marginLeft: "0px" }} role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {columnNames.map((columnName, index) => (
                                                <th key={index} onClick={() => handleSort(columnName.data)}>
                                                    {columnName.column_name}
                                                    {
                                                        columnName.data !== "idBusinessTracking" && getSortIcon(columnName.data)
                                                    }
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterData.map((rowData, rowIndex) => (
                                            <tr key={rowIndex} style={{ overflowWrap: 'break-word' }}>
                                                {
                                                    columnNames.map((columnName, colIndex) => {
                                                        let content;
                                                        content = rowData[columnName.data]
                                                        if (columnName.data == "idBusinessTracking") {
                                                            return <td key={colIndex}><button className='px-4 btn btn-primary'><i className="mdi mdi-pen"></i></button>
                                                                <button className='px-4 ms-2 btn btn-danger'><i className="mdi mdi-delete"></i></button>
                                                            </td>;
                                                        }
                                                        return <td key={colIndex}>{content}</td>;
                                                    })
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className='fixed'>
                                        <tr>
                                            <td colSpan={2}>Total Amount</td>
                                            <td>{formatAmount(totalAssests)}</td>
                                            <td></td>
                                            <td>{formatAmount(totalAssestsManagement)}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={openModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Business Tracking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>--Select--</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Which client was assets brought in from?</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. Of 1st Meetings</Form.Label>
                                    <Form.Control type="number" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of client review meetings</Form.Label>
                                    <Form.Control type="number" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of new clients</Form.Label>
                                    <Form.Control type="number" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of Outbound prospect/client engagement requests sent</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Assets Brought In ($)</Form.Label>
                                    <Form.Control type="number" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Total Assets Under Management ($)</Form.Label>
                                    <Form.Control type="number" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>1st meeting with whom</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Review meetings with whom</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>New client name</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                    <div className="d-flex justify-content-end">
                    <button className='btn btn-success me-2'>Submit</button>
                    <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
