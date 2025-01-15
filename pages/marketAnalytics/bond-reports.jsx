import { useContext, useEffect, useRef, useState } from 'react'
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import parse from 'html-react-parser';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
import { calculateAverage, exportToExcel, fetchWithInterceptor, generatePDF, getSortIcon, searchTable } from '../../utils/utils';
import { Form, Modal, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import BondReportHistoryModal from '../../components/BondReportHistoryModal';
import Breadcrumb from '../../components/Breadcrumb';
const BondReports = () => {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [reportModal, setReportModal] = useState(false)
    const [reportData, setReportData] = useState([])
    const [tickers, setTickers] = useState([]);
    const [selectedTicker, setSelectedTicker] = useState(false)
    const [historyModal, setHistoryModal] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(columnNames.map(col => col.elementInternalName));
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef(null);
    const fetchColumnNames = async () => {
        context.setLoaderState(true)
        try {
            // const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=Debt_Report_Matrices&_=1705582308870")
            const columnApi = await fetchWithInterceptor("/api/proxy?api=getColumns?metaDataName=Debt_Report_Matrices&_=1705582308870", false)
            const columnApiRes = columnApi
            columnApiRes.push(...extraColumns)
            setColumnNames(columnApiRes);
            const defaultCheckedColumns = columnApiRes.map(col => col.elementInternalName);
            setVisibleColumns(defaultCheckedColumns);
            fetchData()
        }
        catch (e) {
            console.log("error", e)
            context.setLoaderState(false)
        }
    }


    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            // const getBonds = await fetch("https://jharvis.com/JarvisV2/getImportsData?metaDataName=Debt_Report_Matrices&_=1705582308871")
            const getBonds = await fetchWithInterceptor("/api/proxy?api=getImportsData?metaDataName=Debt_Report_Matrices&_=1705582308871", false)
            const getBondsRes = getBonds
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
            // setTimeout(() => {
            //     setTableData(getImportsData)
            //     setFilterData(getImportsData)
            // }, 1500)
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }

    const handleClick = (elm) => {
        console.log("element", elm)
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
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
    const options = {
        replace: (elememt) => {
            if (elememt.name === 'a') {
                // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
                return (
                    <a onClick={() => { handleReportData(elememt.children[0].data) }} href='#'>
                        {parse(elememt.children[0].data)}
                    </a>
                );
            }
        }
    }
    const handleReportData = async (name) => {
        context.setLoaderState(true)
        try {
            const fetchReport = await fetchWithInterceptor("/api/proxy?api=getTickerReportsByTickerName?tickerName=" + name, false)
            const fetchReportRes = fetchReport
            setReportData(fetchReportRes)
            setReportModal(true)
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }

    const downloadReport = async (reportName) => {
        context.setLoaderState(true)
        try {
            const fetchReport = await fetchWithInterceptor("/api/proxy?api=downloadTickerReport?fileName=" + reportName, false)
            const fetchReportRes = fetchReport
            window.open(fetchReportRes.responseStr, '_blank')
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const deleteReport = async (reportName) => {
        try {
            Swal.fire({
                title: "Are You sure ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                customClass: { confirmButton: 'btn-danger', }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    context.setLoaderState(true)
                    try {
                        const deleteApi = await fetchWithInterceptor("/api/proxy?api=deletePortfolioByName?name=" + reportName, false)
                        if (deleteApi.ok) {
                            const deleteApiRes = deleteApi
                            Swal.fire({ title: deleteApiRes.msg, confirmButtonColor: "#719B5F" })
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    context.setLoaderState(false)
                } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                }
            })
        }
        catch (e) {

        }
    }
    const fetchTickersFunc = async () => {
        context.setLoaderState(true)
        try {
            // const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1716538528361")
            const fetchTickers = await fetchWithInterceptor("/api/proxy?api=getAllTicker?metadataName=Tickers_Watchlist&_=1716538528361", false)
            const fetchTickersRes = fetchTickers
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const go = async () => {
        if (selectedTicker) {
            context.setLoaderState(true)
            try {
                const Debt_Report_Matrices = await fetchWithInterceptor("/api/proxy?api=getHistoryByTicker?metadataName=Debt_Report_Matrices&ticker=" + selectedTicker, false)                
                const Debt_Report_MatricesRes = Debt_Report_Matrices
                setTableData(Debt_Report_MatricesRes)
            } catch (error) {
                console.log("Error", error);
            }
            context.setLoaderState(false)
        }
        else {
            Swal.fire({ title: "Please select a ticker", text: "", icon: "warning", confirmButtonColor: "var(--primary)" })
        }

    }
    const reset = () => {
        fetchData()
    }
    const history = () => {
        setHistoryModal(true)
        setIsExpanded(false)
    }
    const calculate = () => {

    }
    const uploadFile = async (e) => {
        e.preventDefault()
        const form = e.target
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        context.setLoaderState(true)
        try {
            const formData = new FormData(form);
            const upload = await fetchWithInterceptor("/api/proxy?api=uploadFile",false, {}, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: formData
            })
            const uploadRes = upload
            if (upload.status == 400) {
                Swal.fire({ title: uploadRes?.message, icon: "warning", confirmButtonColor: "var(--primary)" })
            }
            console.log("form", form, upload)
        } catch (error) {
            console.log("Error", error)
        }
        context.setLoaderState(false)
    }
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        if (screen.width < 576) {
            if (isExpanded) {
                let max = 0
                Array.from(contentRef.current.children).map((item) => {
                    if (max < item.getBoundingClientRect().width) {
                        max = item.getBoundingClientRect().width
                    }
                });
                setContentWidth(`${max + 8}px`);
                return
            }
            else {
                setContentWidth(`0px`);
            }
        }
        if (isExpanded) {
            if (contentRef.current) {
                let count = 0
                const totalWidth = Array.from(contentRef.current.children).reduce((acc, child) => {
                    count = count + 6
                    return acc + child.getBoundingClientRect().width;
                }, 0);
                setContentWidth(`${totalWidth + count}px`);
            }
        }
        else {
            if (contentRef.current) {
                const totalWidth = Array.from(contentRef.current.children).reduce((acc, child) => {
                    return acc + child.getBoundingClientRect().width;
                }, 0);
                setContentWidth(`${0}px`);
            }
        }
    }, [isExpanded]);
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
        fetchTickersFunc()
    }, [])
    const extraColumns = [
        {
            "elementId": null,
            "elementName": "Date",
            "elementInternalName": "lastUpdatedAt",
            "elementDisplayName": "Date",
            "elementType": null,
            "metadataName": "Everything_List_New",
            "isAmountField": 0,
            "isUniqueField": 0,
            "isSearchCriteria": 0,
            "isVisibleInDashboard": 0,
            "isCurrencyField": 0
        }
    ];

    const handleColumnToggle = (column) => {
        setVisibleColumns(prevState =>
            prevState.includes(column)
                ? prevState.filter(col => col !== column)
                : [...prevState, column]
        );
    };

    const handleAllCheckToggle = () => {
        if (visibleColumns.length === columnNames.length) {
            setVisibleColumns([]);
        } else {
            const allColumnNames = columnNames.map(col => col.elementInternalName);
            setVisibleColumns(allColumnNames);
        }
    };

    return (
        <>
            <BondReportHistoryModal open={historyModal} handleClose={() => { setHistoryModal(false) }} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <Breadcrumb />
                        <div className={`collapsible-container ${isExpanded ? 'expanded' : ''}`}>
                            <span>{ }</span><button className="main-button ms-2 btn-primary" onClick={toggleExpand}>
                                <i className={isExpanded ? "mdi mdi-chevron-right" : "mdi mdi-chevron-left"}></i>+3 Action
                            </button>
                            <div className="collapsible-content" style={{ maxWidth: "max-content", width: contentWidth }} ref={contentRef}>
                                {/* <button className={`h-100 collapsible-item ${activeView == `Chart View` ? `active` : ''}`} type="button" onClick={()=>{}}><span>Chart View</span></button> */}
                                <button className="h-100  collapsible-item" type="button" title="Calculate" onClick={calculate}><span>Calculate</span></button>
                                <button className="h-100  collapsible-item" type="button" title="History" onClick={history}><span>History</span></button>
                                <button className="h-100  collapsible-item" type="button" title="Reset" onClick={reset}><span>Reset</span></button>
                            </div>
                        </div>
                    </div>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Bond Reports
                        </h3>
                    </div>
                    <div className="selection-area mb-3 mt-2">
                        <Form onSubmit={uploadFile} encType="multipart/form-data">
                            <input type="hidden" name="metaDataName" value="Debt_Report_Matrices" />
                            <div className="d-flex align-items-end flex-wrap">
                                <div className="form-group" style={{ flex: "1" }}>
                                    <label htmlFor="">Select Ticker</label>
                                    <select name="tickerName" className='form-select mb-0' onChange={(e) => { setSelectedTicker(e.target.value) }} required>
                                        <option value={""}>--Select Ticker--</option>
                                        {tickers.map((item, index) => (
                                            <option key={index} value={item?.element1}>
                                                {item?.element1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="actions ps-2">
                                    <button className='btn btn-primary mb-0' type='button' onClick={go}>Go</button>
                                </div>
                                <div className="form-group" style={{ flex: "1", paddingRight: "8px" }}>
                                    <label htmlFor="">Upload File</label>
                                    <input type="file" name="myfile" className='border-1 form-control' required />
                                </div>
                                <div className="actions">
                                    <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                                </div>
                            </div>
                        </Form>
                        {/* <div className="col-md-8">
                                <button className='btn btn-primary' type='button' onClick={go}>Go</button>
                                <button className='btn btn-primary ms-3' type='button' onClick={reset}>Reset</button>
                                <button className='btn btn-primary ms-3' type='button' onClick={history}>History</button>
                                <button className='btn btn-primary ms-3' type='button' onClick={calculate}>Calculate</button>
                            </div> */}
                        {/* <Form onSubmit={uploadFile} encType="multipart/form-data">
                            <input type="hidden" name="metaDataName" value="Debt_Report_Matrices" />
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">Upload File</label>
                                        <input type="file" name="myfile" className='border-1 form-control' required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="actions">
                                        <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                                    </div></div>
                            </div>
                        </Form> */}
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3 d-flex align-items-center">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                            <div className="column-selector">
                                <Dropdown>
                                    <Dropdown.Toggle variant="btn btn-primary mb-0" id="dropdown-basic">
                                        Columns
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        style={{
                                            width: "160px",
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                            overflowX: "hidden",
                                            marginTop: "1px",
                                        }}
                                    >
                                        <Dropdown.Item
                                            as="label"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                                display: "inline-block",
                                                width: "100%",
                                                padding: "6px",
                                                fontWeight: "bold",
                                            }}
                                            className="columns-dropdown-item"
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                checked={visibleColumns.length === columnNames.length}
                                                onChange={handleAllCheckToggle}
                                                label="Select All"
                                                id={`${"bond-reports"}-selectAll`}
                                            />
                                        </Dropdown.Item>
                                        {columnNames.map((column, index) => (
                                            <Dropdown.Item
                                                as="label"
                                                key={index}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    display: "inline-block",
                                                    width: "100%",
                                                    padding: "6px",
                                                }}
                                                className="columns-dropdown-item"
                                            >
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={visibleColumns.includes(column.elementInternalName)}
                                                    onChange={() => handleColumnToggle(column.elementInternalName)}
                                                    label={column.elementDisplayName}
                                                    id={`checkId${column.elementDisplayName}${index}`}
                                                />
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} />
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
                                        visibleColumns.includes(columnName.elementInternalName) && (
                                            <th key={index} onClick={() => handleSort(columnName.elementInternalName)}>{columnName.elementDisplayName} {getSortIcon(columnName.elementInternalName, sortConfig)}</th>
                                        )
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filterData.map((rowData, rowIndex) => (
                                    <tr key={rowIndex} style={{ overflowWrap: 'break-word' }}>
                                        {
                                            columnNames.map((columnName, colIndex) => {
                                                if (!visibleColumns.includes(columnName.elementInternalName)) return null;
                                                let content;

                                                if (columnName.elementInternalName === 'element3') {
                                                    content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                } else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                    content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                } else {
                                                    content = rowData[columnName.elementInternalName];
                                                }

                                                if (typeof (content) == 'string') {
                                                    content = parse(content, options)
                                                }
                                                // return <td key={colIndex}>{parse(JSON.stringify(content),options)}</td>;
                                                return <td key={colIndex}>{content}</td>;
                                            })
                                        }
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
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
            {isExpanded && <div className='backdrop'></div>}
        </>
    )
}

export default BondReports