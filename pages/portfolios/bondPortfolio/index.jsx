import Navigation from '../../../components/navigation';
import Sidebar from '../../../components/sidebar';
import { useState, useEffect, useContext } from 'react';
import parse from 'html-react-parser';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../../components/loader';
import { Context } from '../../../contexts/Context';
import { Pagination } from '../../../components/Pagination';
import { calculateAverage, exportToExcel, formatDate, generatePDF, getSortIcon, searchTable } from '../../../utils/utils'
import SliceData from '../../../components/SliceData';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../components/Breadcrumb';
import { Box, TablePagination, TextField } from '@mui/material';
import PortfolioTable from '../../../components/porfolioTable';
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
    const [allBondPortfoilo, setAllBondPortfolio] = useState([])
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
    const [portfolioName, setPortfolioName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStocks,setSelectedStocks] = useState([])
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
            setAllBondPortfolio(allStocksApiRes)
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
    const handlePage2 = async (action) => {
        switch (action) {
            case 'prev':
                setCurrentPage(currentPage2 - 1)
                break;
            case 'next':
                setCurrentPage(currentPage2 + 1)
                break;
            default:
                setCurrentPage(currentPage2)
                break;
        }
    };
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
    const filter2 = (e) => {
        const value = e.target.value;
        setfilteredBondportfolios(searchTable(bondPortfolios, value))
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
                context.setLoaderState(true)
                try {
                    const deleteApi = await fetch(`https://jharvis.com/JarvisV2/deleteBondPortfolioByName?name=${name}&_=${new Date().getTime()}`)
                const deleteApiRes = deleteApi.json()
                console.log("Success",deleteApiRes)
                getAllBondForPolios()
                } catch (error) {
                    console.log("Error",error)
                }
                context.setLoaderState(false)
            }
        })
    }
    const validateStocks = () => {
        const newErrors = {};
        selectedStocks.forEach(stock => {
          if (!stock.share) newErrors[stock.name] = { ...newErrors[stock.name], share: 'Share is required' };
          if (!stock.purchaseDate) newErrors[stock.name] = { ...newErrors[stock.name], purchaseDate: 'Purchase Date is required' };
          if (!stock.purchasePrice) newErrors[stock.name] = { ...newErrors[stock.name], purchasePrice: 'Purchase Price is required' };
        });
        // setErrors(newErrors);
        // return Object.keys(newErrors).length === 0;
        return newErrors;
      };
    const createPortfolio = async()=>{
        const errors = validateStocks();
        if (Object.keys(errors).length > 0) {
          Swal.fire({
            title: 'Validation Errors',
            text: 'Please fill in all required fields for selected symbols.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor:"var(--primary)"
          });
          return;
        }
    
        if (!portfolioName) {
          Swal.fire({
            title: 'Portfolio Name Required',
            text: 'Please enter a portfolio name.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor:"var(--primary)"
          });
          return;
        }
        const url = new URL(`https://jharvis.com/JarvisV2/createBondPortfolio?name=${portfolioName}&visiblePortFolio=yes&userId=2`);
            // const url = new URL("https://jharvis.com/JarvisV2/createBondPortfolio");
            // const params = {
            //     name: portfolioName,
            //     visiblePortFolio: "yes",
            //     userId: 2 // Get userId dynamically if needed
            // };
    
            const formData = new FormData();
            selectedStocks.forEach(stock => {
                const dataString = `${stock.name}~${stock.share}~${stock.purchaseDate}~${stock.purchasePrice}`;
                formData.append("myArray[]", dataString);
            });
            // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            context.setLoaderState(true)
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    // Note: Fetch does not support query parameters directly; add them manually to the URL if needed
                    headers: {
                        // 'Content-Type': 'multipart/form-data' is not needed for FormData; fetch will set the correct headers
                    },
                    // params: params // fetch does not support params directly; append them to URL if needed
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
        
                const data = await response.json();
                setShow(false)
                getAllBondForPolios()
                console.log('Portfolio created successfully:', data);
            } catch (error) {
                console.error('Error creating portfolio:', error);
            }
            context.setLoaderState(false)
    }
    const selectStock = (e,issuerName)=>{
        const isChecked = e.target.checked;

    setSelectedStocks(prevStocks => {
      if (isChecked) {
        // Add stock if checkbox is checked
        console.log("Output",{ name: issuerName, share: "", purchaseDate: "", purchasePrice: "" });
        return [...prevStocks, { name: issuerName, share: "", purchaseDate: "", purchasePrice: "" }];
      } else {
        console.log("Output",prevStocks.filter(stock => stock.name !== issuerName));
        // Remove stock if checkbox is unchecked
        return prevStocks.filter(stock => stock.name !== issuerName);
      }
    });
console.log("issuerName",issuerName,e.target.checked)
    }
    const updateSelectedBond = (e, issuerName) => {
        const { name, value } = e.target;
    
        setSelectedStocks(prevStocks =>
          prevStocks.map(stock =>
            stock.name === issuerName ? { ...stock, [name]: value } : stock
          )
        );
      };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const filteredPortfolio = allBondPortfoilo.filter((row) =>
        row.issuerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const closeEditModal = ()=>{
        setEditModal(false)
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

},[allBondPortfoilo])
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
    <div className="d-flex"> 
            <button className="btn btn-primary mx-2 mb-3 ms-0" onClick={handleShow}>Create New Portfolio</button>
            <button className="btn btn-primary mx-2 mb-3" onClick={()=>{setManageView(false)}}>View Portfolio</button>
    </div>
    <div className='d-flex justify-content-between align-items-center'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={()=>{generatePDF()}}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter2} />
                        <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                            <select name="limit" className='form-select w-auto' onChange={changeLimit2} value={limit}>
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
                                     <th onClick={()=>{handleSort2("name")}}>PortFolio Name {getSortIcon("name",sortConfig2)}</th>
                                     <th onClick={()=>{handleSort2("ticker")}}>Symbol {getSortIcon("ticker",sortConfig2)}</th>
                                     <th className='sticky-action'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                               {
                                filteredBondPortfolios.map((item,index)=>{
                                    return <tr key={"portfolio"+index}><td>{item?.name}</td><td>{item?.ticker}</td><td className='sticky-action'><button className='px-4 btn btn-primary' onClick={()=>{handleEditModal(item?.name)}} title="Edit"><i className="mdi mdi-pen"></i></button><button className='px-4 btn btn-danger' onClick={() => { deleteBondPortFolio(item?.name) }} title="Delete"><i className="mdi mdi-delete"></i></button></td></tr>
                                })
                               }
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={currentPage2} totalItems={bondPortfolios} limit={limit2} setCurrentPage={setCurrentPage2} handlePage={handlePage2} />
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
                                    <input type="text" className="form-control me-3" placeholder='Portfolio Name' name="portfolioName" onChange={(e) => setPortfolioName(e.target.value)}/>
                                    <button className='btn btn-primary text-nowrap' onClick={() => { createPortfolio() }}>Create Portfolio</button>
                                </div>
                            </div>
                            <div className="col-md-6">
                            <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
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
                                        allBondPortfoilo.length > 0 && filteredPortfolio.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                                            const isChecked = selectedStocks.some(stock => stock.name === item?.issuerName);
                                            return <tr key={"stock" + index}><td>
                                                <input type="checkbox" name='stockChkBox' value={item?.idBond} onChange={(e)=>{selectStock(e,item?.issuerName)}} checked={isChecked}/></td>
                                                <td>{item?.issuerName}</td>
                                            <td>
                  <input
                    type="text"
                    value={selectedStocks.find(stock => stock.name === item?.issuerName)?.share || ""}
                    name="share"
                    placeholder="Share"
                    className='form-control'
                    onChange={(e) => updateSelectedBond(e, item?.issuerName)}
                    style={{minWidth:"150px"}}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={selectedStocks.find(stock => stock.name === item?.issuerName)?.purchaseDate || ""}
                    name="purchaseDate"
                    className='form-control'
                    onChange={(e) => updateSelectedBond(e, item?.issuerName)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={selectedStocks.find(stock => stock.name === item?.issuerName)?.purchasePrice || ""}
                    name="purchasePrice"
                    placeholder='Purchase Price'
                    className='form-control'
                    onChange={(e) => updateSelectedBond(e, item?.issuerName)}
                    style={{minWidth:"150px"}}
                  />
                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                        <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        component="div"
                        count={allBondPortfoilo.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                        </Box>
                    </Modal.Body>
                </Modal>
                {/* <Modal show={editModal} onHide={()=>{setEditModal(false)}} className='portfolio-modal'>
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
                                        allBondPortfoilo.length > 0 && allBondPortfoilo.map((item, index) => {
                                            return <tr key={"stock" + index}><td><input type="checkbox" name='stockChkBox' value={item?.stockName} /></td><td>{item?.issuerName}</td><td><input type="text" value={item?.share} name="share" placeholder="Share" className='form-control' onChange={portfolioInputs} /></td><td><input type="date" value={item?.purchaseDate} name="purchaseDate" className='form-control' onChange={portfolioInputs} /></td><td><input type="text" value={item?.purchasePrice} name="purchasePrice" placeholder='Purchase Price' className='form-control' onChange={portfolioInputs} /></td></tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal> */}
                <PortfolioTable url={`${process.env.NEXT_PUBLIC_BASE_URL_V2}getAllBondForPolioByName?name=${editPortfolioName}&_=${new Date().getTime()}`} open={editModal} heading={"Edit Portfolio"} handleCloseModal={closeEditModal} editPortfolioName={editPortfolioName} getAllBondForPolios={getAllBondForPolios}/>
            </div>
        </>
    )
}
