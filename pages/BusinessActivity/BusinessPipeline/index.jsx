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
import StringToHTML from '../../../components/StringToHtml.jsx';
import formatAmount from '../../../components/formatAmount.js';
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
        { "data": "advisorName" }
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
const [byPersonModal,setByPersonModal] = useState(false)
const [personModalData,setPersonModalData] = useState({advisorName:"",totalAmount:0})

    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const fetchData = async () => {
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllBusinessPipeline?_=1710158570127")
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
    const fetchAllAmount = async()=>{
        try {
            const getAllAmount = await fetch("https://jharvis.com/JarvisV2/getAmountsByAdvisor?_=1714645928468")
            const getAllAmountRes = await getAllAmount.json()
            console.log(getAllAmountRes.msg)
            setAllAmountString(getAllAmountRes.msg)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const handleOpenAmount = ()=>{
        setOpenAmountModal(true)
        fetchAllAmount()
    }
    const handleCloseAmount = ()=>{
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
    const totalAmountByPerson = (person)=>{
        const result = Object.values(tableData.reduce((acc, curr) => {
            const { advisorName, amounts } = curr;
            if (!acc[advisorName]) {
              acc[advisorName] = { advisorName, totalAmount: 0 };
            }
            acc[advisorName].totalAmount += parseFloat(amounts ? amounts : 0);
            return acc;
          }, {}));
        setALlAmounts(result)
        console.log(result.filter((item)=>item.advisorName == person))
        setPersonModalData(result.filter((item)=>item.advisorName == person)[0])
        setByPersonModal(true)
    }
    const hideTotalAmountPerson = ()=>{
        setByPersonModal(false)
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
                //
                  // Calculate total amount
                  const total = items.reduce((acc, item) => {
                    return acc + Number(item.amounts);
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
                                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                                        <i className="mdi mdi-home"></i>
                                    </span>Business Pipeline
                                </h3>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                                    <button className="dt-button buttons-html5 btn-primary" type="button" onClick={handleOpen}><span>Add Pipeline</span></button>
                                    <button className="dt-button buttons-html5 btn-primary" type="button" onClick={handleOpenAmount}><span>All Amounts</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                            </div>
                            <div className="table-responsive">
                                <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {columnNames.map((columnName, index) => (
                                                <th key={index} onClick={() => handleSort(columnName.data)}>
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
                                                        if(columnName.data == "advisorName"){
                                                            return <td key={colIndex}><a href="#" onClick={()=>{totalAmountByPerson(content)}}>{content}</a></td>;
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
                                            <td colSpan={11}></td>
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
                    <Form>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>How did the opportunity come about?</Form.Label>
                                    <Form.Select aria-label="Default select example"> 
                                        <option value="">--Select --</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Social_Media">Social Media</option>
                                        <option value="Response_to_our_marketing">Response to our marketing</option>
                                        <option value="Current_Client">Current Client</option>
                                        <option value="LBCA_Investor">LBCA Investor</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>--Select--</option>
                                        <option value="Business has closed (Complete)">Business has closed (Complete)</option>
										<option value="Waiting for Outstanding Items">Waiting for Outstanding Items</option>
										<option value="Upcoming Meeting">Upcoming Meeting</option>	
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Most Recent Activity</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>--Select--</option>
                                        <option value="Meeting/Contact in the last 10 days">Meeting/Contact in the last 10 days</option>
										<option value="Meeting/Contact in the past 11-30 days">Meeting/Contact in the past 11-30 days</option>
										<option value="Meeting scheduled">Meeting scheduled</option>
										<option value="No contact in the past 30 days">No contact in the past 30 days</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date Added</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Follow Up Action</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>--Select--</option>
                                        <option value="Will invest money once the check shows up">Will invest money once the check shows up</option>
										<option value="Closed">Closed</option>
										<option value="Discussed"> Discussed</option>
										<option value="In Review">In Review</option>	
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 form-group radio" controlId='exampleForm.ControlInput2'>
                                    <Form.Label>Auto Funding</Form.Label>
                                    <Form.Check type="radio" label="Yes" name='funding' className='ms-4'/>
                                    <Form.Check type="radio" label="No" name='funding' className='ms-4'/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Investor Lifecycle</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option value="">--Select --</option>
                                        <option value="Creating Wealth">Creating Wealth</option>
                                        <option value="Building Wealth">Building Wealth</option>
                                        <option value="Preserving Wealth">Preserving Wealth</option>
                                    </Form.Select>
                                </Form.Group> 
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Advisor Name</Form.Label>
                                    <Form.Select aria-label="Default select example">
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
                                    <Form.Select aria-label="Default select example">
                                        <option value="">--Select --</option>
                                        <option value="401K_rollover">401K Rollover</option>
                                        <option value="Cash_Bank">Cash Bank</option>
                                        <option value="Def_Comp_Payout">Def Comp Payout</option>
                                        <option value="Life_Insurance">Life Insurance</option>
                                        <option value="Brokerage">Brokerage</option>
                                        <option value="Life_Insurance_with_Long_Term_Care_Riders">Life Insurance with Long Term Care Riders</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Amount ($)</Form.Label>
                                    <Form.Control type="number" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Status Notes</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Most Recent Activity Notes</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Last Contact</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Follow Up Date</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Other Opportunities</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Connections</Form.Label>
                                    <Form.Select aria-label="Default select example">
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
                <StringToHTML htmlString={allAmountString} />
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
        </>
    )
}
