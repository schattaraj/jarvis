import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import parse from 'html-react-parser';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import { calculateAverage, searchTable } from '../../utils/utils';
import SliceData from '../../components/SliceData';
import * as Icon from "react-icons/fa";
import { Pagination } from '../../components/Pagination';
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
    const [portfolioPayload, setPortfolioPayload] = useState({
        myArr: [],
        portfolioName: "",
        share: "",
        purchaseDate: "",
        purchasePrice: ""
    })
    const [countApiCall,setCountApiCall] = useState(0)
    //pagination
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit,setLimit] = useState(25)

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
            setCountApiCall(countApiCall+1)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const fetchData = async () => {
        try {
            if (selectedPortfolioId) {
                const getPortfolio = await fetch("https://www.jharvis.com/JarvisV2/getPortFolioStockSet?idPortfolio=" + selectedPortfolioId)
                const getPortfolioRes = await getPortfolio.json()
                setTableData(getPortfolioRes)
                setFilterData(getPortfolioRes) 
                const totalItems = getPortfolioRes.length
                setTotalItems(totalItems)
                const items = await SliceData(1, limit,getPortfolioRes);
                setFilterData(items) 
                setTotalPages(Math.ceil(totalItems / limit)); 
            }
        }
        catch (e) {
            console.log("error", e)
        }
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
    const portfolioInputs = (e) => {
        setPortfolioPayload({ ...portfolioPayload, [e.target.name]: e.target.value })
    }
    const createPortfolio = () => {
        console.log("portfolioPayload", portfolioPayload)
    }
      const handlePage = async(action) => {
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

      useEffect(()=>{
        async function run(){
            if(tableData.length > 0){
                // console.log("tableData",tableData)
                const items = await SliceData(currentPage, limit, tableData);
                // console.log("items",items)
                setFilterData(items)
            }     
        }
        run() 
      },[currentPage])

    useEffect(() => {
        fetchColumnNames()
        fetchPortfolioNames()
        getAllStock()
    }, [])
    useEffect(() => {
if(countApiCall == 1){
    fetchData()
}
    }, [countApiCall])

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
                                    </span>Portfolio
                                </h3>
                            </div>
                            <div className="selection-area mb-3">
                                <div className="row">

                                    <div className="col-md-4">


                                        <div className="form-group">
                                            <label htmlFor="">Portfolio Name</label>
                                            <select name="portfolio_name" className='form-select' onChange={handleChange}>
                                                <option>Select Portfolio</option>
                                                {
                                                    portfolioNames.length > 0 && portfolioNames.map((item, index) => {
                                                        return <option value={item?.idPortfolio} key={"name" + index} selected={item?.idPortfolio == selectedPortfolioId && true}>{item?.name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="actions">
                                            <button className='btn btn-primary' onClick={fetchData}>GO</button>
                                            <button className='btn btn-primary' onClick={handleShow}>CREATE PORTFOLIO</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                            </div>
                            <div className="table-responsive">
                                <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {
                                                columnNames.length > 0 && columnNames.map((item, index) => {
                                                    return <th key={index}>{item?.elementName}</th>
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
                                                            return <td key={"keyid" + keyid}>{parse(item['element' + (keyid + 1)], options)}</td>
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
                                                    if (item.elementInternalName === 'element3') {
                                                        return <th key={index}>
                                                            {calculateAverage(filterData, 'element3')} % <br />
                                                            ({calculateAverage(tableData, 'element3')}) %
                                                        </th>



                                                    } else {
                                                        return <th key={index}></th>
                                                    }

                                                }) : null
                                            }
                                        </tr>
                                    </thead>

                                </table>
                            </div> 
      <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage}/>
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
                                                    return <tr key={"stock" + index}><td><input type="checkbox" name='stockChkBox' value={item?.stockName} /></td><td>{item?.stockName}</td><td><input type="text" value={item?.share} name="share" placeholder="Share" className='form-control' onChange={portfolioInputs} /></td><td><input type="date" value={item?.purchaseDate} name="purchaseDate" className='form-control' onChange={portfolioInputs} /></td><td><input type="text" value={item?.purchasePrice} name="purchasePrice" placeholder='Purchase Price' className='form-control' onChange={portfolioInputs} /></td></tr>
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
                </div>
            </div >
            <Loader />
        </>
    )
}
