import { useContext, useEffect, useState } from 'react'
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import parse from 'html-react-parser';
import Breadcrumb from '../../components/Breadcrumb';
import SliceData from '../../components/SliceData';
import { convertToReadableString, getSortIcon, roundToTwoDecimals } from '../../utils/utils';
import Swal from 'sweetalert2';
import { Pagination } from '../../components/Pagination';
import PutChart from '../../components/PutChart';
import { Form } from 'react-bootstrap';
const columns = [
    {
        "displayName": "Ticker",
        "elementName": "stockNameTicker"
    },
    {
        "displayName": "Current Ticker Price",
        "elementName": "stockPrice"
    },
    {
        "displayName": "Put Strike Price",
        "elementName": "strikePrice"
    },
    {
        "displayName": "Put Price",
        "elementName": "putPrice"
    },
    {
        "displayName": "Expiration Date",
        "elementName": "expirationDate"
    },
    {
        "displayName": "Date To Expire",
        "elementName": "daysExpiration"
    },
    {
        "displayName": "Required If Exercised",
        "elementName": "reqIncrease"
    },
    {
        "displayName": "Break Even",
        "elementName": "breakEven"
    },
    {
        "displayName": "Downside Protection (%)",
        "elementName": "downProtection"
    },
    {
        "displayName": "Leverage Ratio",
        "elementName": "leverageRatio"
    },
    {
        "displayName": "Income Potential of 10 Puts ($)",
        "elementName": "incomePotential"
    },
    {
        "displayName": "Income Per Day",
        "elementName": "incomePerDay"
    },
    {
        "displayName": "Annualized premium",
        "elementName": "annualPremium"
    },
    {
        "displayName": "Rank",
        "elementName": "rank"
    },
    {
        "displayName": "Date",
        "elementName": "lastUpdatedAt"
    },
    {
        "displayName": "Action",
        "elementName": "action"
    }
]
export default function PUTS() {
    const [option, setOption] = useState([]);
    const [tickers, setTickers] = useState([]);
    const [dates, setDates] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const [inputData, setInputData] = useState({
        tickername:"",
        strikeprice: "",
        putprice: "",
        expdate: "",
        addToDate: ""
    })
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [limit, setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [selectedTicker, setSelectedTicker] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [meanData, setMeanData] = useState(false)
    const [meanColumn, setMeanColumn] = useState("putPrice")
    const [chartView, setChartView] = useState(false)
    const [viewBy, setViewBy] = useState("putPrice")
    const [chartData, setChartData] = useState(false)
    const context = useContext(Context)
    const fetchTickersFunc = async () => {
        context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerBigList?metadataName=Tickers_Watchlist&_=1706798577724")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
            setSelectedTicker(fetchTickersRes[0]?.element1)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const fetchDates = async () => {
        try {
            const fetchDates = await fetch("https://jharvis.com/JarvisV2/findAllDatesPut?_=1706850539768")
            const fetchDateRes = await fetchDates.json()
            setDates(fetchDateRes)
            setSelectedDate(fetchDateRes[0])
        }
        catch (e) {
        }
    }
    const findAllPutsByTickerName = async () => {
        if (!selectedTicker) {
            Swal.fire({ title: "Please select ticker first", confirmButtonColor: "var(--primary)" })
            return
        }
        context.setLoaderState(true)
        try {
            const apiCall = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}findAllPutsByTickerName?tickername=${selectedTicker}`)
            const apiCallRes = await apiCall.json()
            setTableData(apiCallRes)
            findMeanPutByTickerName()
        } catch (error) {
            console.log("Error: ", error);
        }
        context.setLoaderState(false)
    }
    const findPutDataByDate = async () => {
        if (!selectedDate) {
            Swal.fire({ title: "Please select date first", confirmButtonColor: "var(--primary)" })
            return
        }
        context.setLoaderState(true)
        try {
            const apiCall = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}findPutDataByDate?date=${selectedDate}`)
            const apiCallRes = await apiCall.json()
            setTableData(apiCallRes)
            setMeanData(false)
        } catch (error) {
            console.log("Error: ", error);
        }
        context.setLoaderState(false)
    }
    const findMeanPutByTickerName = async () => {
        if (!selectedDate || !selectedTicker) {
            Swal.fire({ title: "Please select date & ticker first", confirmButtonColor: "var(--primary)" })
            return
        }
        context.setLoaderState(true)
        try {
            const apiCall = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}findMeanPutByTickerName?tickername=${selectedTicker}&selectColumn=${meanColumn}`)
            const apiCallRes = await apiCall.json()
            setMeanData(apiCallRes)
        } catch (error) {
            console.log("Error: ", error);
        }
        context.setLoaderState(false)
    }
    const handleTicker = (e) => {
        setSelectedTicker(e.target.value)
        console.log("e", e.target.value);
    }
    const handleSelectClick = () => {
        findAllPutsByTickerName()
        if (selectedOption === 'History') {
            findAllPutsByTickerName()
            // handleOpenModal()
        }
    }
    const inputDataHandler = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }
    const formReset = () => {
        setInputData({ ...inputData, putStrikePrice: "", putPrice: "", expirationDate: "", addToDate: "" })
    }
    const addData = () => {
        console.log("inputData",Object.entries(inputData));
        // const hasEmptyValue = Object.values(inputData).some(value => value === "");
        // Object.entries(inputData).forEach(([key, value]) => {
        //     if (value === "") {
        //         key = key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
        //         Swal.fire({title:`The key ${key} has an empty value.`,icon: 'warning',confirmButtonColor:"var(--primary)"});
        //     }
        // });
    }
    const handleClick = () => {

    }
    const options = {
        replace: (elememt) => {
            if (elememt.name === 'a') {
                return (
                    <a onClick={() => { handleClick(elememt.children[0].data) }} href='#'>
                        {parse(elememt.children[0].data)}
                    </a>
                );
            }
        }
    }
    const handleMeanColumn = (e) => {
        setMeanColumn(e.target.value)
    }
    const changeDate = (e) => {
        console.log("Date", e.target.value);
        setSelectedDate(e.target.value)
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
    const getChartData = () => {
        setChartData(tableData)
        setChartView(true)
        console.log("tableData", tableData);
    }
    const handleChart = (e) => {
        setViewBy(e.target.value)
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
        // fetchTickersFunc()
        fetchDates()
    }, [])
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>PUTS
                        </h3>
                    </div>
                    <div className="selection-area my-3">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Select Ticker</label>
                                    <select name="portfolio_name" className='form-select' onChange={handleTicker}>
                                        {tickers.map((item, index) => (
                                            <option key={index} value={item.element1}>
                                                {item.element1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={handleSelectClick}>History</button>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Select Date</label>
                                    <select name="portfolio_name" className='form-select' onChange={changeDate}>
                                        {dates.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={findPutDataByDate}>GO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                    <div className="form-floating">
                        <input type="number" id="putStrikePrice" className="form-control me-2" placeholder='Put Strike Price' value={inputData?.strikeprice} name="strikeprice" onChange={inputDataHandler} />
                        <label htmlFor="putStrikePrice" className="">Put Strike Price</label>
                        </div>
                        <div className="form-floating">
                        <input type="number" className="form-control me-2" placeholder='Put Price' value={inputData?.putprice} name="putprice" onChange={inputDataHandler} />
                        <label htmlFor="" className="form-label">Put Price</label>
                        </div>
                        <div className="form-floating">
                            <input type="date" className="form-control me-2" placeholder='Expiration Date' value={inputData?.expdate} name="expdate" onChange={inputDataHandler} />
                            <label htmlFor="" className="form-label">Expiration Date</label>
                        </div>
                        <div className="form-floating">
                        <input type="date" className="form-control me-2" placeholder='Add To Date' value={inputData?.addToDate} name="addToDate" onChange={inputDataHandler} />
                        <label htmlFor="" className="form-label">Add To Date</label>
                        </div>
                        <button className='btn btn-primary ms-2 me-2' onClick={addData}>Add</button>
                        <button className='btn btn-primary me-2'>Save</button>
                        <button className='btn btn-primary me-2' onClick={formReset}>Reset</button>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className="dt-buttons mb-3 mt-3">
                            {!chartView
                                &&
                                <>
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </>
                            }
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={getChartData}><span>Chart View</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { setChartView(false) }}><span>Grid View</span></button>
                        </div>
                        {!chartView
                            &&
                            <div className="form-group d-flex align-items-center mt-3"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={(filter) => { }} />
                                <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                <select name="limit" className='form-select w-auto' onChange={(changeLimit) => { }} value={limit}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="all">All</option>
                                </select>
                            </div>
                        }
                    </div>
                    {
                        meanData &&
                        <div className=' my-4'>
                            <div className="d-flex align-items-center">
                                <span className='me-2'>Mean View : </span> <select name="selectColumn" className='form-select me-2' style={{ maxWidth: "300px" }} value={meanColumn} onChange={handleMeanColumn}>
                                    <option value="putPrice" selected="">Put Price</option>
                                    <option value="currentTickerPrice">Current Ticker Price</option>
                                    <option value="putStrikePrice">Put Strike Price</option>
                                    <option value="requiredIncrease">Required If Exercised</option>
                                    <option value="leverageRatio">Leverage Ratio</option>
                                    <option value="incomePerDay">Income Per Day</option>
                                    <option value="annualizedPremium">Annualized premium</option>
                                </select>
                                <button className='btn btn-primary' onClick={findAllPutsByTickerName}>Go</button>
                            </div>
                            <div className="table-responsive mt-2">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Ticker</th>
                                            <th>Maximum Value</th>
                                            <th>Mean Value</th>
                                            <th>Minimum Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{meanData?.tickerName}</td>
                                            <td>{roundToTwoDecimals(meanData?.maxValue)}</td>
                                            <td>{roundToTwoDecimals(meanData?.meanValue)}</td>
                                            <td>{roundToTwoDecimals(meanData?.minValue)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                    {
                    !chartView
                    &&
                    <>
<div className="table-responsive mt-2">
                        <table id="example" className="table display">
                            <thead>
                                <tr>
                                    {
                                        columns.map((item, index) => {
                                            <th onClick={() => { handleSort("stockNameTicker") }}>Ticker {getSortIcon("stockNameTicker", sortConfig)}</th>
                                            return <th key={"column-" + index} onClick={() => { handleSort(item.elementName) }}>{item.displayName}{getSortIcon(item.elementName, sortConfig)}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filterData.map((item, index) => (
                                        <tr key={"tr-" + index}>{
                                            columns.map(({ elementName, displayName }, index) => {
                                                return <td key={"td-" + index}>{typeof (item[elementName]) == "string" ? parse(item[elementName], options) : item[elementName]}</td>
                                            })}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                    </>
                    }                    
                    {chartView && chartData &&
                        <><div className="form-group d-flex align-items-center">
                            <label htmlFor="" className='me-2 mb-0 form-label'>Chart View:</label>
                            <select className='form-select' style={{ maxWidth: "300px" }} onChange={handleChart}>
                            <option value="putPrice" selected="">Put Price</option>
					<option value="currentTickerPrice">Current Ticker Price</option>
					<option value="strikePrice">Put Strike Price</option>
					<option value="reqIncrease">Required If Exercised</option>
					<option value="leverageRatio">Leverage Ratio</option>
					<option value="incomePerDay">Income Per Day</option>
					<option value="annualPremium">Annualized premium</option>
                            </select>
                        </div>
                            <PutChart data={chartData} view={viewBy} title={convertToReadableString(viewBy)} />
                        </>}
                </div>
            </div>
        </>
    )
}
