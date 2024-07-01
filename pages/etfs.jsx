import { useContext, useEffect, useRef, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader';
import { Context } from '../contexts/Context';
import parse from 'html-react-parser';
import { calculateAverage, exportToExcel, formatDate, searchTable } from '../utils/utils';
import { getImportsData } from '../utils/staticData';
import BondsHistoryModal from '../components/BondHstoryModal';
import EtfHistoryModal from '../components/EtfHistoryModal';
import { Pagination } from '../components/Pagination';
import SliceData from '../components/SliceData';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Select from 'react-select'
import { utils } from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { generatePDF } from '../utils/utils';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
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



const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};
const bestFiveStockColumn = {
    "company": "Company",
    "bestMovedStock": "Most Risen Stock",
    "bestMovedBy": "Price Risen By",
    "percentageChangeRise": "% In Rise",
    "bestMoveCurrValue": "Current Price",
    "bestMovePrevValue": "Previous Price"
}
const worstFiveStockColumn = {
    "company": "Company",
    "worstMovedStock": "Most Dropped Stock",
    "worstMovedBy": "Price Dropped By",
    "percentageChangeRise": "% In Drop",
    "worstMoveCurrValue": "Current Price",
    "worstMovePrevValue": "Previous Price"
}
export default function Etfs() {
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
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [tickers, setTickers] = useState(false);
    const [selectedTicker, setSelectedTicker] = useState(false)
    const [chartView, setChartView] = useState(false)
    const [chartHistory, setChartHistory] = useState([])
    const [ViewOptions, setViewOptions] = useState({
        element7: "Price vs 20-day Avg (%)",
        element8: "Price",
        element9: "YTD Return",
        element10: "Dividend Yield",
        element11: "Short as % of Float",
        element16: "Relative Strength",
        element17: "Price/Earnings"
    })
    const [rankingData, setRankingData] = useState(false)
    const [chartData, setChartData] = useState([])
    const [selectedView, setSelectedView] = useState('element7')
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

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

    // https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1705052752517
    const fetchColumnNames = async () => {
        try {
            const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=Everything_List_New")
            const columnApiRes = await columnApi.json()
            columnApiRes.push(...extraColumns)
            setColumnNames(columnApiRes)
        }
        catch (e) {
            console.log("error", e)
        }
    }


    // https://www.jharvis.com/JarvisV2/getImportsData?metaDataName=Bondpricing_Master&_=1705052752518
    const fetchData = async () => {
        try {

            const getBonds = await fetch("https://jharvis.com/JarvisV2/getImportsData?metaDataName=Everything_List_New&_=1705403290395")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)

        }
        catch (e) {
            console.log("error", e)
        }
    }
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const exportPdf = () => {
        if (tableData.length > 0) {
            const doc = new jsPDF();

            autoTable(doc, { html: '#my-table' })

            doc.save('table.pdf')
        }
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
    const handleSelect = (inputs) => {
        let arr = inputs.map((item)=>item.value)
        setSelectedTicker(arr.join(","))
    }
    const fetchTickersFunc = async () => {
        context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Everything_List_New&_=1718886601496")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const charts = async () => {
        if (!selectedTicker) {
            alert("Please Select a ticker")
            return;
        }
        context.setLoaderState(true)
        try {
            const getChartHistrory = await fetch("https://jharvis.com/JarvisV2/getChartForHistoryByTicker?metadataName=Everything_List_New&ticker=" + selectedTicker + "&year=2023&year2=2023&_=1718886601497")
            const getChartHistroryRes = await getChartHistrory.json()
            setChartHistory(getChartHistroryRes)
            setChartView(true)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const etfHome = () => {
        setChartView(false)
        setRankingData(false)
    }
    const data = {
        labels: chartHistory.map(item => formatDate(item.lastUpdatedAt)),
        datasets: [
            {
                label: 'Price AVG',
                data: chartData,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                options: {
                    interaction: {
                        mode: 'index',
                    }
                }
            },
        ],
    };
    const handleChange = (e) => {
        setSelectedView(e.target.value)
    }
    const ranking = async () => {
        context.setLoaderState(true)
        try {
            const rankingApi = await fetch("https://jharvis.com/JarvisV2/getImportHistorySheetCompare?metadataName=Everything_List_New&date1=1900-01-01&date2=1900-01-01&_=1719818279196")
            const rankingApiRes = await rankingApi.json()
            setChartView(false)
            setRankingData(rankingApiRes)
        } catch (error) {

        }
        context.setLoaderState(false)
    }
    useEffect(() => {
        async function run() {
            if (tableData.length > 0) {
                // console.log("tableData",tableData)
                const items = await SliceData(currentPage, limit, tableData);
                // console.log("items",items)
                setFilterData(items)
            }
        }
        run()
    }, [currentPage, tableData])
    useEffect(() => {
        setChartData(chartHistory.map(item => parseFloat(item[selectedView])))
        //console.log("data", [...new Set(chartHistory.map(item => Math.round(item.element7)))])
    }, [chartHistory, selectedView])
    useEffect(() => {
        fetchTickersFunc()
        fetchColumnNames()
        fetchData()
    }, [])
    return (
        <>
            <div>
                <EtfHistoryModal open={openModal} handleClose={handleCloseModal} />
            </div>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>ETFs
                        </h3>
                    </div>
                    <div className="selection-area mb-3 d-flex align-items-center">
                        {/* <select name="" className='form-select mb-0 me-2' style={{ maxWidth: "300px" }} onChange={handleSelect}>
                            <option value="">--Select Ticker--</option>
                            {tickers && tickers.map((item, index) => (
                                <option key={index} value={item.element1}>
                                    {item.element1}
                                </option>
                            ))}
                        </select> */}
                        <Select className='mb-0 me-2 col-md-4' isMulti onChange={handleSelect} style={{ minWidth:"200px", maxWidth: "300px" }} options={
tickers && tickers.map((item, index) => (
     {value:item.element1,label:item.element1} 
))
} />
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (chartView && " active")} type="button" onClick={charts}><span>Chart View</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (!chartView && !rankingData && " active")} type="button" onClick={etfHome}><span>ETF Home</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (!chartView && rankingData && " active")} type="button" onClick={ranking}><span>Ranking</span></button>
                        <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="History" onClick={handleOpenModal}><span>History</span></button>
                    </div>
                    {
                        !chartView && !rankingData &&
                        <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={generatePDF}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={exportToExcel}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                        </div>
                        {!chartView && <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>}
                    </div>
                    }                    
                    {
                        chartView ?
                            <>
                                <div className="form-group d-flex align-items-center">
                                    <label htmlFor="" className='me-2 mb-0 form-label'>Chart View:</label>
                                    <select className='form-select' style={{ maxWidth: "300px" }} onChange={handleChange}>
                                        {
                                            Object.entries(ViewOptions).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            ))
                                        }
                                        {/* <option value="priceAvg" selected="">Price vs 20-day Avg (%)</option>
                                        <option value="price">Price</option>
                                        <option value="ytdReturn">YTD Return</option>
                                        <option value="dividendYield">Dividend Yield</option>
                                        <option value="shortFloat">Short as % of Float</option>
                                        <option value="relativeStrength">Relative Strength</option>
                                        <option value="priceEarning">Price/Earnings</option> */}
                                    </select>
                                    <button className='ms-2 btn btn-primary' onClick={charts}>GO</button>
                                </div>
                                <h3>Chart View For {ViewOptions[selectedView]}</h3>
                                <Line data={data} />
                            </>
                            :
                            rankingData
                                ?
                                <>
                                    <h3 className='mb-3'>Best Five Stocks</h3>
                                    <div className="table-responsive mb-4">
                                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                            <thead>
                                                <tr>
                                                    {Object.entries(bestFiveStockColumn).map(([columnName, displayName]) => (
                                                        <th key={columnName}>{displayName}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rankingData?.bestFiveStocks.map((item, index) => {
                                                    return <tr key={"best"+index}>
                                                        {Object.entries(bestFiveStockColumn).map(([columnName, displayName]) => (
                                                            <td key={item[columnName] + index}>{item[columnName]}</td>
                                                        ))}
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <h3 className='mb-3'>Worst Five Stocks</h3>
                                    <div className="table-responsive mb-4">
                                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                            <thead>
                                                <tr>
                                                    {Object.entries(worstFiveStockColumn).map(([columnName, displayName]) => (
                                                        <th key={columnName}>{displayName}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rankingData?.worstFiveStocks.map((item, index) => {
                                                    return <tr key={"worst"+index}>
                                                        {Object.entries(worstFiveStockColumn).map(([columnName, displayName]) => (
                                                            <td key={item[columnName] + index}>{item[columnName]}</td>
                                                        ))}
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="table-responsive">
                                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                            <thead>
                                                <tr>
                                                    {columnNames.map((columnName, index) => (
                                                        <th key={index}>{columnName.elementDisplayName}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filterData.map((rowData, rowIndex) => (
                                                    <tr key={rowIndex} style={{ overflowWrap: 'break-word' }}>
                                                        {
                                                            columnNames.map((columnName, colIndex) => {
                                                                let content;

                                                                if (columnName.elementInternalName === 'element3') {
                                                                    content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                                } else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                                    content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                                } else {
                                                                    content = rowData[columnName.elementInternalName];
                                                                }

                                                                return <td key={colIndex}>{content}</td>;
                                                            })
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>

                                    </div>
                                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                                </>
                    }

                </div>
            </div>
            <Loader />
        </>
    )
}
