import { useContext, useEffect, useState } from 'react'
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import parse from 'html-react-parser';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tickersData } from '../../utils/staticData'
import Select from 'react-select'
import { convertToReadableString, exportToExcel, fetchWithInterceptor, formatDate, generatePDF, getSortIcon, jsonToFormData, mmddyy, roundToTwoDecimals, searchTable } from '../../utils/utils';
import SliceData from '../../components/SliceData';
import CallChart from '../../components/CallChart';
import Swal from 'sweetalert2';
import { Pagination } from '../../components/Pagination';
import Breadcrumb from '../../components/Breadcrumb';
export default function Calls() {
    const [option, setOption] = useState([]);
    const [tickers, setTickers] = useState(tickersData);
    const [dates, setDates] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const [expirationDate, setExpiration] = useState();
    const [addToDate, setAddToDate] = useState();
    const [meanCalls, setMeanCalls] = useState(false)
    const [selectedTicker, setSelectedTicker] = useState('')
    const [selectedDate, setSelectedDate] = useState("")

    const [filteredToDates, setFilteredToDates] = useState([]);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');

    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [limit, setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [chartView, setChartView] = useState(false)
    const [chartData, setChartData] = useState(false)
    const [viewBy, setViewBy] = useState("callPrice")
    const [meanColumn, setMeanColumn] = useState("callPrice")
    const [inputData, setInputData] = useState({
        tickername: "",
        strikeprice: "",
        callprice: "",
        expdate: "",
        addToDate: ""
    })
    const [calculateData, setCalculateData] = useState([])
    const [isFirstSubmission,setIsFirstSubmission] = useState(true)
    const context = useContext(Context)
    const fetchTickersFunc = async () => {
        try {
            // const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerBigList?metadataName=Tickers_Watchlist&_=1706798577724")
            const fetchTickers = await fetchWithInterceptor("/api/proxy?api=getAllTickerBigList?metadataName=Tickers_Watchlist&_=1706798577724", false)
            const fetchTickersRes = fetchTickers
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
    }
    const fetchDates = async () => {
        context.setLoaderState(true)
        try {
            // const fetchDates = await fetch("https://jharvis.com/JarvisV2/findAllDates?_=1706798577725")
            const fetchDates = await fetchWithInterceptor("/api/proxy?api=findAllDates?_=1706798577725", false)
            const fetchDateRes = fetchDates
            setDates(fetchDateRes)
            setFilteredToDates(fetchDateRes);
        }
        catch (e) {
            context.setLoaderState(false)
        }
        context.setLoaderState(false)
    }
    const fetchHistoryFuc = async () => {
        formReset()
        setCalculateData([])
        setTableData([])
        setIsFirstSubmission(true)
        if (!selectedTicker) {
            Swal.fire({ title: "Please select ticker first", confirmButtonColor: "var(--primary)" })
            return
        }
        context.setLoaderState(true)
        try {
            const fetchHistory = await fetchWithInterceptor(`/api/proxy?api=findAllCallsByTickerName?tickername=${selectedTicker}`, false)
            const fetchHistoryRes = fetchHistory
            if(fetchHistoryRes?.length == 0){
                Swal.fire({title:"No Data Available for this Ticker",icon:"warning",confirmButtonColor:"var(--primary)"})
            }
            setTableData(fetchHistoryRes)
            fetchMeanCalls()
        }
        catch (e) {
            context.setLoaderState(false)
        }
        context.setLoaderState(false)
    }
    const fetchMeanCalls = async () => {
        context.setLoaderState(true)
        try {
            const fetchHistory = await fetchWithInterceptor("/api/proxy?api=findMeanCalls?tickername=" + `${selectedTicker}&selectColumn=${meanColumn}`, false)
            const fetchHistoryRes =  fetchHistory
            setMeanCalls(fetchHistoryRes)
        }
        catch (e) {
            context.setLoaderState(false)
        }
        context.setLoaderState(false)
    }
    const fetchByDateFunc = async () => {
        if(!selectedFromDate){
            Swal.fire({ title: "From date is not selected", icon: "warning", confirmButtonColor: "var(--primary)" })
            return
        }
        if(!selectedToDate){
            Swal.fire({title: "To Date is not selected", icon: "warning", confirmButtonColor: "var(--primary)" })
            return
        }
        if (new Date(selectedToDate) < new Date(selectedFromDate)) {
            Swal.fire({ title: "To date must be greater than From date", icon: "warning", confirmButtonColor: "var(--primary)" });
            return;
        }
        context.setLoaderState(true)
        try {
            // const fetchByDate = await fetch(`https://www.jharvis.com/JarvisV2/findCallFromDataToDate?startDate=${selectedFromDate}&endDate=${selectedToDate}`)
            const fetchByDate = await fetchWithInterceptor(`/api/proxy?api=findCallFromDataToDate?startDate=${selectedFromDate}&endDate=${selectedToDate}`, false)
            const fetchByDateRes = fetchByDate
            console.log("fetchByDateRes",fetchByDateRes);
            setCurrentPage(1)
            setTableData(fetchByDateRes)
            
        } catch (error) {
            context.setLoaderState(false)
        }
        finally{
            context.setLoaderState(false)  
        }
        // let date = ""
        // context.setLoaderState(true)
        // try {
        //     const fetchByDate = await fetch("https://jharvis.com/JarvisV2/findCallDataByDate?date=" + date)
        //     const fetchByDateRes = await fetchByDate.json()

        //     let filteredData = fetchByDateRes;
        //     if (selectedFromDate && selectedToDate) {
        //         filteredData = fetchByDateRes.filter(item => {
        //             const lastUpdatedAt = new Date(item.lastUpdatedAt);
        //             return lastUpdatedAt>=new Date(selectedFromDate) && lastUpdatedAt <= new Date(selectedToDate);
        //         });
        //     }else if(selectedFromDate){
        //         filteredData = fetchByDateRes.filter(item => {
        //             const lastUpdatedAt = new Date(item.lastUpdatedAt);
        //             return lastUpdatedAt>=new Date(selectedFromDate);
        //         });
        //     }else if(selectedToDate){
        //         filteredData = fetchByDateRes.filter(item => {
        //             const lastUpdatedAt = new Date(item.lastUpdatedAt);
        //             return lastUpdatedAt<=new Date(selectedToDate);
        //         });
        //     }
    
        //     setTableData(filteredData);
        // }
        // catch (e) {
        //     context.setLoaderState(false)
        // }
        context.setLoaderState(false)
    }
    const handleChange = (e) => {
        setSelectedTicker(e.value)
        setInputData({ ...inputData, tickername: e.value })
    }
    const changeDate = (e) => {
        setSelectedDate(e.target.value)
    }

    const changeFromDate = (event) => {
        setSelectedFromDate(event.target.value);
        if(!event.target.value){
            setFilteredToDates(dates);
        }else{
            // Filter "to" dates to include only dates >= selected "from" date
            const filtered = dates.filter(date => new Date(date) >= new Date(event.target.value));
            setFilteredToDates(filtered);
        }

    };
    const changeToDate = (event) => {
        setSelectedToDate(event.target.value);
    };

    const handleClick = () => {

    }
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
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
    const handleSort = (key) => {
        console.log("KEY", key)
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const findCallDataByDate = async () => {
        if (!selectedFromDate) {
            Swal.fire({ title: "Please select date", icon: "warning", confirmButtonColor: "var(--primary)" })
        }
        if (selectedFromDate) {
            context.setLoaderState(true)
            try {
                const fetchData = await fetchWithInterceptor("/api/proxy?api=findCallDataByDate?date=" + selectedFromDate + "&_=1721911430743", false)
                const fetchDataRes =  fetchData
                setChartData(fetchDataRes)
            } catch (error) {

            }
            setChartView(true)
            context.setLoaderState(false)
        }
    }
    const handleChart = (e) => {
        setViewBy(e.target.value)
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
    const handleMeanColumn = (e) => {
        setMeanColumn(e.target.value)
    }
    const inputDataHandler = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })

    }
    const addData = async () => {
        for (const [key, value] of Object.entries(inputData)) {
            if (value === "") {
                // Specific warning for 'tickername'
                if (key === "tickername") {
                    Swal.fire({
                        title: `Please select Ticker`,
                        icon: 'warning',
                        confirmButtonColor: "var(--primary)"
                    });
                    return;
                }

                // Format the key for the warning message
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
                Swal.fire({
                    title: `The key ${formattedKey} has an empty value.`,
                    icon: 'warning',
                    confirmButtonColor: "var(--primary)"
                });
                return;
            }
        }
        const inputObj = {...inputData}
        inputObj.addToDate = mmddyy(inputObj.addToDate)
        inputObj.expdate = mmddyy(inputObj.expdate)
        const formData = jsonToFormData(inputObj);
        try {
            context.setLoaderState(true)
            // Send the FormData to your API
            const response = await fetchWithInterceptor(`/api/proxy?api=getCalculatedData`,true, null, {
                method: 'POST',
                body: formData,
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = response
            console.log("API Response", result);    
            // Update the state based on whether it's the first submission
            if (isFirstSubmission) {
                setTableData([result]); // Clear and set new data on first submission
                setCalculateData([result]); // Clear and set new data on first submission
                setIsFirstSubmission(false); // Set the flag to false after first submission
            } else {
                let prev = tableData
            setTableData([...prev, result]);
            let prevData = calculateData
            setCalculateData([...prevData, result])
            }
            context.setLoaderState(false)
            // Handle success (e.g., show a success message)
            Swal.fire({
                title: `Data submitted successfully!`,
                icon: 'success',
                confirmButtonColor: "var(--primary)"
            });
        } catch (error) {
            context.setLoaderState(false)
            console.error("Error submitting data:", error);
            Swal.fire({
                title: `Error submitting data: ${error.message}`,
                icon: 'error',
                confirmButtonColor: "var(--primary)"
            });
        }
    }
    const saveData = async () => {
        console.log("save", calculateData);
        if (calculateData.length < 1) {
            Swal.fire({
                title: `Please add data first`,
                icon: 'warning',
                confirmButtonColor: "var(--primary)"
            });
            return
        }
        try {
            context.setLoaderState(true)
            // Send the FormData to your API
            const response = await fetchWithInterceptor(`/api/proxy?api=saveCalls`, true, null, {
                method: 'POST',
                body: JSON.stringify(calculateData),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = response
            context.setLoaderState(true)
        }
        catch (error) {
            context.setLoaderState(false)
            console.error("Error submitting data:", error);
            Swal.fire({
                title: `Error submitting data: ${error.message}`,
                icon: 'error',
                confirmButtonColor: "var(--primary)"
            });
        }
    }
    const formReset = () => {
        setInputData({ ...inputData, strikeprice: "", callprice: "", expdate: "", addToDate: "" })
    }
    const deleteCall = async (id) => {
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
                    const rowDelete = await fetchWithInterceptor(`https://jharvis.com/JarvisV2/deleteCallBy?tickerid=${id}`, false)
                    if (rowDelete.ok) {
                        const rowDeleteRes = rowDelete
                        Swal.fire({
                            title: rowDeleteRes?.msg,
                            icon: "success",
                            confirmButtonColor: "#719B5F"
                        })
                        fetchByDateFunc()

                    }
                } catch (error) {
                    console.log(error)
                }
                context.setLoaderState(false)
            }
        })
    }
    useEffect(() => {
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
            items = SliceData(page, dataLimit, items);
            setFilterData(items)
        }
    }, [tableData, sortConfig, limit,currentPage])
    useEffect(() => {
        fetchTickersFunc()
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
                            </span>CALLS
                        </h3>
                    </div>
                    <div className="selection-area my-3">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Select Ticker</label>
                                    <Select className='mb-0 me-2' value={selectedTicker && selectedTicker.split(",").map((item) => ({ value: item, label: item }))} onChange={handleChange} style={{ minWidth: "200px", maxWidth: "300px", width: "100%", flex: "2" }} options={
                                        tickers ? tickers.map((item, index) => (
                                            { value: item.element1, label: item.element1 }
                                        ))
                                            : [{ value: "Loading", label: "Loading..." }]
                                    } />
                                    {/* <select name="portfolio_name" className='form-select' onChange={handleChange}>
                                        <option value="">--Select Ticker--</option>
                                        {tickers.map((item, index) => (
                                            <option key={index} value={item.element1}>
                                                {item.element1}
                                            </option>
                                        ))}
                                    </select> */}
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={fetchHistoryFuc}>History</button>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Select Date</label>
                                    <div className="input-group gap-2">
                                        <select name='portfolio_name_from' className="form-select portfolio-name" id="inputGroupSelect02" onChange={changeFromDate}>
                                            <option value="">--From--</option>
                                            {dates.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                        </select>
                                        
                                            <select name='portfolio_name_to' className="form-select" id="inputGroupSelect02" onChange={changeToDate}>
                                            <option value="">--To--</option>
                                            {filteredToDates.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    {/* <select name="portfolio_name" className='form-select' onChange={changeDate}>
                                        <option value="">--Select Date--</option>
                                        {dates.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select> */}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={fetchByDateFunc}>GO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <div className="form-floating">
                            <input type="number" id="strikeprice" className="form-control me-2" placeholder='Call Strike Price' value={inputData?.strikeprice} name="strikeprice" onChange={inputDataHandler} />
                            <label htmlFor="strikeprice" className="">Call Strike Price</label>
                        </div>
                        <div className="form-floating">
                            <input type="number" className="form-control me-2" placeholder='Call Price' value={inputData?.callprice} name="callprice" onChange={inputDataHandler} />
                            <label htmlFor="" className="form-label">Call Price</label>
                        </div>

                        {/* <input type="date" className="form-control me-2" placeholder='Expiration Date'/> */}
                        {/* <DatePicker className="form-control"
                            // onChange={(date) => setExpiration(date)}
                            placeholderText="Expiration Date"
                            value={inputData?.expdate} name="expdate" onChange={inputDataHandler}
                        /> */}
                        <div className="form-floating">
                            <input type="date" className="form-control me-2" placeholder='Expiration Date' value={inputData?.expdate} name="expdate" onChange={inputDataHandler} />
                            <label htmlFor="" className="form-label">Expiration Date</label>
                        </div>
                        <div className="form-floating">
                            <input type="date" className="form-control me-2" placeholder='Add To Date' value={inputData?.addToDate} name="addToDate" onChange={inputDataHandler} />
                            <label htmlFor="" className="form-label">Add To Date</label>
                        </div>
                        {/* <DatePicker className="form-control"
                            // onChange={(date) => setAddToDate(date)}
                            placeholderText="Add To Date"
                            value={inputData?.addToDate} name="addToDate" onChange={inputDataHandler}
                        /> */}
                        {/* <input type="text" className="form-control me-2" placeholder='Add To Date'/> */}
                        <button className='btn btn-primary ms-2 me-2' onClick={addData}>Add</button>
                        <button className='btn btn-primary me-2' onClick={saveData}>Save</button>
                        <button className='btn btn-primary me-2' onClick={formReset}>Reset</button>
                        {/* <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button"><span>Create New Rule</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span>View All Rule</span></button>
                                </div> */}
                    </div>
                    {
                        meanCalls &&
                        <div className=' my-4'>
                            <div className="d-flex align-items-center">
                                <span className='me-2'>Mean View : </span> <select name="selectColumn" className='form-select me-2' style={{ maxWidth: "300px" }} value={meanColumn} onChange={handleMeanColumn}>
                                    <option value="callPrice">Call Price</option>
                                    <option value="currentTickerPrice">Current Ticker Price</option>
                                    <option value="callStrikePrice">Call Strike Price</option>
                                    <option value="requiredIncrease">Required If Exercised</option>
                                    <option value="percentage">Required If Exercised</option>
                                </select>
                                <button className='btn btn-primary' onClick={fetchHistoryFuc}>Go</button>
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
                                            <td>{meanCalls?.tickerName}</td>
                                            <td>{roundToTwoDecimals(meanCalls?.maxValue)}</td>
                                            <td>{roundToTwoDecimals(meanCalls?.meanValue)}</td>
                                            <td>{roundToTwoDecimals(meanCalls?.minValue)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className="dt-buttons mb-3">
                            {!chartView
                                &&
                                <>
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </>
                            }
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={findCallDataByDate}><span>Chart View</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { setChartView(false) }}><span>Grid View</span></button>
                        </div>
                        {!chartView
                            &&
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
                        }
                    </div>
                    {
                        !chartView
                            ?
                            <>
                                <div className="table-responsive">
                                    <table id="example" className="table display">
                                        <thead>
                                            <tr>
                                                <th onClick={() => { handleSort("stockNameTicker") }}>Ticker {getSortIcon("stockNameTicker", sortConfig)}</th>
                                                <th onClick={() => { handleSort("stockPrice") }}>Current Ticker Price {getSortIcon("stockPrice", sortConfig)}</th>
                                                <th onClick={() => { handleSort("strikePrice") }}>Call Strike Price {getSortIcon("strikePrice", sortConfig)}</th>
                                                <th onClick={() => { handleSort("callPrice") }}>Call Price {getSortIcon("callPrice", sortConfig)}</th>
                                                <th onClick={() => { handleSort("expirationDate") }}>Expiration Date {getSortIcon("expirationDate", sortConfig)}</th>
                                                <th onClick={() => { handleSort("daysExpiration") }}>Days To Expire {getSortIcon("daysExpiration", sortConfig)}</th>
                                                <th onClick={() => { handleSort("reqIncrease") }}>Required If Exercised {getSortIcon("reqIncrease", sortConfig)}</th>
                                                <th onClick={() => { handleSort("breakEven") }}>Break Even {getSortIcon("breakEven", sortConfig)}</th>
                                                <th onClick={() => { handleSort("percentage") }}>Percentage(%) {getSortIcon("percentage", sortConfig)}</th>
                                                <th onClick={() => { handleSort("leverageRatio") }}>Leverage Ratio {getSortIcon("leverageRatio", sortConfig)}</th>
                                                <th onClick={() => { handleSort("costofTenCalls") }}>Cost Of 10 Calls {getSortIcon("costofTenCalls", sortConfig)}</th>
                                                <th onClick={() => { handleSort("incomePerDay") }}>Income Per Day {getSortIcon("incomePerDay", sortConfig)}</th>
                                                <th onClick={() => { handleSort("annualPremium") }}>Annualized premium {getSortIcon("annualPremium", sortConfig)}</th>
                                                <th onClick={() => { handleSort("rank") }}>Rank {getSortIcon("rank", sortConfig)}</th>
                                                <th>Date</th>
                                                <th>Action</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filterData.map((item, index) => {
                                                    return (
                                                        <tr key={index + 'tr'}>
                                                            <td>{
                                                                typeof (item?.stockNameTicker) == 'string' ?
                                                                    parse(item?.stockNameTicker, options)
                                                                    :
                                                                    ""
                                                            }</td>
                                                            <td>{item?.stockPrice}</td>
                                                            <td>{item?.strikePrice}</td>
                                                            <td>{item?.callPrice}</td>
                                                            <td>{item?.expirationDate}</td>
                                                            <td>{item?.daysExpiration}</td>
                                                            <td>{item?.reqIncrease}</td>
                                                            <td>{item?.breakEven}</td>
                                                            <td>{item?.percentage}</td>
                                                            <td>{item?.leverageRatio}</td>
                                                            <td>{item?.costofTenCalls}</td>
                                                            <td>{item?.incomePerDay}</td>
                                                            <td>{item?.annualPremium}</td>
                                                            <td>{item?.rank}</td>
                                                            <td>{formatDate(item?.lastUpdatedAt)}</td>
                                                            <td><button className='btn btn-danger' title="delete" onClick={() => { deleteCall(item?.idCall) }}><i className="mdi mdi-delete"></i></button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                            </>
                            :
                            chartData &&
                            <><div className="form-group d-flex align-items-center">
                                <label htmlFor="" className='me-2 mb-0 form-label'>Chart View:</label>
                                <select className='form-select' style={{ maxWidth: "300px" }} onChange={handleChart}>
                                    <option value="callPrice">Call Price</option>
                                    <option value="stockPrice">Current Ticker Price</option>
                                    <option value="strikePrice">Call Strike Price</option>
                                    <option value="reqIncrease">Required If Exercised</option>
                                    <option value="percentage">Required If Exercised</option>
                                    <option value="leverageRatio">Leverage Ratio</option>
                                </select>
                            </div>
                                <CallChart data={chartData} view={viewBy} title={convertToReadableString(viewBy)} />
                            </>
                    }

                </div>
            </div>
        </>
    )
}
