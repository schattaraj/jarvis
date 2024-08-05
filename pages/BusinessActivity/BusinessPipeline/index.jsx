import { useContext, useEffect, useRef, useState } from 'react'
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
import StringToHTML from '../../../components/StringToHtml.jsx';
import formatAmount from '../../../components/formatAmount.js';
import Select from 'react-select'
import Swal from 'sweetalert2';
import PieChart from '../../../components/PieChart.js';
import Link from 'next/link.js';
export default function BusinessPipeline() {
    const [columnNames, setColumnNames] = useState([
        { "data": "name" },
        { "data": "opportunity" },
        { "data": "opportunityComeAbout" },
        { "data": "amounts" },
        { "data": "status" },
        { "data": "mostRecentActivity" },
        { "data": "dateAdded" },
        { "data": "lastContact" },
        { "data": "followUpAction" },
        { "data": "connections" },
        { "data": "autoFinding" },
        { "data": "otherOpportunities" },
        { "data": "investorLifecycle" },
        { "data": "accreditedInvestor" },
        { "data": "advisorName" },
        { "data": "action" }
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
    //
    const [totalAmount, setTotalAmount] = useState(0);
    const [byPersonModal, setByPersonModal] = useState(false)
    const [personModalData, setPersonModalData] = useState({ advisorName: "", totalAmount: 0 })
    const [bPInputs, setBPInputs] = useState({
        "name": "",
        "opportunity": [],
        "opportunityComeAbout": [],
        "amounts": "",
        "status": "",
        "mostRecentActivity": "",
        "dateAdded": "",
        "lastContact": "",
        "followUpAction": "",
        "connections": "",
        "autoFinding": "",
        "otherOpportunities": "",
        "investorLifecycle": "",
        "accreditedInvestor": "",
        "advisorName": "",
        "followUpDate": ""
    })
    const [errors, setErrors] = useState({})
    const [validated, setValidated] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState([])
    const [selectedOpportunityComeAbout, setSelectedOpportunityComeAbout] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [editData, setEditData] = useState({})
    const [filterModal, setFilterModal] = useState(false)
    const [filterInputs, setFilterInputs] = useState({})
    const [analysisModal, setAnalysisModal] = useState(false)
    const [analysisData, setAnalysisData] = useState(false)
    const context = useContext(Context)
    const searchRef = useRef()
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllBusinessPipeline?_=1710158570127")
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
    }
    const handleOpen = () => {
        setOpenModal(true);
    }
    const handleEditModal = (action, id) => {
        if (action == "close") {
            setEditModal(false)
        }
        if (action == "open") {
            setEditModal(true)
            setEditData(tableData.find((x) => x.idBusinessPipelineg == id));
            console.log("id", id, tableData.find((x) => x.idBusinessPipelineg == id))
        }
    }
    const fetchAllAmount = async () => {
        context.setLoaderState(true)
        try {
            const getAllAmount = await fetch("https://jharvis.com/JarvisV2/getAmountsByAdvisor?_=1714645928468")
            const getAllAmountRes = await getAllAmount.json()
            setAllAmountString(getAllAmountRes.msg)
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }
    const handleOpenAmount = () => {
        fetchAllAmount()
        setOpenAmountModal(true)

    }
    const handleCloseAmount = () => {
        setOpenAmountModal(false)
    }
    // function formatAmount(amount) {
    //     // Convert amount to number if it's not already
    //     amount = parseFloat(amount);

    //     // Check if the amount is a valid number
    //     if (isNaN(amount)) {
    //       return "Invalid Amount";
    //     }

    //     // Format the amount with commas and dollar sign
    //     return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    //   }

    // Example usage:
    //const formattedAmount = formatAmount(3700000); // Returns "$3,700,000"
    const totalAmountByPerson = (person) => {
        const result = Object.values(tableData.reduce((acc, curr) => {
            const { advisorName, amounts } = curr;
            if (!acc[advisorName]) {
                acc[advisorName] = { advisorName, totalAmount: 0 };
            }
            acc[advisorName].totalAmount += parseFloat(amounts ? amounts : 0);
            return acc;
        }, {}));
        setALlAmounts(result)
        console.log(result.filter((item) => item.advisorName == person))
        setPersonModalData(result.filter((item) => item.advisorName == person)[0])
        setByPersonModal(true)
    }
    const hideTotalAmountPerson = () => {
        setByPersonModal(false)
    }
    const formInput = (e) => {
        console.log("name", e.target.name)
    }
    const selectOpportunity = (e) => {
        setSelectedOpportunity(e.map((item) => item.value))
    }
    const selecteOpportunityComeAbout = (e) => {
        setSelectedOpportunityComeAbout(e.map((item) => item.value))
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
            setErrors(errors)
            const addPipeline = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "addBusinessPipeline", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonObject)
            })
            const addPipelineRes = await addPipeline.json()
            Swal.fire({
                title: addPipelineRes?.msg,
                // text: "You clicked the button!",
                icon: "success",
                background: "green"
            });
            //alert(addPipelineRes?.msg)
            fetchData()
            setOpenModal(false)
            //console.log("json", jsonObject)
        } catch (error) {
            console.log(error)
        }
        context.setLoaderState(false)
        console.log(e)
    }
    const deleteBusinessPipeline = async (id) => {
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
                    formData.append("idBusinessPipelineg", id)
                    const rowDelete = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "deleteBusinessPipeline", {
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
    const formatOpportunityValue = (value) => {
        let arr;
        if (Array.isArray(value)) {
            arr = value;
        } else {
            arr = value.slice(1, -1).split(',').map(item => item.trim());
        }
        return arr.map(item => ({ value: item, label: item }))
    };
    const editOpportunity = (e) => {
        const updatedObj = {
            ...editData,
            opportunity: e.map((item) => item.value)
        };
        setEditData(updatedObj);
    };
    const editOpportunityComeAbout = (e) => {
        const updatedObj = {
            ...editData,
            opportunityComeAbout: e.map((item) => item.value)
        };
        setEditData(updatedObj);
    }
    const updateBusinessPipeline = async (e) => {
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
            setErrors(errors)
            const updatePipeline = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "editBusinessPipeline", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonObject)
            })
            const updatePipelineRes = await updatePipeline.json()
            Swal.fire({
                title: updatePipelineRes?.msg,
                // text: "You clicked the button!",
                icon: "success",
                confirmButtonColor: "#719B5F"
            });
            fetchData()
            setEditModal(false)
        } catch (error) {
            console.log(error)
        }
        context.setLoaderState(false)
    }
    const handleEditData = (e) => {
        const fieldsToExclude = ["funding"];
        if (!fieldsToExclude.includes(e.target.name)) {
            setEditData({ ...editData, [e.target.name]: e.target.value })
        }
    }
    const handleFilterInputs = (e) => {
        setFilterInputs({ ...filterInputs, [e.target.name]: e.target.value })
    }
    const advisorName = (e) => {
        const result = e.map((item) => item.value).join(',')
        setFilterInputs({ ...filterInputs, searchAdvisorName: result })
    }
    const filterStatus = (e) => {
        const result = e.map((item) => item.value).join(',')
        setFilterInputs({ ...filterInputs, searchStatus: result })
    }
    const filterSearchMostRecentActivity = (e) => {
        const result = e.map((item) => item.value).join(',')
        setFilterInputs({ ...filterInputs, searchMostRecentActivity: result })
    }
    const filterBusinessPipeline = async (e) => {
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
            setErrors(errors)
            const addPipeline = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "getSearchBusinessPipeline?searchAdvisorName=" + jsonObject?.searchAdvisorName + "&searchStatus=" + jsonObject?.searchStatus + "&searchMostRecentActivity=" + jsonObject?.searchMostRecentActivity + "&startDate=" + jsonObject?.startDate + "&endDate=" + jsonObject?.endDate + "&_=1720517072931", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const addPipelineRes = await addPipeline.json()
            if (addPipelineRes?.length == 0) {
                Swal.fire({
                    title: "No data found!",
                    icon: "error",
                    confirmButtonColor: "#719B5F"
                });
            }
            if (addPipelineRes?.length > 0) {
                setTableData(addPipelineRes)
                setFilterData(addPipelineRes)
            }
            searchRef.current.value = ""
        } catch (error) {
            console.log(error)
        }
        context.setLoaderState(false)
        setFilterModal(false)
    }
    const fetchAnalysisData = async () => {
        context.setLoaderState(true)
        try {
            const fetchAnalysis = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "getCountsByOpportunity?_=1720549352011")
            const fetchAnalysisRes = await fetchAnalysis.json()
            setAnalysisModal(true)
            setAnalysisData(fetchAnalysisRes)
        } catch (error) {

        }
        context.setLoaderState(false)
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
                //
                // Calculate total amount
                const total = items.reduce((acc, item) => {
                    return acc + Number(item.amounts);
                }, 0);
                setTotalAmount(total);

            }
        }
        run();
    }, [currentPage, tableData, sortConfig, limit]);
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                        <Link href={"/"}><span className="page-title-icon bg-gradient-primary text-white me-2">
                               <i className="mdi mdi-home"></i>
                            </span></Link>Business Pipeline
                        </h3>
                    </div>
                    <div className='d-md-flex justify-content-between'>
                        <div className="dt-buttons">
                            {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={handleOpen}><span>Add Pipeline</span></button>
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={handleOpenAmount}><span>All Amounts</span></button>
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={() => { setFilterModal(true) }}><span>Filter</span></button>
                            <button className="dt-button buttons-html5 btn-primary mb-3" type="button" onClick={fetchAnalysisData}><span>Analysis</span></button>
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
                                    {columnNames.map((columnName, index) => (
                                        <th key={index} onClick={() => handleSort(columnName.data)} className={columnName.data === "action" ? "sticky-action" : columnName.data == "name" ? "sticky-left" : ""}>
                                            {columnName.data}
                                            {getSortIcon(columnName.data)}
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
                                                if (columnName.data == "name") {
                                                    return <td key={colIndex} className='sticky-left'>{content}</td>;
                                                }
                                                if (columnName.data == "advisorName") {
                                                    return <td key={colIndex}><a href="#" onClick={() => { totalAmountByPerson(content) }}>{content}</a></td>;
                                                }
                                                if (columnName.data == "action") {
                                                    return <td key={colIndex} className="sticky-action">
                                                        <button className='px-4 btn btn-primary' title="Edit" onClick={() => { handleEditModal("open", rowData?.idBusinessPipelineg) }}><i className="mdi mdi-pen"></i></button>
                                                        <button className='px-4 ms-2 btn btn-danger' title='Delete' onClick={() => { deleteBusinessPipeline(rowData?.idBusinessPipelineg) }}><i className="mdi mdi-delete"></i></button>
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
                                    <td colSpan={3}>Total Amount</td>
                                    <td>{formatAmount(totalAmount)}</td>
                                    <td colSpan={12}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
            <Modal show={openModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Pipeline</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitForm}>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" name='name' required />
                                    <Form.Control.Feedback type="invalid">
                                        Name is required
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>How did the opportunity come about?</Form.Label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={selecteOpportunityComeAbout} isMulti options={[
                                        { value: "Seminar", label: "Seminar" },
                                        { value: "Referral", label: "Referral" },
                                        { value: "Social_Media", label: "Social Media" },
                                        { value: "Response_to_our_marketing", label: "Response to our marketing" },
                                        { value: "Current_Client", label: "Current Client" },
                                        { value: "LBCA_Investor", label: "LBCA Investor" }
                                    ]
                                    } required />
                                    <input type="hidden" name="opportunityComeAbout" value={JSON.stringify(selectedOpportunityComeAbout)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select aria-label="Default select example" name='status' isInvalid={!!errors.status} required>
                                        <option value={""}>--Select--</option>
                                        <option value="Business has closed (Complete)">Business has closed (Complete)</option>
                                        <option value="Waiting for Outstanding Items">Waiting for Outstanding Items</option>
                                        <option value="Upcoming Meeting">Upcoming Meeting</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Most Recent Activity</Form.Label>
                                    <Form.Select aria-label="Default select example" name='mostRecentActivity' required>
                                        <option value={""}>--Select--</option>
                                        <option value="Meeting/Contact in the last 10 days">Meeting/Contact in the last 10 days</option>
                                        <option value="Meeting/Contact in the past 11-30 days">Meeting/Contact in the past 11-30 days</option>
                                        <option value="Meeting scheduled">Meeting scheduled</option>
                                        <option value="No contact in the past 30 days">No contact in the past 30 days</option>
                                    </Form.Select>

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date Added</Form.Label>
                                    <Form.Control type="date" name="dateAdded" isInvalid={!!errors.dateAdded} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Follow Up Action</Form.Label>
                                    <Form.Select aria-label="Default select example" name="followUpAction" isInvalid={!!errors.followUpAction} required>
                                        <option>--Select--</option>
                                        <option value="Will invest money once the check shows up">Will invest money once the check shows up</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Discussed"> Discussed</option>
                                        <option value="In Review">In Review</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 form-group radio">
                                    <Form.Label>Auto Funding</Form.Label>
                                    <Form.Check type="radio" id="yesFunding" value="Yes" label="Yes" name='autoFinding' className='ms-4' required />
                                    <Form.Check type="radio" id="noFunding" value="No" label="No" name='autoFinding' className='ms-4' required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Investor Lifecycle</Form.Label>
                                    <Form.Select aria-label="Default select example" name="investorLifecycle" required>
                                        <option value="">--Select --</option>
                                        <option value="Creating Wealth">Creating Wealth</option>
                                        <option value="Building Wealth">Building Wealth</option>
                                        <option value="Preserving Wealth">Preserving Wealth</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <Form.Select aria-label="Default select example" name="advisorName" required>
                                        <option value="">--Select --</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Opportunity</Form.Label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={selectOpportunity} isMulti options={[
                                        { value: "401K_rollover", label: "401K Rollover" },
                                        { value: "Cash_Bank", label: "Cash Bank" },
                                        { value: "Def_Comp_Payout", label: "Def Comp Payout" },
                                        { value: "Life_Insurance", label: "Life Insurance" },
                                        { value: "Brokerage", label: "Brokerage" },
                                        { value: "Life_Insurance_with_Long_Term_Care_Riders", label: "Life Insurance with Long Term Care Riders" }
                                    ]
                                    } required />
                                    <input type="hidden" name="opportunity" value={JSON.stringify(selectedOpportunity)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Amount ($)</Form.Label>
                                    <Form.Control type="number" name='amounts' />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Status Notes</Form.Label>
                                    <Form.Control type="text" name='statusNotes' />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Most Recent Activity Notes</Form.Label>
                                    <Form.Control type="text" name='mostRecentActivity' />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Last Contact</Form.Label>
                                    <Form.Control type="date" name='lastContact' />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Follow Up Date</Form.Label>
                                    <Form.Control type="date" name='followUpDate' />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Other Opportunities</Form.Label>
                                    <Form.Control type="text" name='otherOpportunities' />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Connections</Form.Label>
                                    <Form.Select aria-label="Default select example" name='connections'>
                                        <option value="">--Select --</option>
                                        <option value="Youtube">Youtube</option>
                                        <option value="Jarvis Letter">Jarvis Letter</option>
                                        <option value="LinkedIn"> LinkedIn</option>
                                        <option value="In Review">In Review</option>
                                    </Form.Select>
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
            <Modal show={editModal} onHide={() => { handleEditModal("close") }}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Pipeline</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateBusinessPipeline}>
                        <input type="hidden" name="idBusinessPipelineg" id="editIdBusinessPipelineg" value={editData?.idBusinessPipelineg} />
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" name='name' required value={editData?.name} onChange={handleEditData} />
                                    <Form.Control.Feedback type="invalid">
                                        Name is required
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>How did the opportunity come about?</Form.Label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={editOpportunityComeAbout} isMulti options={[
                                        { value: "Seminar", label: "Seminar" },
                                        { value: "Referral", label: "Referral" },
                                        { value: "Social_Media", label: "Social Media" },
                                        { value: "Response_to_our_marketing", label: "Response to our marketing" },
                                        { value: "Current_Client", label: "Current Client" },
                                        { value: "LBCA_Investor", label: "LBCA Investor" }
                                    ]
                                    }
                                        value={editData?.opportunityComeAbout ? formatOpportunityValue(editData.opportunityComeAbout) : ''}
                                        required />
                                    <input type="hidden" name="opportunityComeAbout" value={typeof (editData?.opportunityComeAbout) == "string" ? editData?.opportunityComeAbout : JSON.stringify(editData?.opportunityComeAbout)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select aria-label="Default select example" name='status' isInvalid={!!errors.status} onChange={handleEditData} value={editData?.status} required>
                                        <option value={""}>--Select--</option>
                                        <option value="Business has closed (Complete)">Business has closed (Complete)</option>
                                        <option value="Waiting for Outstanding Items">Waiting for Outstanding Items</option>
                                        <option value="Upcoming Meeting">Upcoming Meeting</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Most Recent Activity</Form.Label>
                                    <Form.Select aria-label="Default select example" name='mostRecentActivity' value={editData?.mostRecentActivity} onChange={handleEditData} required>
                                        <option value={""}>--Select--</option>
                                        <option value="Meeting/Contact in the last 10 days">Meeting/Contact in the last 10 days</option>
                                        <option value="Meeting/Contact in the past 11-30 days">Meeting/Contact in the past 11-30 days</option>
                                        <option value="Meeting scheduled">Meeting scheduled</option>
                                        <option value="No contact in the past 30 days">No contact in the past 30 days</option>
                                    </Form.Select>

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date Added</Form.Label>
                                    <Form.Control type="date" name="dateAdded" isInvalid={!!errors.dateAdded} onChange={handleEditData} value={editData?.dateAdded} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Follow Up Action</Form.Label>
                                    <Form.Select aria-label="Default select example" name="followUpAction" isInvalid={!!errors.followUpAction} onChange={() => { }} value={editData?.followUpAction} required>
                                        <option>--Select--</option>
                                        <option value="Will invest money once the check shows up">Will invest money once the check shows up</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Discussed"> Discussed</option>
                                        <option value="In Review">In Review</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 form-group radio">
                                    <Form.Label>Auto Funding</Form.Label>
                                    <Form.Check type="radio" value="Yes" id="yes" onChange={handleEditData} label="Yes" name='autoFinding' className='ms-4' required checked={editData?.autoFinding == "Yes" ? true : false} />
                                    <Form.Check type="radio" value="No" id="no" onChange={handleEditData} label="No" name='autoFinding' className='ms-4' required checked={editData?.autoFinding == "No" ? true : false} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Investor Lifecycle</Form.Label>
                                    <Form.Select aria-label="Default select example" name="investorLifecycle" onChange={handleEditData} value={editData?.investorLifecycle} required>
                                        <option value="">--Select --</option>
                                        <option value="Creating Wealth">Creating Wealth</option>
                                        <option value="Building Wealth">Building Wealth</option>
                                        <option value="Preserving Wealth">Preserving Wealth</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <Form.Select aria-label="Default select example" name="advisorName" onChange={handleEditData} value={editData?.advisorName} required>
                                        <option value="">--Select --</option>
                                        <option value="Noland">Noland</option>
                                        <option value="Freddy">Freddy</option>
                                        <option value="Brian">Brian</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Opportunity</Form.Label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={editOpportunity} isMulti options={[
                                        { value: "401K_rollover", label: "401K Rollover" },
                                        { value: "Cash_Bank", label: "Cash Bank" },
                                        { value: "Def_Comp_Payout", label: "Def Comp Payout" },
                                        { value: "Life_Insurance", label: "Life Insurance" },
                                        { value: "Brokerage", label: "Brokerage" },
                                        { value: "Life_Insurance_with_Long_Term_Care_Riders", label: "Life Insurance with Long Term Care Riders" }
                                    ]
                                    }
                                        value={editData?.opportunity ? formatOpportunityValue(editData.opportunity) : ''}
                                        required />
                                    <input type="hidden" name="opportunity" value={typeof (editData.opportunity) == "string" ? editData.opportunity : JSON.stringify(editData.opportunity)} onChange={() => { }} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Amount ($)</Form.Label>
                                    <Form.Control type="number" name='amounts' onChange={handleEditData} value={editData?.amounts} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Status Notes</Form.Label>
                                    <Form.Control type="text" name='statusNotes' onChange={handleEditData} value={editData?.statusNotes} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Most Recent Activity Notes</Form.Label>
                                    <Form.Control type="text" name='mostRecentActivityNotes' onChange={handleEditData} value={editData?.mostRecentActivityNotes} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Last Contact</Form.Label>
                                    <Form.Control type="date" name='lastContact' onChange={handleEditData} value={editData?.lastContact} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Follow Up Date</Form.Label>
                                    <Form.Control type="date" name='followUpDate' onChange={handleEditData} value={editData?.followUpDate} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Other Opportunities</Form.Label>
                                    <Form.Control type="text" name='otherOpportunities' onChange={handleEditData} value={editData?.otherOpportunities} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Connections</Form.Label>
                                    <Form.Select aria-label="Default select example" name='connections' onChange={handleEditData} value={editData?.connections}>
                                        <option value="">--Select --</option>
                                        <option value="Youtube">Youtube</option>
                                        <option value="Jarvis Letter">Jarvis Letter</option>
                                        <option value="LinkedIn"> LinkedIn</option>
                                        <option value="In Review">In Review</option>
                                    </Form.Select>
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
            <Modal show={openAmountModal} onHide={handleCloseAmount}>
                <Modal.Header closeButton>
                    <Modal.Title>All Amounts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        {allAmountString && <StringToHTML htmlString={allAmountString} />}
                        {/* <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            <th>Advisor Name</th>
                                            <th>Total Amount</th>
                                            <th>No. of Opportunities</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                              allAmounts &&  allAmounts.map((item)=>{
                                                    return(
                                                        <tr>
                                                            <td>{item.advisorName}</td>
                                                            <td>{formatAmount(item.totalAmount)}</td>
                                                            <td></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                        </table> */}
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={byPersonModal} onHide={hideTotalAmountPerson}>
                <Modal.Header closeButton>
                    <Modal.Title>Total Amounts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                            <thead>
                                <tr>
                                    <th>Advisor Name</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td>{personModalData.advisorName}</td>
                                    <td>{formatAmount(personModalData.totalAmount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={filterModal} onHide={() => { setFilterModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Business Pipeline</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={filterBusinessPipeline}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="" className='form-label'>Advisor Name</label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={advisorName} isMulti options={[
                                        { value: "Noland", label: "Noland" },
                                        { value: "Freddy", label: "Freddy" },
                                        { value: "Brian", label: "Brian" },
                                    ]
                                    } value={filterInputs?.searchAdvisorName?.split(",")?.filter(item => item.trim() !== "")?.map((item) => { return { value: item, label: item } })} required />
                                    <input type="hidden" name='searchAdvisorName' value={filterInputs?.searchAdvisorName} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="" className='form-label'>Status</label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={filterStatus} isMulti options={[
                                        { value: "Business has closed (Complete)", label: "Business has closed (Complete)" },
                                        { value: "Waiting for Outstanding Items", label: "Waiting for Outstanding Items" },
                                        { value: "Upcoming Meeting", label: "Upcoming Meeting" },
                                    ]
                                    } value={filterInputs?.searchStatus?.split(",")?.filter(item => item.trim() !== "")?.map((item) => { return { value: item, label: item } })} required />
                                    <input type="hidden" name='searchStatus' value={filterInputs?.searchStatus} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="" className='form-label'>Most Recent Activity</label>
                                    <Select className='w-100 mb-0 me-2 col-md-4' onChange={filterSearchMostRecentActivity} isMulti options={[
                                        { value: "Meeting/Contact in the last 10 days", label: "Meeting/Contact in the last 10 days" },
                                        { value: "Meeting/Contact in the past 11-30 days", label: "Meeting/Contact in the past 11-30 days" },
                                        { value: "Meeting scheduled", label: "Meeting scheduled" },
                                        { value: "No contact in the past 30 days", label: "No contact in the past 30 days" },
                                    ]
                                    } value={filterInputs?.searchMostRecentActivity?.split(",")?.filter(item => item.trim() !== "")?.map((item) => { return { value: item, label: item } })} />
                                    <input type="hidden" name='searchMostRecentActivity' value={filterInputs?.searchMostRecentActivity} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className='form-label'>Start Date</label>
                                    <input type="date" className='form-control' name="startDate" value={filterInputs?.startDate} onChange={handleFilterInputs} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className='form-label'>End Date</label>
                                    <input type="date" className='form-control' name="endDate" value={filterInputs?.endDate} onChange={handleFilterInputs} required />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-primary me-2'>Submit</button>
                            <button className='btn btn-secondary' onClick={() => { setFilterModal(false) }}>Cancel</button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={analysisModal} onHide={() => { setAnalysisModal(false) }} className='big-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Analysis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <PieChart data={{
                        labels: Array.isArray(analysisData) && analysisData?.map((item) => item?.name),
                        values: Array.isArray(analysisData) && analysisData?.map((item) => item?.y)
                    }} /> */}
                   {analysisData && <PieChart data={analysisData?.map((item)=>({name:item?.name,y:item?.y}))} />}
                </Modal.Body>
            </Modal>
        </>
    )
}
