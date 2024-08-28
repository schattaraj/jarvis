import React, { useContext, useEffect, useRef, useState } from 'react'
import Footer from '../../../components/footer';
import Navigation from '../../../components/navigation';
import Sidebar from '../../../components/sidebar';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import parse from 'html-react-parser';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../../components/loader';
import { Context } from '../../../contexts/Context';
import { calculateAverage, calculateAveragePercentage, formatDate, getSortIcon, searchTable } from '../../../utils/utils';
import SliceData from '../../../components/SliceData';
import * as Icon from "react-icons/fa";
import { Pagination } from '../../../components/Pagination';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx'
import Breadcrumb from '../../../components/Breadcrumb';
export default function Portfolio() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [show, setShow] = useState(false);
    const [allStocks, setAllStocks] = useState([])
    const [reportData, setReportData] = useState([])
    const [reportModal, setReportModal] = useState(false)
    const [manageView,setManageView] = useState(false)
    const [stockPortfolios, setStockportfolios] = useState(false)
    const [filteredStockPortfolios,setfilteredStockPortfolios] = useState([])
    const [currentPage2, setCurrentPage2] = useState(1);
    const [sortConfig2, setSortConfig2] = useState({ key: null, direction: null })
    const [limit2, setLimit2] = useState(25)
    const [portfolioPayload, setPortfolioPayload] = useState({
        myArr: [],
        portfolioName: "",
        share: "",
        purchaseDate: "",
        purchasePrice: ""
    })
    const [formData, setFormData] = useState({
        portfolioName: "",
        allStocks: [
            { stockName: "", share: "", purchaseDate: "", purchasePrice: "" }
        ]
    });
    const [countApiCall, setCountApiCall] = useState(0)
    //pagination
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(25)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const tableRef = useRef(null);
    const options = {
        replace: (elememt) => {
            if (elememt.name === 'a') {
                // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
                return (
                    <a onClick={() => { handleClick(elememt.children[0].data) }} href='#'>
                        {parse(elememt.children[0].data)}
                    </a>
                );
            }
        }
    }
    const handleClick = async (name) => {
        setReportModal(true)
        try {
            const fetchReport = await fetch("https://jharvis.com/JarvisV2/getTickerReportsByTickerName?tickerName=" + name)
            const fetchReportRes = await fetchReport.json()
            console.log("fetchReportRes", fetchReportRes)
            setReportData(fetchReportRes)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const fetchColumnNames = async () => {
        try {
            const columnApi = await fetch("https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Tickers_Watchlist&_=170004124669")
            const columnApiRes = await columnApi.json()
            setColumnNames(columnApiRes)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const fetchPortfolioNames = async () => {
        try {
            const portfolioApi = await fetch("https://www.jharvis.com/JarvisV2/getAllPortFolioTicker?userId=2")
            const portfolioApiRes = await portfolioApi.json()
            setPortfolioNames(portfolioApiRes)
            setPortfolioId(portfolioApiRes[0]?.idPortfolio)
            setCountApiCall(countApiCall + 1)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            if (selectedPortfolioId) {
                const getPortfolio = await fetch("https://www.jharvis.com/JarvisV2/getPortFolioStockSet?idPortfolio=" + selectedPortfolioId)
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
    const handleChange = (e) => {
        setPortfolioId(e.target.value)
    }
    const exportPdf = () => {
        if (tableData.length > 0) {
            const doc = new jsPDF();

            autoTable(doc, { html: '#my-table' })

            doc.save('table.pdf')
        }
    }
    const generatePDF = () => {
        const input = document.getElementById('my-table');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Jarvis Ticker for ' + formatDate(new Date()) + '.pdf');
        });
    };
    const exportToExcel = () => {
        // Get table data and convert to a 2D array
        const table = tableRef.current;
        const tableData = [];
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                rowData.push(cell.textContent);
            });
            tableData.push(rowData);
        });

        // Create a new workbook and a new worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(tableData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a binary string representation of the workbook
        const workbookBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        // Convert the binary string to a Blob
        const blob = new Blob([s2ab(workbookBinary)], { type: 'application/octet-stream' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'table_data.xlsx';
        link.click();
        URL.revokeObjectURL(link.href); // Clean up the URL object
    };

    // Helper function to convert a string to an array buffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };
    const getAllStock = async () => {
        context.setLoaderState(true)
        try {
            const allStocksApi = await fetch("https://jharvis.com/JarvisV2/getAllStocksForPolio")
            const allStocksApiRes = await allStocksApi.json()
            setAllStocks(allStocksApiRes)
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }
    const handleClose = () => setShow(false);
    const handleShow = (path) => {
        setShow(true);
    }
    const filter = (e) => {
        console.log('search', e.target.value)
        const value = e.target.value;
        const filtered = tableData.filter(elememt => elememt.element4.toLowerCase().includes(value.toLowerCase()))
        //   const filtered = tableData.map(elememt => {
        //    return elememt['element4'].toLowerCase().includes(value.toLowerCase())
        // columnNames.map((item,index)=>{
        //     // (elememt.element+(index+1)).toLowerCase().includes(value.toLowerCase())
        //     console.log(elememt['element4'].includes(value))
        //      if(elememt['element4'] == value){
        //    return elememt
        //     }

        // }) 
        // });
        // console.log('searchdata', filtered)
        // console.log('tableData', tableData)
        setFilterData(searchTable(tableData, value))
    }
    const downloadReport = async (reportName) => {
        try {
            const fetchReport = await fetch("https://jharvis.com/JarvisV2/downloadTickerReport?fileName=" + reportName)
            const fetchReportRes = await fetchReport.json()
            window.open(fetchReportRes.responseStr, '_blank')
        }
        catch (e) {

        }

    }
    const deleteReport = async (reportName) => {
        try {
            const deleteApi = await fetch("https://jharvis.com/JarvisV2/deletePortfolioByName?name=" + reportName)
            const deleteApiRes = await deleteApi.json()
            alert(deleteApiRes.msg)
        }
        catch (e) {

        }

    }
    const portfolioInputs = (e, index) => {
        // setPortfolioPayload({ ...portfolioPayload, [e.target.name]: e.target.value })
        const { name, value } = e.target;

        if (name === "portfolioName") {
            // Update portfolio name
            setFormData(prevData => ({
                ...prevData,
                portfolioName: value
            }));
        } else {
            const updatedStocks = [...formData.allStocks];

            // Update the specific stock at the given index
            updatedStocks[index] = {
                ...updatedStocks[index],
                [name]: value
            };
    
            // Set the updated array in state
            setFormData(prevData => ({
                ...prevData,
                allStocks: updatedStocks
            }));
        }
    }
    const createPortfolio = async (e) => {
        // console.log("portfolioPayload", portfolioPayload)
        console.log("FormData", formData);

        const stockFormData = new FormData();

        formData.allStocks.forEach((stock, index) => {
            const formattedStock = `${stock.stockName}~${stock.share}~${stock.purchaseDate}~${stock.purchasePrice}`;
            stockFormData.append(`myArray[]`, formattedStock);
        });

        try {
            const response = await fetch(`https://jharvis.com/JarvisV2/createPortfolio?name=${formData.portfolioName}&visiblePortFolio=yes&userId=2`, {
                method: 'POST',
                body: stockFormData
            });
            console.log('response:', response);
            if (response.status == 200) {
                const result = await response.json();
                alert("Portfolio Stock set has been saved");
                handleClose();
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Request failed', error);
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

    const handlePage2 = async (action) => {
        switch (action) {
            case 'prev':
                setCurrentPage2(currentPage2 - 1)
                break;
            case 'next':
                setCurrentPage2(currentPage2 + 1)
                break;
            default:
                setCurrentPage2(currentPage2)
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

    const handleSort2 = (key) => {
        let direction = 'asc';
        if (sortConfig2 && sortConfig2.key === key && sortConfig2.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig2({ key, direction });
    }

    const changeLimit = (e) => {
        setLimit(e.target.value)
    }

    const changeLimit2 = (e)=>{
        setLimit2(e.target.value)
    }

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
                let page = currentPage
                if (dataLimit == "all") {
                    dataLimit = tableData?.length
                    page = 1
                }
                items = await SliceData(page, dataLimit, items);
                setFilterData(items)
            }
        }
        run()
    }, [currentPage, tableData, sortConfig, limit])

    useEffect(() => {
        fetchColumnNames()
        fetchPortfolioNames()
        getAllStock()
    }, [])
    useEffect(() => {
        if (countApiCall == 1) {
            fetchData()
        }
    }, [countApiCall])

    const getAllStockForPolios = async()=>{
        setManageView(true)
        context.setLoaderState(true)
        try {
            const allStockApi = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2+"getAllPortfolio?userId=2&_=1724828770117")
            const allStockApiRes = await allStockApi.json()
            setStockportfolios(allStockApiRes)
        } catch (error) {
            
        }
        context.setLoaderState(false)
    }

    const stockFilterData = () => {
        if (stockPortfolios.length > 0) {
            let items = [...stockPortfolios];
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
            let dataLimit = limit2
            if (dataLimit == "all") {
                dataLimit = items?.length
            }
            const startIndex = (currentPage2 - 1) * dataLimit;
            const endIndex = startIndex + dataLimit;
            items = items.slice(startIndex, endIndex);
            setfilteredStockPortfolios(items);
        }
    }

    useEffect(()=>{
        stockFilterData();
    },[currentPage2, stockPortfolios, sortConfig2, limit2])

    const stockFilter = (e) => {
        const value = e.target.value;
        setfilteredStockPortfolios(searchTable(stockPortfolios, value));
    }

    const deleteStockPortFolio = async (name) => {
        try {
            const response = await fetch(`https://jharvis.com/JarvisV2/deletePortfolioByName?name=${name}&_=1724828770137`);
            console.log('response:', response);
            if (response.status == 200) {
                const result = await response.json();
                alert("Portfolio Stock set has been deleted");
                getAllStockForPolios();
                stockFilterData();
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    }

    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Stock Portfolio
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
                                                return <option value={item?.idPortfolio} key={"name" + index}>{item?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={fetchData}>GO</button>
                                    <button className='btn btn-primary' onClick={getAllStockForPolios}>MANAGE</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={()=>{generatePDF()}}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={()=>{exportToExcel()}}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                        </div>
                        <div className="form-group d-flex align-items-center">
                        <div className="form-group d-flex align-items-center mb-0 me-3">
                                        <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                        <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="all">All</option>
                                        </select>
                                    </div>
                            <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table ref={tableRef} className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                            <thead>
                                <tr>
                                    {
                                        columnNames.length > 0 && columnNames.map((item, index) => {
                                            return <th key={index}  onClick={() => handleSort(item.elementInternalName)}>{item?.elementDisplayName} {getSortIcon(item, sortConfig)}</th>
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
                                                    const percentColumns = ["element31", "element34", "element35", "element7", "element8", "element9", "element11", "element13"]
                                                    if (percentColumns.includes(inner['elementInternalName'], 0)) {
                                                        return <td key={"keyid" + keyid}>{(parse(item[inner['elementInternalName']], options) * 100).toFixed(2)}</td>
                                                    }
                                                    else {
                                                        return <td key={"keyid" + keyid}>{parse(item[inner['elementInternalName']], options)}</td>
                                                    }



                                                })
                                            }
                                        </tr>
                                    })
                                }

                            </tbody>
                            <thead>
                                <tr>
                                    {

                                        filterData.length ? columnNames.map((item, index) => {
                                            if (item.elementInternalName === 'element31') {
                                                return <th key={index}>
                                                    {calculateAveragePercentage(filterData, 'element31')} % <br />
                                                    ({calculateAveragePercentage(tableData, 'element31')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element33') {
                                                return <th key={index}>
                                                    {calculateAverage(filterData, 'element33')} % <br />
                                                    ({calculateAverage(tableData, 'element33')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element34') {
                                                return <th key={index}>
                                                    {calculateAveragePercentage(filterData, 'element34')} % <br />
                                                    ({calculateAveragePercentage(tableData, 'element34')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element35') {
                                                return <th key={index}>
                                                    {calculateAveragePercentage(filterData, 'element35')} % <br />
                                                    ({calculateAveragePercentage(tableData, 'element35')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element9') {
                                                return <th key={index}>
                                                    {calculateAveragePercentage(filterData, 'element9')} % <br />
                                                    ({calculateAveragePercentage(tableData, 'element9')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element11') {
                                                return <th key={index}>
                                                    {calculateAveragePercentage(filterData, 'element11')} % <br />
                                                    ({calculateAveragePercentage(tableData, 'element11')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element12') {
                                                return <th key={index}>
                                                    {calculateAveragePercentage(filterData, 'element12')} % <br />
                                                    ({calculateAveragePercentage(tableData, 'element12')}) %
                                                </th>
                                            }
                                            if (item.elementInternalName === 'element22') {
                                                return <th key={index}>
                                                    {calculateAverage(filterData, 'element22')} % <br />
                                                    ({calculateAverage(tableData, 'element22')}) %
                                                </th>
                                            }
                                            else {
                                                return <th key={index}></th>
                                            }

                                        }) : null
                                    }
                                </tr>
                            </thead>

                        </table>
                    </div>
                    <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />
                    </>
                }
                {
                    manageView &&
                        <div className="manage">
                            <div className="d-flex"> 
                                    <button className="btn btn-primary mx-2 mb-3" onClick={handleShow}>Create New Portfolio</button>
                                    <button className="btn btn-primary mx-2 mb-3" onClick={()=>{setManageView(false)}}>View Portfolio</button>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="dt-buttons mb-3">
                                <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={()=>{generatePDF()}}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center">
                                <div className="form-group d-flex align-items-center mb-0 me-3">
                                        <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                        <select name="limit" className='form-select w-auto' onChange={changeLimit2} value={limit2}>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="all">All</option>
                                        </select>
                                    </div>
                                    <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={stockFilter} />
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
                                filteredStockPortfolios.map((item,index)=>{
                                    return <tr key={"portfolio"+index}><td>{item?.name}</td><td>{item?.ticker}</td><td className='sticky-action'><button className='px-4 btn btn-primary' onClick={()=>{handleEditModal(item?.name)}} title="Edit"><i className="mdi mdi-pen"></i></button><button className='px-4 btn btn-danger' onClick={() => { deleteStockPortFolio(item?.name) }} title="Delete"><i className="mdi mdi-delete"></i></button></td></tr>
                                })
                               }
                            </tbody>
                        </table>
                        </div>
                        <Pagination currentPage={currentPage2} totalItems={stockPortfolios} limit={limit2} setCurrentPage={setCurrentPage2} handlePage={handlePage2} />
                    </div>
                    } 
                </div>
                <Footer />
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
                                            return <tr key={"stock" + index}><td><input type="checkbox" name='stockName' value={item?.stockName} onChange={(e) => portfolioInputs(e, index)} /></td><td>{item?.stockName}</td><td><input type="text" value={item?.share} name="share" placeholder="Share" className='form-control' onChange={(e) => portfolioInputs(e, index)} /></td><td><input type="date" value={item?.purchaseDate} name="purchaseDate" className='form-control' onChange={(e) => portfolioInputs(e, index)} /></td><td><input type="text" value={item?.purchasePrice} name="purchasePrice" placeholder='Purchase Price' className='form-control' onChange={(e) => portfolioInputs(e, index)} /></td></tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal className="report-modal" show={reportModal} onHide={() => { setReportModal(false) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Report Table</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="table-responsive">
                            <table className="table report-table">
                                <thead>
                                    <tr>
                                        <th>Ticker</th>
                                        <th>Company</th>
                                        <th>Description</th>
                                        <th>Report Type</th>
                                        <th>Report Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        reportData.map((item, index) => {
                                            return (<tr key={"report" + index}>
                                                <td>{item?.tickerName}</td>
                                                <td>{item?.companyName}</td>
                                                <td><p style={{ maxWidth: "400px" }} className="text-wrap">{item?.description}</p></td>
                                                <td>{item?.catagoryType}</td>
                                                <td>{item?.reportDate}</td>
                                                <td>
                                                    <button onClick={() => { downloadReport(item?.reportfileDetails) }} className="btn me-2"><img src="/icons/download.svg" alt="" /></button>
                                                    <button onClick={() => { deleteReport(item?.idTickerReports) }} className="btn bg-danger"><img src="/icons/trash-2.svg" alt="" /></button>
                                                </td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-2">Showing {reportData.length} entries</p>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}
