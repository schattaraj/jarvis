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
import formatAmount from '../../../components/formatAmount';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import ReactSelect from 'react-select';
import Link from 'next/link';

export default function Prospects() {
    const [columnNames, setColumnNames] = useState([
        { "data": "name", "column_name": "Name" },
        { "data": "refferedDate", "column_name": "Date referred/added" },
        { "data": "details", "column_name": "Details" },
        { "data": "amount", "column_name": "Amount" },
        { "data": "email", "column_name": "E-mail" },
        { "data": "notes", "column_name": "Notes" },
        { "data": "refferedBy", "column_name": "Referred by" },
        { "data": "recentActivity", "column_name": "Most recent activity" },
        { "data": "mostRecentActivity", "column_name": "Relationship Manager" },
        { "data": "idProspect", "column_name": "Action" }
    ])
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [totalAmount, setTotalAmount] = useState(false)

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [editModal, setEditModal] = useState(false)
    const [editData, setEditData] = useState({})
    const [createModal, setCreateModal] = useState(false)
    const [formData, setFormData] = useState({})
    const [RMdata, setRMdata] = useState(false)
    const [filterModal, setFilterModal] = useState(false)
    const context = useContext(Context)
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllProspect?_=1711707171694")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
        }
        catch (e) {
            console.log("error", e)
            Swal.fire({
                title: e.message,
                icon: "error",
                text:"Please check your internet connection first",
                confirmButtonColor: "#719B5F",
                confirmButtonText: "Retry",
                showCancelButton: true,
                cancelButtonText: "Ok"
            }).then(async (result) => {
                if (result.isConfirmed) {

                }
            })
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
    const editProspects = (id) => {
        setEditData(tableData.find((x) => x?.idProspect == id));
        setEditModal(true)
    }
    const handleEditData = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value })
    }
    const updateProspects = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "editProspect", {
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
                setEditModal(false)
                fetchData()
            } else {
                Swal.fire({
                    title: response?.statusText,
                    icon: "error",
                });
                console.error('Error:', response.statusText);
            }
        } catch (error) {

        }
        context.setLoaderState(false)
    }
    const deleteProspects = async (id) => {
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
                    formData.append("idProspect", id)
                    const rowDelete = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "deleteProspect", {
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
    const addProspects = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + 'addProspect', {
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
                setCreateModal(false)
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
    const handleFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
    const handleRM = (e) => {
        setRMdata(e)
    }
    const getSearchProspects = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        try {
            const form = e.target;
            const formData = new FormData(form);
            let jsonObject = {}
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            }); 
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + 'getSearchProspects?mostRecentActivity=' + jsonObject.mostRecentActivity + '&referredBy=' + jsonObject.referredBy + '&name=' + jsonObject.name + '&startDate=' + jsonObject.startDate + '&endDate=' + jsonObject.endDate + '&_=1720684658500');
            if (response.ok) {
                const result = await response.json();
                if (result.length > 0) {
                    setTableData(result)
                    setFilterData(result)
                    setFilterModal(false)
                }
                else {
                    Swal.fire({
                        title: "No data available",
                        icon: "error",
                    });
                }
            }
        }
        catch (e) {
            console.log("error",e)
            Swal.fire({
                title: e.message,
                icon: "error",
            });
        }
        context.setLoaderState(false)
    }
    const reset = ()=>{
        fetchData()
        setFilterModal(false)
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
                const startIndex = (currentPage - 1) * limit;
                const endIndex = startIndex + limit;
                items = items.slice(startIndex, endIndex);
                setFilterData(items);
                const total = items.reduce((acc, item) => {
                    item.amount = item.amount.replace("$", "")
                    item.amount = item.amount.replaceAll(",", "")
                    return acc + (Number(item.amount) ? Number(item.amount) : 0);
                }, 0);
                setTotalAmount(total);
            }
        }
        run();
    }, [currentPage, tableData, sortConfig]);
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                        <Link href={"/"}><span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span></Link>Prospects
                        </h3>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                            <button className="dt-button buttons-html5 btn-primary" type="button" onClick={() => { setCreateModal(true) }}><span>Add Prospects</span></button>
                            <button className="dt-button buttons-html5 btn-primary" type="button" onClick={() => { setFilterModal(true) }}><span>Filter</span></button>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} />
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
                                    {columnNames.map((columnName, index) => (
                                        <th key={index} onClick={() => handleSort(columnName.data)} className={columnName.data === "idProspect" ? "sticky-action" : columnName.data == "name" ? "sticky-left" : ""}>
                                            {columnName.column_name}
                                            {
                                                columnName.data !== "idProspect" && getSortIcon(columnName.data)
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
                                                if (columnName.data == "idProspect") {
                                                    return <td key={colIndex} className='sticky-action'><button className='px-4 btn btn-primary' onClick={() => { editProspects(content) }}><i className="mdi mdi-pen"></i></button>
                                                        <button className='px-4 ms-2 btn btn-danger' onClick={() => { deleteProspects(content) }}><i className="mdi mdi-delete"></i></button>
                                                    </td>;
                                                }
                                                return <td key={colIndex} className={columnName?.data == "name" ? "sticky-left" : ""}>{content}</td>;
                                            })
                                        }
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className='fixed'>
                                <tr>
                                    <td colSpan={3}>Total Amount</td>
                                    <td>{formatAmount(totalAmount)}</td>
                                    <td colSpan={11}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
            <Modal show={createModal} onHide={() => { setCreateModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Prospects</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addProspects}>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editname'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' name='name' value={formData?.name} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editdateReferred'>
                                    <Form.Label>Date Reffered/Added</Form.Label>
                                    <Form.Control type='date' name='refferedDate' value={formData?.refferedDate} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editdetails'>
                                    <Form.Label>Details</Form.Label>
                                    <Form.Control type='text' name='details' value={formData?.details} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editamounts'>
                                    <Form.Label>Amounts($)</Form.Label>
                                    <Form.Control type='number' name='amount' value={formData?.amount} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editphoneNo'>
                                    <Form.Label>Phone No</Form.Label>
                                    <Form.Control type='text' name='phoneNo' value={formData?.phoneNo} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editemail'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type='email' name='email' value={formData?.email} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editnotes'>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control type='text' name='notes' value={formData?.notes} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='refferedBy'>
                                    <Form.Label>Reffered By</Form.Label>
                                    <Form.Control type='text' name='refferedBy' value={formData?.refferedBy} onChange={handleFormData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editmostRecentActivity'>
                                    <Form.Label>Relationship Manager</Form.Label>
                                    <Form.Select type='text' name='mostRecentActivity' onChange={handleFormData} value={formData?.mostRecentActivity}>
                                        <option value="">--Select --</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='refferedBy'>
                                    <Form.Label>Most Recent Activity</Form.Label>
                                    <Form.Control type='text' name='recentActivity' onChange={handleFormData} value={formData?.recentActivity} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary me-2'>Submit</button>
                            <button className='btn btn-secondary' type='button' onClick={() => { setCreateModal(false) }}>Cancel</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={editModal} onHide={() => { setEditModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Prospects</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateProspects}>
                        <div className="row">
                            <input type="hidden" name="idProspect" value={editData?.idProspect} />
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editname'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' name='name' value={editData?.name} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editdateReferred'>
                                    <Form.Label>Date Reffered/Added</Form.Label>
                                    <Form.Control type='date' name='refferedDate' value={editData?.refferedDate} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editdetails'>
                                    <Form.Label>Details</Form.Label>
                                    <Form.Control type='text' name='details' value={editData?.details} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editamounts'>
                                    <Form.Label>Amounts($)</Form.Label>
                                    <Form.Control type='number' name='amount' value={editData?.amount} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editphoneNo'>
                                    <Form.Label>Phone No</Form.Label>
                                    <Form.Control type='text' name='phoneNo' value={editData?.phoneNo} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editemail'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type='email' name='email' value={editData?.email} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editnotes'>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control type='text' name='notes' value={editData?.notes} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='refferedBy'>
                                    <Form.Label>Reffered By</Form.Label>
                                    <Form.Control type='text' name='refferedBy' value={editData?.refferedBy} onChange={handleEditData} required />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='editmostRecentActivity'>
                                    <Form.Label>Relationship Manager</Form.Label>
                                    <Form.Select type='text' name='mostRecentActivity' onChange={handleEditData} value={editData?.mostRecentActivity}>
                                        <option value="">--Select --</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='refferedBy'>
                                    <Form.Label>Most Recent Activity</Form.Label>
                                    <Form.Control type='text' name='recentActivity' onChange={handleEditData} value={editData?.recentActivity} required />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary me-2'>Submit</button>
                            <button className='btn btn-secondary' type='button' onClick={() => { setEditModal(false) }}>Cancel</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={filterModal} onHide={() => { setFilterModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Search - Prospects</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={getSearchProspects} method='post'>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='RM'>
                                    <Form.Label>Relationship Manager</Form.Label>
                                    <ReactSelect onChange={handleRM} isMulti options={[
                                        { value: "Noland", label: "Noland" },
                                        { value: "Freddy", label: "Freddy" },
                                        { value: "Brian", label: "Brian" }
                                    ]} value={RMdata} />
                                    <input type="hidden" name='mostRecentActivity' value={RMdata && RMdata.map((item) => item.value).join(",")} />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='RefferedBy'>
                                    <Form.Label>Reffered By</Form.Label>
                                    <Form.Control type='text' name="referredBy" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className='mb-3' controlId='name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' name="name" />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group className='mb-3' controlId='startDate'>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type='date' name="startDate" />
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group className='mb-3' controlId='endDate'>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type='date' name="endDate" />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary me-2' type='submit'>Search</button>
                            <button className='btn btn-danger me-2' type='button' onClick={reset}>Reset</button>
                            <button className='btn btn-secondary' type='button' onClick={() => { setFilterModal(false) }}>Cancel</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
