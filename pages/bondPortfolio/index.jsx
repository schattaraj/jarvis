import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useState, useEffect, useContext } from 'react';
import parse from 'html-react-parser';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import { Pagination } from '../../components/Pagination';
import { calculateAverage, searchTable } from '../../utils/utils'
export default function BondPortfolio() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [show, setShow] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(25)
    const [countApiCall, setCountApiCall] = useState(0)
    const [allStocks, setAllStocks] = useState([])
    const [portfolioPayload, setPortfolioPayload] = useState({
        myArr: [],
        portfolioName: "",
        share: "",
        purchaseDate: "",
        purchasePrice: ""
    })
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

    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Bond Portfolio
                        </h3>
                    </div>
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
                                    <button className='btn btn-primary' onClick={handleShow}>CREATE PORTFOLIO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
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
                                                    // return <td key={"keyid" + keyid}>{parse(item['element' + (keyid + 1)], options)}</td>
                                                    return <td key={"keyid" + keyid}>{inner['elementInternalName'] == 'lastUpdatedAt' ? item['lastUpdatedAt'] : item['element' + (keyid + 1)]}</td>
                                                })
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />
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
            </div>
        </>
    )
}
