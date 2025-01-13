import { useContext, useEffect, useRef, useState } from 'react'
import Navigation from '../../../components/navigation';
import Sidebar from '../../../components/sidebar';
import Loader from '../../../components/loader';
import { Context } from '../../../contexts/Context';
import parse from 'html-react-parser';
import { calculateAverage, exportToExcel, fetchWithInterceptor, generatePDF, searchTable } from '../../../utils/utils';
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
import Swal from 'sweetalert2';
import StringToHTML from '../../../components/StringToHtml.jsx';
import ReactSelect from 'react-select';
import Link from 'next/link.js';
import Breadcrumb from '../../../components/Breadcrumb.js';
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
    const [editData, setEditData] = useState({})
    const [editModal, setEditModal] = useState(false)
    const [filterModal, setFilterModal] = useState(false)
    const [advisorData, setAdvisorData] = useState(false)
    const [advisorName, setAdvisorName] = useState(false)
    const [timeFrame, setTimeFrame] = useState("");
    const [isDate, setIsDate] = useState(false)
    const [dateRange, setDateRange] = useState({ startdate: "", enddate: "" })
    const [formData, setFormData] = useState({
        advisorName: '',
        assetBroughtIn: '',
        outBoundId: '',
        date: '',
        totalAssetManagement: '',
        firstMeeting: '',
        firstMeetingWhom: '',
        secondMeeting: '',
        secondMeetingWhom: '',
        clientReview: '',
        reviewMeetingWhom: '',
        newClientId: '',
        newClientName: '',
    });

    const [assetBroughtFrom, setAssetBroughtFrom] = useState([]);
    const [firstMeetingWhom, setFirstMeetingWhom] = useState([]);
    const [reviewMeetingWhom, setReviewMeetingWhom] = useState([]);
    const [newClientName, setNewClientName] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentInput2, setCurrentInput2] = useState('');
    const [currentInput3, setCurrentInput3] = useState('');
    const [currentInput4, setCurrentInput4] = useState('');
    const [dateRangeModal,setDateRangeModal] = useState(false)
    const [dates,setDates] = useState({ startdate: "", enddate: "" })
    const [isDate2, setIsDate2] = useState(false)
    const context = useContext(Context)
    const searchRef = useRef()
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const fetchData = async () => {
        context.setLoaderState(true)
        setDates({ startdate: "", enddate: "" })
        try {
            // const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllBusinessTracking?_=1710413237817")
            // const getBondsRes = await getBonds.json()
            const apiEndpoint = `/api/proxy?api=getAllBusinessTracking`;
            const response = await fetchWithInterceptor(apiEndpoint, false);
            setTableData(response)
            setFilterData(response)
            searchRef.current.value = ""
        }
        catch (e) {
            console.log("error", e)
            context.setLoaderState(false)
        }
        context.setLoaderState(false)
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
    const addBusinessTracking = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });

            jsonObject.assetBroughtFrom = assetBroughtFrom.join(', ');
            jsonObject.firstMeetingWhom = firstMeetingWhom.join(', ');
            jsonObject.reviewMeetingWhom = reviewMeetingWhom.join(', ');
            jsonObject.newClientName = newClientName.join(', ');

            const response = await fetch('/api/proxy?api=addBusinessTracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify(jsonObject)
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    title: result?.msg,
                    icon: "success",
                    confirmButtonColor: "#719B5F"
                });
                handleClose()
                fetchData()
            } else {
                Swal.fire({
                    title: response?.statusText,
                    icon: "error",
                });
                console.error('Error:', response.statusText);
            }
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const editBusinessTracking = async (id) => {
        openEditModal()
        setEditData(tableData.find((x) => x.idBusinessTracking == id));
    }
    const deleteBusinessTracking = async (id) => {
        let text = "Are you sure ?";
        Swal.fire({
            title: text,
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: { confirmButton: 'btn-danger', }
        }).then(async (result) => {
            if (result.isConfirmed) {
                context.setLoaderState(true)
                try {
                    const formData = new FormData();
                    formData.append("idBusinessTracking", id)
                    const rowDelete = await fetch("/api/proxy?api=deleteBusinessTracking", {
                        method: 'DELETE',
                        body: formData
                    })
                    if (rowDelete.ok) {
                        const rowDeleteRes = await rowDelete.json()
                        Swal.fire({
                            title: rowDeleteRes?.msg,
                            icon: "success",
                            confirmButtonColor: "#719B5F"
                        })
                        fetchData()

                    }
                } catch (error) {
                    console.log(error)
                }
                context.setLoaderState(false)
            }
        })
    }
    const openEditModal = () => {
        setEditModal(true)
    }
    const closeEditModal = () => {
        setEditModal(false)
    }
    const updateBusinessTracking = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });
            const response = await fetch('/api/proxy?api=editBusinessTracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonObject)
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    title: result?.msg,
                    icon: "success",
                    confirmButtonColor: "#719B5F"
                });
                closeEditModal()
                fetchData()
            } else {
                Swal.fire({
                    title: response?.statusText,
                    icon: "error",
                });
                console.error('Error:', response.statusText);
            }
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const handleEditData = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value })
    }
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
    const selectAdvisors = (e) => {
        setAdvisorName(e)
    }
    function filterDataByDateRange(data, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= start && itemDate <= end;
        });
    }
    const fetchAdvisorWise = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });
            const { advisorName, timeFrame, startdate, enddate } = jsonObject;
            let url = `/api/proxy?api=getDetailsByAdvisor?advisorName=${advisorName}`;
            if (timeFrame) {
                url += `&timeFrame=${timeFrame}`;
            } else {
                url += `&startdate=${startdate}&enddate=${enddate}`;
            }
            const fetchAdvisor = await fetch(url + "&_=1720608071572=")
            const fetchAdvisorRes = await fetchAdvisor.json()
            setAdvisorData(fetchAdvisorRes?.msg)
        } catch (error) {

        }
        context.setLoaderState(false)
    }
    const fetchDateRangeWise = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });
            console.log("jsonObject",jsonObject);
            const {startdate, enddate } = jsonObject;
            const filteredData = filterDataByDateRange(tableData, startdate, enddate);
            setFilterData(filteredData)
            setDateRangeModal(false)
            context.setLoaderState(false)
            console.log("filteredData",filteredData);
        } catch (error) {

        }
        context.setLoaderState(false)
    }
    const handleDate = (e) => {
        let selectedDate = { ...dateRange, [e.target.name]: e.target.value }
        if (selectedDate?.startdate || selectedDate?.enddate) {
            setIsDate(true)
            console.log("selectedDate", selectedDate);
        }
        else {
            setIsDate(false)
        }
        setDateRange({ ...dateRange, [e.target.name]: e.target.value })
    }
    const handleDateRange = (e) => {
        let selectedDate = { ...dates, [e.target.name]: e.target.value }
        if (selectedDate?.startdate || selectedDate?.enddate) {
            setIsDate2(true)
            console.log("selectedDate", selectedDate);
        }
        else {
            setIsDate2(false)
        }
        setDates({ ...dates, [e.target.name]: e.target.value })
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
                let dataLimit = limit
                if (dataLimit == "all") {
                    dataLimit = items?.length
                }
                const startIndex = (currentPage - 1) * dataLimit;
                const endIndex = startIndex + dataLimit;
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

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle input change
    const handleAssetInputChange = (e) => {
        if (e.target.name === "assetBroughtFrom") {
            setCurrentInput(e.target.value);
        }
        if (e.target.name === "firstMeetingWhom") {
            setCurrentInput2(e.target.value);
        }
        if (e.target.name === "reviewMeetingWhom") {
            setCurrentInput3(e.target.value);
        }
        if (e.target.name === "newClientName") {
            setCurrentInput4(e.target.value);
        }
    };

    // Handle Enter key press
    const handleAssetKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.target.name === "assetBroughtFrom" && currentInput.trim()) {
                if (!assetBroughtFrom.includes(currentInput.trim())) {
                    setAssetBroughtFrom([...assetBroughtFrom, currentInput.trim()]);
                }
                setCurrentInput('');
            }
            if (e.target.name === "firstMeetingWhom" && currentInput2.trim()) {
                if (!firstMeetingWhom.includes(currentInput2.trim())) {
                    setFirstMeetingWhom([...firstMeetingWhom, currentInput2.trim()]);
                }
                setCurrentInput2('');
            }
            if (e.target.name === "reviewMeetingWhom" && currentInput3.trim()) {
                if (!reviewMeetingWhom.includes(currentInput3.trim())) {
                    setReviewMeetingWhom([...reviewMeetingWhom, currentInput3.trim()]);
                }
                setCurrentInput3('');
            }
            if (e.target.name === "newClientName" && currentInput4.trim()) {
                if (!newClientName.includes(currentInput4.trim())) {
                    setNewClientName([...newClientName, currentInput4.trim()]);
                }
                setCurrentInput4('');
            }
        }
    };

    // Remove asset from the correct list
    const removeAsset = (asset, listType) => {
        console.log("Remove", listType);
        if (listType === "assetBroughtFrom") {
            setAssetBroughtFrom(assetBroughtFrom.filter((item) => item !== asset));
        }
        if (listType === "firstMeetingWhom") {
            setFirstMeetingWhom(firstMeetingWhom.filter((item) => item !== asset));
        }
        if (listType === "reviewMeetingWhom") {
            setReviewMeetingWhom(reviewMeetingWhom.filter((item) => item !== asset));
        }
        if (listType === "newClientName") {
            setNewClientName(newClientName.filter((item) => item !== asset));
        }
    };
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <Breadcrumb parent={"Admin"} />
                    <div className="page-header">
                        <h3 className="page-title">
                            <Link href={"/"}><span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span></Link>Business Tracking
                        </h3>
                    </div>
                    <div className="dt-buttons mb-3">
                        <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                        <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                    </div>
                    <div className='d-md-flex justify-content-between'>
                        <div className="dt-buttons">
                            {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                            {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={handleOpen}><span>Add Business Tracking</span></button>
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={() => { setFilterModal(true) }}><span>Advisor Wise</span></button>
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={() => { setDateRangeModal(true) }}><i className="mdi mdi-calendar-range"></i><span className='d-none'>Select Date Range</span></button>
                            
                        </div>
                        <div className="form-group d-flex flex-wrap flex-sm-nowrap align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input ref={searchRef} type="search" placeholder='' className='form-control mb-2 mb-sm-0' onChange={filter} />
                            <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>
                    {dates?.startdate &&  dates?.enddate && <span style={{fontSize:"14px",marginBottom:"16px",display:"block"}}>From <b>{dates?.startdate}</b> to <b>{dates?.enddate}</b></span>}
                    <div className="table-responsive">
                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                            <thead>
                                <tr>
                                    {columnNames.map((columnName, index) => (
                                        <th key={"table" + index} onClick={() => handleSort(columnName.data)} className={columnName.data === "idBusinessTracking" ? "sticky-action" : columnName.data == "advisorName" ? "sticky-left" : ""}>
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
                                                if (columnName.data == "assetBroughtIn" || columnName.data == "totalAssetManagement") {
                                                    content = formatAmount(content)
                                                }
                                                if (columnName.data == "advisorName") {
                                                    return <td key={colIndex} className='sticky-left'>{content}</td>;
                                                }
                                                if (columnName.data == "idBusinessTracking") {
                                                    return <td key={colIndex} className="sticky-action"><button className='px-4 btn btn-primary' onClick={() => { editBusinessTracking(rowData[columnName.data]) }}><i className="mdi mdi-pen"></i></button>
                                                        <button className='px-4 ms-2 btn btn-danger' title='delete' onClick={() => { deleteBusinessTracking(rowData[columnName.data]) }}><i className="mdi mdi-delete"></i></button>
                                                    </td>;
                                                }
                                                return <td key={colIndex}>{content}</td>;
                                            })
                                        }
                                    </tr>
                                ))}
                                {
                                    filterData.length == 0 && <tr><td>No Data Available</td></tr>
                                }
                            </tbody>
                            {/* <tfoot className='fixed'>
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
                            </tfoot> */}
                        </table>
                    </div>
                    {filterData.length > 0 && <Pagination currentPage={currentPage} totalItems={filterData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
            <Modal show={openModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Business Tracking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addBusinessTracking} autoComplete={"true"} method='POST' encType='multipart/form-data'>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <Form.Select aria-label="Default select example" name='advisorName' onChange={() => { }} required>
                                        <option value={""}>--Select--</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Assets Brought In ($)</Form.Label>
                                    <Form.Control type="number" name='assetBroughtIn' onChange={() => { }} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of Outbound prospect/client engagement requests sent</Form.Label>
                                    <Form.Control type="text" name='outBoundId' onChange={() => { }} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" name="date" onChange={() => { }} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Which client was assets brought in from?</Form.Label>
                                    {/* <Form.Control type="text" name='assetBroughtFrom' onChange={() => { }} required /> */}
                                    <Form.Control
                                        type="text"
                                        name="assetBroughtFrom"
                                        value={currentInput}
                                        onChange={handleAssetInputChange}
                                        onKeyDown={handleAssetKeyDown}
                                        placeholder="Type and press Enter to add"
                                    />
                                    <div className="asset-list">
                                        {assetBroughtFrom.map((asset, index) => (
                                            <div className="asset-item" key={index}>
                                                {asset}
                                                <button
                                                    type="button"
                                                    className="close"
                                                    aria-label="Close"
                                                    onClick={() => removeAsset(asset, "assetBroughtFrom")}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Total Assets Under Management ($)</Form.Label>
                                    <Form.Control type="number" name='totalAssetManagement' onChange={() => { }} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. Of 1st Meetings</Form.Label>
                                    <Form.Control type="number" name='firstMeeting' onChange={() => { }} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>1st meeting with whom</Form.Label>
                                    {/* <Form.Control type="text" name='firstMeetingWhom' onChange={() => { }} required /> */}
                                    <Form.Control
                                        type="text"
                                        name="firstMeetingWhom"
                                        value={currentInput2}
                                        onChange={handleAssetInputChange}
                                        onKeyDown={handleAssetKeyDown}
                                    />
                                    <div className="asset-list">
                                        {firstMeetingWhom.map((asset, index) => (
                                            <div className="asset-item" key={index}>
                                                {asset}
                                                <button
                                                    type="button"
                                                    className="close"
                                                    aria-label="Close"
                                                    onClick={() => removeAsset(asset, "firstMeetingWhom")}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. Of 2nd Meetings</Form.Label>
                                    <Form.Control type="number" name='secondMeeting' onChange={() => { }} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>2nd meeting with whom</Form.Label>
                                    <Form.Control type="text" name='secondMeetingWhom' onChange={() => { }} />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of client review meetings</Form.Label>
                                    <Form.Control type="number" name='clientReview' onChange={() => { }} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Review meetings with whom</Form.Label>
                                    {/* <Form.Control type="text" name='reviewMeetingWhom' onChange={() => { }} required /> */}
                                    <Form.Control
                                        type="text"
                                        name="reviewMeetingWhom"
                                        value={currentInput3}
                                        onChange={handleAssetInputChange}
                                        onKeyDown={handleAssetKeyDown}
                                    />
                                    <div className="asset-list">
                                        {reviewMeetingWhom.map((asset, index) => (
                                            <div className="asset-item" key={index}>
                                                {asset}
                                                <button
                                                    type="button"
                                                    className="close"
                                                    aria-label="Close"
                                                    onClick={() => removeAsset(asset, "reviewMeetingWhom")}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of new clients</Form.Label>
                                    <Form.Control type="number" name='newClientId' onChange={() => { }} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>New Client Name</Form.Label>
                                    {/* <Form.Control type="text" name='newClientName' onChange={() => { }} required /> */}
                                    <Form.Control
                                        type="text"
                                        name="newClientName"
                                        value={currentInput4}
                                        onChange={handleAssetInputChange}
                                        onKeyDown={handleAssetKeyDown}
                                    />
                                    <div className="asset-list">
                                        {newClientName.map((asset, index) => (
                                            <div className="asset-item" key={index}>
                                                {asset}
                                                <button
                                                    type="button"
                                                    className="close"
                                                    aria-label="Close"
                                                    onClick={() => removeAsset(asset, "newClientName")}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary me-2'>Submit</button>
                            <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={editModal} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Business Tracking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateBusinessTracking} autoComplete={"true"} method='POST' encType='multipart/form-data'>
                        <input type="hidden" name="idBusinessTracking" value={editData?.idBusinessTracking} />
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <Form.Select aria-label="Default select example" name='advisorName' defaultValue={editData?.advisorName} required>
                                        <option value={""}>--Select--</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" name="date" value={editData?.date} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Which client was assets brought in from?</Form.Label>
                                    <Form.Control type="text" name='assetBroughtFrom' value={editData?.assetBroughtFrom} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. Of 1st Meetings</Form.Label>
                                    <Form.Control type="number" name='firstMeeting' value={editData?.firstMeeting} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. Of 2nd Meetings</Form.Label>
                                    <Form.Control type="number" name='secondMeeting' value={editData?.secondMeeting} onChange={handleEditData} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of client review meetings</Form.Label>
                                    <Form.Control type="number" name='clientReview' value={editData?.clientReview} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of Outbound prospect/client engagement requests sent</Form.Label>
                                    <Form.Control type="text" name='outBoundId' value={editData?.outBoundId} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Assets Brought In ($)</Form.Label>
                                    <Form.Control type="number" name='assetBroughtIn' value={editData?.assetBroughtIn} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Total Assets Under Management ($)</Form.Label>
                                    <Form.Control type="number" name='totalAssetManagement' value={editData?.totalAssetManagement && Number(editData?.totalAssetManagement.replace(/,/g, ''))} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>1st meeting with whom</Form.Label>
                                    <Form.Control type="text" name='firstMeetingWhom' value={editData?.firstMeetingWhom} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>2nd meeting with whom</Form.Label>
                                    <Form.Control type="text" name='secondMeetingWhom' value={editData?.secondMeetingWhom} onChange={handleEditData} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Review meetings with whom</Form.Label>
                                    <Form.Control type="text" name='reviewMeetingWhom' value={editData?.reviewMeetingWhom} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>No. of new clients</Form.Label>
                                    <Form.Control type="number" name='newClientId' value={editData?.newClientId} onChange={handleEditData} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>New client name</Form.Label>
                                    <Form.Control type="text" name='newClientName' value={editData?.newClientName} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary me-2'>Submit</button>
                            <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={filterModal} onHide={() => { setFilterModal(false) }} className='big-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Advisor Wise</Modal.Title>
                </Modal.Header>
                <Modal.Body className='mw-100'>
                    <Form onSubmit={fetchAdvisorWise}>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="advisorName">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <ReactSelect onChange={selectAdvisors}
                                        isMulti options={[
                                            { value: "Noland", label: "Noland" },
                                            { value: "Freddy", label: "Freddy" },
                                            { value: "Brian", label: "Brian" },
                                        ]
                                        } required value={advisorName} />
                                    <input type="hidden" name='advisorName' value={advisorName && advisorName.map((item) => item.value).join(",")} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="timeFrame">
                                    <Form.Label>Time Frame</Form.Label>
                                    <Form.Select name='timeFrame' defaultValue={editData?.timeFrame} onChange={(e) => setTimeFrame(e.target.value)}
                                        disabled={isDate}
                                        required>
                                        <option value={""}>--Select--</option>
                                        <option value="lastweek">Last Week</option>
                                        <option value="week">Current Week</option>
                                        <option value="month">Current Month</option>
                                        <option value="quarter">Current Quarter</option>
                                        <option value="year">Current Year</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3'>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type='date' name='startdate' onChange={handleDate} disabled={!!timeFrame} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3'>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type='date' name='enddate' onChange={handleDate} disabled={!!timeFrame} required />
                                </Form.Group>
                            </div>
                        </div>
                        <button className='btn btn-primary me-2'>Fetch Details</button>
                        <div className="table-responsive my-4">
                            {
                                advisorData &&
                                <StringToHTML htmlString={advisorData} />
                            }
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-secondary' onClick={() => { setFilterModal(false) }}>Close</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={dateRangeModal} onHide={() => { setDateRangeModal(false) }} className='big-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body className='mw-100'>
                    <Form onSubmit={fetchDateRangeWise}>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className='mb-3'>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type='date' name='startdate' onChange={handleDateRange} value={dates?.startdate} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3'>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type='date' name='enddate' onChange={handleDateRange} value={dates?.enddate} required />
                                </Form.Group>
                            </div>
                        </div>
                        <button className='btn btn-primary me-2'>Fetch Details</button>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-secondary' onClick={() => { setDateRangeModal(false) }}>Close</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
