import { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../../../contexts/Context.js';
import { amountSeperator, calculateSum, searchTable } from '../../../utils/utils.js';
import { Autocomplete, TextField } from '@mui/material';
import { Pagination } from '../../../components/Pagination.jsx';
import SliceData from '../../../components/SliceData.js';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import StringToHTML from '../../../components/StringToHtml.jsx';
import formatAmount from '../../../components/formatAmount.js';
import Select from 'react-select'
import Swal from 'sweetalert2';
import Link from 'next/link.js';
import Breadcrumb from '../../../components/Breadcrumb.js';
export default function SeminarTracking() {
    const [columnNames, setColumnNames] = useState([
        { "data": "#", "display_name": "#" },
        { "data": "date", "display_name": "Date" },
        { "data": "totalCost", "display_name": "Opportunity" },
        { "data": "venue", "display_name": "Venue" },
        { "data": "seminarType", "display_name": "Seminar Type" },
        { "data": "geographicLocation", "display_name": "Geographic Location" },
        { "data": "registeredForSeminar", "display_name": "Registered For Seminar" },
        { "data": "cameToSeminar", "display_name": "Came To Seminar" },
        { "data": "appointmentsSet", "display_name": "Appointments Set" },
        { "data": "appointmentsSetPostSeminar", "display_name": "Appointments Set Post Seminar" },
        { "data": "firstMeeting", "display_name": "1st Meetings" },
        { "data": "secondMeeting", "display_name": "2nd Meetings" },
        { "data": "newClient", "display_name": "New Clients" },
        { "data": "newAUM", "display_name": "New AUM" },
        { "data": "action", "display_name": "Action" }
    ])
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [openModal, setOpenModal] = useState(false);
    const [openAmountModal, setOpenAmountModal] = useState(false);
    const [allAmounts, setALlAmounts] = useState(false)
    const [allAmountString, setAllAmountString] = useState(false)

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    
    const [errors, setErrors] = useState({})
    const [validated, setValidated] = useState(false);
    const [editData, setEditData] = useState({});
    const [selectedSeminar, setSelectedSeminar] = useState([])
    const context = useContext(Context)
    const searchRef = useRef()

    const filter = (e) => {
        const value = e.target.value;
        setSelectedSeminar([]); // Reset checkboxes on any search
        setFilterData(searchTable(tableData, value));
    }
    
    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllSeminarTracking")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
            if (searchRef.current && searchRef.current.value) {
                searchRef.current.value = ""
            }
        }
        catch (e) {
            console.log("error", e)
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
        setEditData("");
    }
    const handleOpen = () => {
        setOpenModal(true);
    }
    const submitForm = async (e) => {
        e.preventDefault()
        const errors = {}
        context.setLoaderState(true)
        try {
            const form = e.target;
            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
            }

            setValidated(true);
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                if (!value) {
                    errors[key] = `${key} field is required`
                }
                jsonObject[key] = value;
            });
            setErrors(errors);

            let addPipeline = null;

            if(!jsonObject.idSeminarTracking){
                addPipeline = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "addSeminarTracking", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonObject)
                })
            } else {
                addPipeline = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "editSeminarTracking", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonObject)
                })
            }
            const addPipelineRes = await addPipeline.json()
            Swal.fire({
                title: addPipelineRes?.msg,
                // text: "You clicked the button!",
                icon: "success",
                background: "green"
            });
            //alert(addPipelineRes?.msg)
            fetchData();
            handleClose();
            //console.log("json", jsonObject)
        } catch (error) {
            console.log(error)
        }
        context.setLoaderState(false)
        console.log(e)
    }
    const deleteSeminarTracking = async (id) => {
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
                    formData.append("idSeminarTracking", id)
                    const rowDelete = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "deleteSeminarTracking", {
                        method: 'DELETE',
                        body: formData
                    })
                    if (rowDelete.ok) {
                        const rowDeleteRes = await rowDelete.json()
                        Swal.fire("Deleted!", "", "success");
                        alert(rowDeleteRes.msg)
                        fetchData()
                    }
                } catch (error) {
                    console.log(error)
                }
                context.setLoaderState(false)
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }
   
    const changeLimit = (e) => {
        setLimit(e.target.value)
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
            }
        }
        run();
    }, [currentPage, tableData, sortConfig, limit]);

    // Add new useEffect to handle search reset
    useEffect(() => {
        if (searchRef.current && searchRef.current.value === '') {
            setFilterData(tableData);
        }
    }, [tableData]);

    const handleEditModal = async (id) => {
        const getSeminarData = await fetch(`https://jharvis.com/JarvisV2/getSeminarTrackingByID?idSeminarTracking=${id}`);
        const getSemeniarRes = await getSeminarData.json();
        console.log("Response", getSemeniarRes);
        setEditData(getSemeniarRes);
        setOpenModal(true);
    }

    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                <Breadcrumb parent={"Admin"}/>
                    <div className="page-header">
                        <h3 className="page-title">
                            <Link href={"/"}><span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span></Link>Seminar Tracking
                        </h3>
                    </div>
                    <div className='d-md-flex justify-content-between mt-3'>
                        <div className="dt-buttons">
                            {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={handleOpen}><span>Add Seminar Tracking</span></button>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} ref={searchRef} />
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
                    <div className="table-responsive">
                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                            <thead>
                                <tr>
                                    {/* <th className="text-center"> # </th> */}
                                    {columnNames.map((columnName, index) => (
                                        <th key={index} onClick={() => handleSort(columnName.data)}
                                            className={ columnName.data == "#" ? "text-center" : columnName.data === "action" ? "sticky-action" : columnName.data == "name" ? "sticky-left" : ""} style={{ minWidth: columnName.data == "#" ? "4rem" : "auto" }}>
                                            {columnName.display_name}
                                            { columnName.data == "#" ? "" : getSortIcon(columnName.data)}
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
                                                if (columnName.data == "action") {
                                                    return <td key={colIndex} className='sticky-action'>
                                                        <button className='px-4 btn btn-primary' title="Edit" onClick={() => { handleEditModal(rowData?.idSeminarTracking) }}><i className="mdi mdi-pen"></i></button>
                                                        <button className='px-4 ms-2 btn btn-danger' title='Delete' onClick={() => { deleteSeminarTracking(rowData?.idSeminarTracking) }}><i className="mdi mdi-delete"></i></button>
                                                    </td>;
                                                }
                                                if (columnName.data == "#") {
                                                    return <td className="text-center">
                                                        <div class="form-check d-flex justify-content-center">
                                                        <input
                                                            class="form-check-input"
                                                            style={{ cursor: "pointer", width:"15px", height:"15px" }}
                                                            type="checkbox"
                                                            value={rowData?.idSeminarTracking}
                                                            id="checkDefault"
                                                            checked={selectedSeminar.includes(rowData?.idSeminarTracking)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedSeminar([...selectedSeminar, rowData?.idSeminarTracking])
                                                                } else {
                                                                    setSelectedSeminar(selectedSeminar.filter((id) => id !== rowData?.idSeminarTracking))
                                                                }
                                                            }}
                                                        />
                                                        </div>
                                                    </td>;
                                                }
                                                return <td key={colIndex}>{content}</td>;
                                            })
                                        }
                                    </tr>
                                ))}
                            </tbody>
                            <thead>
                                <tr>
                                    {filterData.length
                                        ? columnNames.map((item, index) => {
                                            if (item.data === "totalCost") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "totalCost"
                                                )}{" "}
                                                </th>
                                            );
                                            }
                                            if (item.data === "registeredForSeminar") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "registeredForSeminar"
                                                )}{" "}
                                                </th>
                                            );
                                            }
                                            if (item.data === "cameToSeminar") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "cameToSeminar"
                                                )}
                                                </th>
                                            );
                                            }
                                            if (item.data === "appointmentsSet") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "appointmentsSet"
                                                )}
                                                </th>
                                            );
                                            }
                                            if (item.data === "appointmentsSetPostSeminar") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "appointmentsSetPostSeminar"
                                                )}
                                                </th>
                                            );
                                            }
                                            if (item.data === "firstMeeting") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "firstMeeting"
                                                )}
                                                </th>
                                            );
                                            }
                                            if (item.data === "secondMeeting") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "secondMeeting"
                                                )}
                                                </th>
                                            );
                                            }
                                            if (item.data === "newClient") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "newClient"
                                                )}
                                                </th>
                                            );
                                            }
                                            if (item.data === "newAUM") {
                                            return (
                                                <th key={index}>
                                                {calculateSum(
                                                    selectedSeminar.length > 0 
                                                        ? filterData.filter((row) => selectedSeminar.includes(row.idSeminarTracking)) 
                                                        : filterData,
                                                    "newAUM"
                                                )}
                                                </th>
                                            );
                                            } else {
                                            return <th key={index}></th>;
                                            }
                                        })
                                        : null}
                    </tr>
                            </thead>
                        </table>
                    </div>
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
            <Modal show={openModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{!editData ? "Add" : "Edit"} Seminar Tracking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitForm}>
                        {editData ? (<Form.Control type="hidden" name='idSeminarTracking' value={editData.idSeminarTracking} />) : ""}
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" name='date' defaultValue={editData.date} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Total Cost ($)</Form.Label>
                                    <Form.Control type="number" step="0.01" name='totalCost' defaultValue={editData.totalCost} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Venue</Form.Label>
                                    <Form.Control type="text" name='venue' defaultValue={editData.venue} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Seminar Type</Form.Label>
                                    <Form.Select name="seminarType" required defaultValue={editData.seminarType}>
                                        <option value={""}>--Select--</option>
                                        <option value={"Dinner"}>Dinner</option>
                                        <option value={"Library"}>Library</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Geographic Location</Form.Label>
                                    <Form.Control type="text" name='geographicLocation' defaultValue={editData.geographicLocation} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Registered for Seminar</Form.Label>
                                    <Form.Control type="number" name='registeredForSeminar' defaultValue={editData.registeredForSeminar} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Came to Seminar</Form.Label>
                                    <Form.Control type="number" name='cameToSeminar' defaultValue={editData.cameToSeminar} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Appointments Set</Form.Label>
                                    <Form.Control type="number" name='appointmentsSet' defaultValue={editData.appointmentsSet} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Appointments Set Post Seminar</Form.Label>
                                    <Form.Control type="number" name='appointmentsSetPostSeminar' defaultValue={editData.appointmentsSetPostSeminar} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>First Meeting</Form.Label>
                                    <Form.Control type="text" name='firstMeeting' defaultValue={editData.firstMeeting} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Second Meeting</Form.Label>
                                    <Form.Control type="text" name='secondMeeting' defaultValue={editData.secondMeeting} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>New Client</Form.Label>
                                    <Form.Control type="number" name='newClient' defaultValue={editData.newClient} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>New AUM</Form.Label>
                                    <Form.Control type="number" name='newAUM' defaultValue={editData.newAUM} required />
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
        </>
    )
}
