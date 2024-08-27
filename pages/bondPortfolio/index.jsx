import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useState, useEffect, useContext } from 'react';
import parse from 'html-react-parser';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import { Pagination } from '../../components/Pagination';
import { calculateAverage, exportToExcel, formatDate, generatePDF, getSortIcon, searchTable } from '../../utils/utils'
import SliceData from '../../components/SliceData';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
export default function BondPortfolio() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState("false")
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [show, setShow] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(25)
    const [limit2, setLimit2] = useState(25)
    const [countApiCall, setCountApiCall] = useState(0)
    const [allStocks, setAllStocks] = useState([])
    const [portfolioPayload, setPortfolioPayload] = useState({
        myArr: [],
        portfolioName: "",
        share: "",
        purchaseDate: "",
        purchasePrice: ""
    })
    const [manageView,setManageView] = useState(false)
    const [bondPortfolios,setBondportfolios] = useState([])
    const [filteredBondPortfolios,setfilteredBondportfolios] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [sortConfig2, setSortConfig2] = useState({ key: null, direction: null })
    const [editModal,setEditModal] = useState(false)
    const [editPortfolioName,setEditPortfolioName] = useState("")
    const options = {
        replace: (elememt) => {
            if (elememt.name === 'a') {
                // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
                return (
                    <a onClick={(e) => { handleClick(e,elememt.children[0].data) }} href='#'>
                        {parse(elememt.children[0].data)}
                    </a>
                );
            }
        }
    }
    
    const handleChange = (e) => {
        setPortfolioId(e.target.value)
    }
    const fetchPortfolioNames = async () => {
        try {
            const portfolioApi = await fetch("https://jharvis.com/JarvisV2/getAllBondPortFolioTicker?userId=2&_=1716292770931")
            const portfolioApiRes = await portfolioApi.json()
            setPortfolioNames(portfolioApiRes)
            setPortfolioId(portfolioApiRes[0]?.idBondPortfolio)
            setCountApiCall(countApiCall + 1)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const fetchColumnNames = async () => {
        try {
            const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1716356733282")
            const columnApiRes = await columnApi.json()
            const extraColumns = [{
                "elementId": null,
                "elementName": "Stock",
                "elementInternalName": "element10",
                "elementDisplayName": "Stock",
                "elementType": null,
                "metadataName": "Bondpricing_Master",
                "isAmountField": 0,
                "isUniqueField": 0,
                "isSearchCriteria": 0,
                "isVisibleInDashboard": 0,
                "isCurrencyField": 0
            },
            {
                "elementId": null,
                "elementName": "Jarvis Rank",
                "elementInternalName": "element11",
                "elementDisplayName": "Jarvis Rank",
                "elementType": null,
                "metadataName": "Bondpricing_Master",
                "isAmountField": 0,
                "isUniqueField": 0,
                "isSearchCriteria": 0,
                "isVisibleInDashboard": 0,
                "isCurrencyField": 0
            },
            {
                "elementId": null,
                "elementName": "Date",
                "elementInternalName": "lastUpdatedAt",
                "elementDisplayName": "Date",
                "elementType": null,
                "metadataName": "Bondpricing_Master",
                "isAmountField": 0,
                "isUniqueField": 0,
                "isSearchCriteria": 0,
                "isVisibleInDashboard": 0,
                "isCurrencyField": 0
            }]
            setColumnNames([...columnApiRes, ...extraColumns])
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            if (selectedPortfolioId) {
                const getPortfolio = await fetch("https://jharvis.com/JarvisV2/getBondPortFolioSet?idPortfolio=" + selectedPortfolioId)
                const getPortfolioRes = await getPortfolio.json()
                setTableData(getPortfolioRes)
                setFilterData(getPortfolioRes)
                const totalItems = getPortfolioRes.length
                setTotalItems(totalItems)
                const items = await SliceData(1, limit, getPortfolioRes);
                setFilterData(items)
                setTotalPages(Math.ceil(totalItems / limit));
            }
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }
    const getAllStock = async () => {
        context.setLoaderState(true)
        try {
            const allStocksApi = await fetch("https://jharvis.com/JarvisV2/getAllBondForPolio?_=1716357445057")
            const allStocksApiRes = await allStocksApi.json()
            setAllStocks(allStocksApiRes)
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }
    const handleShow = () => {
        setShow(true);
    }
    const handleClose = () => setShow(false);
    const portfolioInputs = (e) => {
        setPortfolioPayload({ ...portfolioPayload, [e.target.name]: e.target.value })
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
    const filter = (e) => {
        // console.log('search', e.target.value)
        const value = e.target.value;
        const filtered = tableData.filter(elememt => elememt.element4.toLowerCase().includes(value.toLowerCase()))
        setFilterData(searchTable(tableData, value))
    }
    const handleClick = (e)=>{
        e.preventDefault()
    }
    const changeLimit = (e)=>{
        setLimit(e.target.value)
    }
    const changeLimit2 = (e)=>{
        setLimit2(e.target.value)
    }
    const getAllBondForPolios = async()=>{
        setManageView(true)
        context.setLoaderState(true)
        try {
            const allBondApi = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2+"getAllBondPortfolio?userId=2&_=1721819897846")
            const allBondApiRes = await allBondApi.json()
            setBondportfolios(allBondApiRes)
        } catch (error) {
            
        }
        context.setLoaderState(false)
    }
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const handleSort2 = (key) => {
        let direction = 'asc';
        if (sortConfig2 && sortConfig2.key === key && sortConfig2.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig2({ key, direction });
    }
    const handleEditModal = (name)=>{
        setEditModal(true)
        setEditPortfolioName(name)
    }
    const deleteBondPortFolio = (name)=>{
        Swal.fire({
            title:"Are you sure ?",
            icon:"warning",
            confirmButtonText:"Delete",
            showCancelButton:true,
            customClass: { confirmButton: 'btn-danger'}
        }).then(async (result)=>{
            if (result.isConfirmed) {
                
            }
        })
    }
    useEffect(() => {
        fetchPortfolioNames()
        fetchColumnNames()
        getAllStock()
    }, [])
    useEffect(() => {
        if (countApiCall == 1) {
            fetchData()
        }
    }, [countApiCall])
useEffect(()=>{
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
},[currentPage,tableData,sortConfig,limit])
useEffect(()=>{
    if (bondPortfolios.length > 0) {
        let items = [...bondPortfolios];
        if (sortConfig2 !== null) {
            items.sort((a, b) => {
                if (a[sortConfig2.key] < b[sortConfig2.key]) {
                    return sortConfig2.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig2.key] > b[sortConfig2.key]) {
                    return sortConfig2.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        let dataLimit = limit
        if (dataLimit == "all") {
            dataLimit = items?.length
        }
        const startIndex = (currentPage2 - 1) * dataLimit;
        const endIndex = startIndex + dataLimit;
        items = items.slice(startIndex, endIndex);
        setfilteredBondportfolios(items);
    }
},[currentPage2,bondPortfolios,sortConfig2,limit2])
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
        <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Bond Portfolio
                        </h3>
                    </div>
                    {
                        !manageView
                        &&
                        <>
<div className="selection-area mb-3">
                        <div className="row">

                            <div className="col-md-4">


                                <div className="form-group">
                                    <label htmlFor="">Portfolio Name</label>
                                    <select name="portfolio_name" className='form-select' onChange={handleChange} value={selectedPortfolioId}>
                                        <option>Select Portfolio</option>
                                        {
                                            portfolioNames.length > 0 && portfolioNames.map((item, index) => {
                                                return <option value={item?.idBondPortfolio} key={"name" + index}>{item?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={fetchData}>GO</button>
                                    <button className='btn btn-primary' onClick={getAllBondForPolios}>Manage</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={()=>{generatePDF()}}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={()=>{exportToExcel()}}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
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
                                    {
                                        columnNames.length > 0 && columnNames.map((item, index) => {
                                            return <th key={index} onClick={() => handleSort(item?.elementInternalName)}>{item?.elementName} {getSortIcon(item?.elementInternalName,sortConfig)}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filterData.map((item, index) => {
                                        return <tr key={"tr" + index}>
                                            {
                                                columnNames.map((inner, keyid) => {
                                                    // return <td key={"keyid" + keyid}>{parse(item['element' + (keyid + 1)], options)}</td>
                                                    return <td key={"keyid" + keyid}>{inner['elementInternalName'] == 'lastUpdatedAt' ? formatDate(item['lastUpdatedAt']) : typeof(item['element' + (keyid + 1)]) == "string" ? parse(item['element' + (keyid + 1)],options) : item['element' + (keyid + 1)]}</td>
                                                })
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />
                    </>
                    }
                    {
                        manageView &&
<div className="manage">
    <div className="d-flex justify-content-center"> 
            <button className="btn btn-primary mx-2 mb-3" onClick={handleShow}>CREATE NEW PORTFOLIO</button>
            <button className="btn btn-primary mx-2 mb-3" onClick={()=>{setManageView(false)}}>View PortFolio</button>
    </div>
<div className="table-responsive">
                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                            <thead>
                                <tr>
                                     <th onClick={()=>{handleSort2("name")}}>PortFolio Name {getSortIcon("name",sortConfig2)}</th>
                                     <th onClick={()=>{handleSort2("ticker")}}>Symbol {getSortIcon("ticker",sortConfig2)}</th>
                                     <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                               {
                                filteredBondPortfolios.map((item,index)=>{
                                    return <tr key={"portfolio"+index}><td>{item?.name}</td><td>{item?.ticker}</td><td><button className='px-4 btn btn-primary' onClick={()=>{handleEditModal(item?.name)}} title="Edit"><i className="mdi mdi-pen"></i></button><button className='px-4 btn btn-danger' onClick={() => { deleteBondPortFolio(item?.name) }} title="Delete"><i className="mdi mdi-delete"></i></button></td></tr>
                                })
                               }
                            </tbody>
                        </table>
                    </div>
                    </div>
                    }                    
                </div>
                <Modal show={show} onHide={handleClose} className='portfolio-modal'>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Portfolio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group d-flex">
                                    <input type="text" className="form-control me-3" placeholder='Portfolio Name' name="portfolioName" onChange={portfolioInputs} />
                                    <button className='btn btn-primary text-nowrap' onClick={() => { createPortfolio() }}>Create Portfolio</button>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Symbol</th>
                                        <th>Share</th>
                                        <th>Purchase Date</th>
                                        <th>Purchase Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allStocks.length > 0 && allStocks.map((item, index) => {
                                            return <tr key={"stock" + index}><td><input type="checkbox" name='stockChkBox' value={item?.stockName} /></td><td>{item?.issuerName}</td><td><input type="text" value={item?.share} name="share" placeholder="Share" className='form-control' onChange={portfolioInputs} /></td><td><input type="date" value={item?.purchaseDate} name="purchaseDate" className='form-control' onChange={portfolioInputs} /></td><td><input type="text" value={item?.purchasePrice} name="purchasePrice" placeholder='Purchase Price' className='form-control' onChange={portfolioInputs} /></td></tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={editModal} onHide={()=>{setEditModal(false)}} className='portfolio-modal'>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Portfolio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group d-flex">
                                    <input type="text" className="form-control me-3" placeholder='Portfolio Name' name="portfolioName" value={editPortfolioName} readOnly />
                                    <button className='btn btn-primary text-nowrap' onClick={() => { }}>Edit Portfolio</button>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Symbol</th>
                                        <th>Share</th>
                                        <th>Purchase Date</th>
                                        <th>Purchase Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allStocks.length > 0 && allStocks.map((item, index) => {
                                            return <tr key={"stock" + index}><td><input type="checkbox" name='stockChkBox' value={item?.stockName} /></td><td>{item?.issuerName}</td><td><input type="text" value={item?.share} name="share" placeholder="Share" className='form-control' onChange={portfolioInputs} /></td><td><input type="date" value={item?.purchaseDate} name="purchaseDate" className='form-control' onChange={portfolioInputs} /></td><td><input type="text" value={item?.purchasePrice} name="purchasePrice" placeholder='Purchase Price' className='form-control' onChange={portfolioInputs} /></td></tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}
