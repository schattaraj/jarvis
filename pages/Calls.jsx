import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader';
import { Context } from '../contexts/Context';
import parse from 'html-react-parser';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tickersData } from '../utils/staticData'
import Select from 'react-select'
export default function Calls() {
    const [option, setOption] = useState([]);
    const [tickers, setTickers] = useState(tickersData);
    const [dates, setDates] = useState([
        "2023-10-10",
        "2023-08-16",
        "2023-05-31",
        "2023-05-22",
        "2023-02-15",
        "2022-09-29",
        "2022-04-28",
        "2022-02-01",
        "2021-10-25",
        "2021-01-08",
        "2020-04-17",
        "2020-04-09",
        "2020-03-24",
        "2020-02-20",
        "2020-02-07",
        "2020-01-16",
        "2019-12-30",
        "2019-12-16",
        "2019-11-26",
        "2019-11-12",
        "2019-10-31",
        "2019-10-14",
        "2019-10-01",
        "2019-09-30",
        "2019-09-16",
        "2019-09-11",
        "2019-08-20",
        "2019-08-19",
        "2019-07-31",
        "2019-07-24",
        "2019-07-23",
        "2019-07-22",
        "2019-07-19",
        "2019-07-15",
        "2019-07-10",
        "2019-06-26",
        "2019-06-11",
        "2019-05-29",
        "2019-05-24",
        "2019-05-21",
        "2019-05-13",
        "2019-05-01",
        "2019-04-15",
        "2019-04-05",
        "2019-04-01",
        "2019-03-26",
        "2019-01-02",
        "2018-12-13",
        "2018-12-06",
        "2018-11-21",
        "2018-11-15",
        "2018-11-07",
        "2018-10-25",
        "2018-10-23",
        "2018-10-12",
        "2018-09-27",
        "2018-09-12",
        "2018-08-22",
        "2018-08-10",
        "2018-08-09",
        "2018-07-27",
        "2018-07-06",
        "2017-02-15",
        "2016-12-15",
        "2016-12-08",
        "2016-06-26",
        null
    ])
    const [selectedOption, setSelectedOption] = useState('');
    const [expirationDate, setExpiration] = useState();
    const [addToDate, setAddToDate] = useState();
    const [meanCalls, setMeanCalls] = useState(false)
    const [selectedTicker, setSelectedTicker] = useState('A')
    const [selectedDate, setSelectedDate] = useState('2023-10-10')
    const [tableData, setTableData] = useState([])
    const fetchTickersFunc = async () => {
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerBigList?metadataName=Tickers_Watchlist&_=1706798577724")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
    }
    const fetchDates = async () => {
        try {
            const fetchDates = await fetch("https://jharvis.com/JarvisV2/findAllDates?_=1706798577725")
            const fetchDateRes = await fetchDates.json()
            setDates(fetchDateRes)
        }
        catch (e) {
        }
    }
    const fetchHistoryFuc = async () => {
        try {
            const fetchHistory = await fetch("https://jharvis.com/JarvisV2/findMeanCallsByTickerName?tickername=" + selectedTicker)
            const fetchHistoryRes = await fetchHistory.json()
            setMeanCalls(fetchHistoryRes)
        }
        catch (e) {
        }
    }
    const fetchByDateFunc = async () => {
        try {
            const fetchByDate = await fetch("https://jharvis.com/JarvisV2/findCallDataByDate?date=" + selectedDate)
            const fetchByDateRes = await fetchByDate.json()
            setTableData(fetchByDateRes)
        }
        catch (e) {
        }
    }
    const handleChange = (e) => {
        console.log("Ticker", e.target.value)
        setSelectedTicker(e.target.value)
    }
    const changeDate = (e) => {
        setSelectedDate(e.target.value)
    }
    const handleClick = () => {

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
    useEffect(() => {
        // fetchTickersFunc()
        // fetchDates()
    }, [])
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>CALLS
                        </h3>
                    </div>
                    <div className="selection-area mb-3">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Select Ticker</label>
                                    <select name="portfolio_name" className='form-select' onChange={handleChange}>
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
                                    <button className='btn btn-primary' onClick={fetchHistoryFuc}>History</button>
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
                                    <button className='btn btn-primary' onClick={fetchByDateFunc}>GO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <input type="text" className="form-control me-2" placeholder='Call Strike Price' />
                        <input type="text" className="form-control me-2" placeholder='Call Price' />
                        {/* <input type="date" className="form-control me-2" placeholder='Expiration Date'/> */}
                        <DatePicker className="form-control" selected={expirationDate}
                            onChange={(date) => setExpiration(date)}
                            placeholderText="Expiration Date"
                        />
                        <DatePicker className="form-control" selected={addToDate}
                            onChange={(date) => setAddToDate(date)}
                            placeholderText="Add To Date"
                        />
                        {/* <input type="text" className="form-control me-2" placeholder='Add To Date'/> */}
                        <button className='btn btn-primary me-2'>Add</button>
                        <button className='btn btn-primary me-2'>Save</button>
                        <button className='btn btn-primary me-2'>Reset</button>
                        {/* <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button"><span>Create New Rule</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span>View All Rule</span></button>
                                </div> */}
                    </div>
                    {
                        meanCalls &&
                        <div className="table-responsive mt-4">
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
                                        <td>{meanCalls?.maxValue}</td>
                                        <td>{meanCalls?.minValue}</td>
                                        <td>{meanCalls?.meanValue}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }

                    <div className="table-responsive mt-4">
                        <table id="example" className="table display">
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Current Ticker Price</th>
                                    <th>Call Strike Price</th>
                                    <th>Call Price</th>
                                    <th>Expiration Date</th>
                                    <th>Days To Expire</th>
                                    <th>Required If Exercised</th>
                                    <th>Break Even</th>
                                    <th>Percentage(%)</th>
                                    <th>Leverage Ratio</th>
                                    <th>Cost Of 10 Calls</th>
                                    <th>Income Per Day</th>
                                    <th>Annualized premium</th>
                                    <th>Rank</th>
                                    <th>Date</th>
                                    <th>Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tableData.map((item, index) => {
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
                                                <td>{selectedDate}</td>
                                                <td><button className='btn btn-danger'><i className="mdi mdi-delete"></i></button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
