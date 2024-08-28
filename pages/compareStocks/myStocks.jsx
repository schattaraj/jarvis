import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
import { calculateAverage, getSortIcon, mmddyy, searchTable } from '../../utils/utils';
import Breadcrumb from '../../components/Breadcrumb';
import { Context } from '../../contexts/Context';
export default function MyStocks() {
    const [favStocks, setFavStocks] = useState([])
    const [inputData, setInputData] = useState({
        startDate: "",
        endDate: ""
    })
    const [selectedStocks, setSelectedStocks] = useState([
        "&myArray[]=XOP", "&myArray[]=XME", "&myArray[]=XLY", "&myArray[]=XLV", "&myArray[]=XLU", "&myArray[]=XLP", "&myArray[]=XLK", "&myArray[]=XLI", "&myArray[]=XLF", "&myArray[]=XLE", "&myArray[]=XLB", "&myArray[]=XHB", "&myArray[]=XES", "&myArray[]=XBI", "&myArray[]=VWO", "&myArray[]=UUP", "&myArray[]=USO", "&myArray[]=TLT", "&myArray[]=TAN", "&myArray[]=SPY", "&myArray[]=SMH", "&myArray[]=RYT", "&myArray[]=RYH", "&myArray[]=RWO", "&myArray[]=RSX", "&myArray[]=RSP", "&myArray[]=RHS", "&myArray[]=QQQ", "&myArray[]=PWV", "&myArray[]=PNQI", "&myArray[]=PIN", "&myArray[]=PFF", "&myArray[]=PBE", "&myArray[]=OIL", "&myArray[]=MUB", "&myArray[]=MJ", "&myArray[]=MDY", "&myArray[]=IYT", "&myArray[]=IYR", "&myArray[]=IWO", "&myArray[]=IWM", "&myArray[]=IVV", "&myArray[]=ITB", "&myArray[]=IJR", "&myArray[]=IHY", "&myArray[]=IGV", "&myArray[]=IBB", "&myArray[]=HYG", "&myArray[]=HYEM", "&myArray[]=HYD", "&myArray[]=HEFA", "&myArray[]=HEDJ", "&myArray[]=HACK", "&myArray[]=GDX", "&myArray[]=FXI", "&myArray[]=FDN", "&myArray[]=EWZ", "&myArray[]=EWJ", "&myArray[]=EMCB", "&myArray[]=EFA", "&myArray[]=EEM", "&myArray[]=CWB", "&myArray[]=BKLN", "&myArray[]=AMLP", "&myArray[]=AGG"
    ])
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const context = useContext(Context)
    const fecthStocks = async () => {
        try {
            const stocksApi = await fetch("https://jharvis.com/JarvisV2/getAllFavStocks")
            const stocksRes = await stocksApi.json()
            setFavStocks(stocksRes)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    const handleInput = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }
    const stockSlections = () => {
        setSelectedStocks(cuurentArr => [...cuurentArr, "&myArray[]=ZX"])
        // if(favStocks.length>0){
        //     favStocks.map((item,index)=>{ 
        //         setSelectedStocks(cuurentArr => [...cuurentArr,"&myArr[]="+item?.stockName])
        //     })
        // }
    }
    // const fetchStockByDate = async () => {
    //     let str = ""
    //     selectedStocks.map((item, index) => { str += item })
    //     console.log("selceddata" + str)
    //     if (selectedStocks.length > 0) {
    //         try {
    //             // const stockByDataApi = await fetch("https://jharvis.com/JarvisV2/findHistoricalStockDataByDateWithPercentageChange?startDate="+inputData?.startDate+"&endDate="+inputData?.endDate
    //             // +str
    //             // )
    //             const stockByDataApi = await fetch(`https://jharvis.com/JarvisV2/findHistoricalStockDataByDateWithPercentageChange?startDate=${mmddyy(inputData?.startDate)}&endDate=${mmddyy(inputData?.endDate)}&myArray[]=ZX&myArray[]=ZUO&myArray[]=XOP&myArray[]=XME&myArray[]=XLY&myArray[]=XLV&myArray[]=XLU&myArray[]=XLP&myArray[]=XLK&myArray[]=XLI&myArray[]=XLF&myArray[]=XLE&myArray[]=XLB&myArray[]=XHB&myArray[]=XES&myArray[]=XBI&myArray[]=VWO&myArray[]=UUP&myArray[]=USO&myArray[]=TLT&myArray[]=TAN&myArray[]=SPY&myArray[]=SMH&myArray[]=RYT&myArray[]=RYH&myArray[]=RWO&myArray[]=RSX&myArray[]=RSP&myArray[]=RHS&myArray[]=QQQ&myArray[]=PWV&myArray[]=PNQI&myArray[]=PIN&myArray[]=PFF&myArray[]=PBE&myArray[]=OIL&myArray[]=MUB&myArray[]=MJ&myArray[]=MDY&myArray[]=IYT&myArray[]=IYR&myArray[]=IWO&myArray[]=IWM&myArray[]=IVV&myArray[]=ITB&myArray[]=IJR&myArray[]=IHY&myArray[]=IGV&myArray[]=IBB&myArray[]=HYG&myArray[]=HYEM&myArray[]=HYD&myArray[]=HEFA&myArray[]=HEDJ&myArray[]=HACK&myArray[]=GDX&myArray[]=FXI&myArray[]=FDN&myArray[]=EWZ&myArray[]=EWJ&myArray[]=EMCB&myArray[]=EFA&myArray[]=EEM&myArray[]=CWB&myArray[]=BKLN&myArray[]=AMLP&myArray[]=AGG&_=1700026935546`)
    //             const stockByDateRes = await stockByDataApi.json()
    //             console.log("Data", stockByDateRes)
    //             setTableData(stockByDateRes)
    //         }
    //         catch (e) {
    //             console.log("error", e)
    //         }
    //     }

    // }
    const fetchStockByDate = async () => {
        if (selectedStocks.length === 0) {
            console.log("No stocks selected");
            return;
        }

        // Convert selectedStocks array to a comma-separated string
        const stockSymbols = selectedStocks.join('');
        console.log("stockSymbols", stockSymbols)
        // Define a function to format dates as mm/dd/yyyy
        // const formatDate = (date) => {
        //     if (!date) return '';
        //     const d = new Date(date);
        //     const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        //     const day = String(d.getDate()).padStart(2, '0');
        //     const year = d.getFullYear();
        //     return `${month}/${day}/${year}`;
        // };

        // Format startDate and endDate using the formatDate function
        const formattedStartDate = mmddyy(inputData?.startDate);
        const formattedEndDate = mmddyy(inputData?.endDate);

        // Construct URL with query parameters
        const url = new URL(`https://jharvis.com/JarvisV2/findHistoricalStockDataByDateWithPercentageChange?startDate=${formattedStartDate}&endDate=${formattedEndDate}${selectedStocks}`);
        // url.searchParams.append("startDate", formattedStartDate);
        // url.searchParams.append("endDate", formattedEndDate);

        // // Add stock symbols to URL as individual query parameters
        // stockSymbols.split(',').forEach(symbol => {
        //     url.searchParams.append("myArray[]", symbol);
        // });
        console.log("stockSymbols", url)
        // Optionally, append a timestamp or other query parameters if needed
        url.searchParams.append('_', Date.now());
        context.setLoaderState(true)
        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const stockByDateRes = await response.json();
            console.log("Data", stockByDateRes);
            setTableData(stockByDateRes);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
        context.setLoaderState(false)
    };

    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
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
    const changeLimit = (e) => {
        setLimit(e.target.value)
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
                // console.log("items",items)
                setFilterData(items)
            }
        }
        run()
    }, [currentPage, tableData])
    useEffect(() => {
        fecthStocks()
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
                            </span>My Stocks
                        </h3>
                    </div>
                    <div className="selection-area mb-3">
                        <div className="row">
                            <div className="col-md-12">
                                <button className='btn btn-primary mb-3' onClick={stockSlections}>All Stocks</button>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">Start date</label>
                                    <input type="date" className="form-control" name="startDate" onChange={handleInput} value={inputData?.startDate} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="">End date</label>
                                    <input type="date" className="form-control" name="endDate" onChange={handleInput} value={inputData?.endDate} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={fetchStockByDate}>GO</button>
                                    <button className='btn btn-primary'>RESET</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        tableData.length > 0 &&
                        <div className='d-flex justify-content-between'>
                            <div className="dt-buttons mb-3">
                                <button className="dt-button buttons-pdf buttons-html5" tabindex="0" aria-controls="exampleStocksPair" type="button" title="PDF"><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                <button className="dt-button buttons-excel buttons-html5" tabindex="0" aria-controls="exampleStocksPair" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                            </div>
                            <div className="form-group d-flex align-items-center">
                                <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} />
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
                    }
                    <div className="table-responsive">
                        <table className="table border display no-footer dataTable" style={{ width: "", marginLeft: "0px" }} role="grid" aria-describedby="exampleStocksPair_info"><thead>
                            <tr>
                                <th>Symbol{getSortIcon("tickerName", sortConfig)}</th>
                                <th>Week 1{getSortIcon("week1Value", sortConfig)}</th>
                                <th>Week 2{getSortIcon("week2Value", sortConfig)}</th>
                                <th>Price{getSortIcon("price", sortConfig)}</th>
                                <th>Change{getSortIcon("changeInValue", sortConfig)}</th>
                                <th>Change %{getSortIcon("percentageChange", sortConfig)}</th>
                            </tr>
                        </thead>
                            <tbody id="allStockDropTable">
                                {
                                    filterData.map((item, index) => {
                                        return <tr>
                                            <td>{item?.tickerName}</td>
                                            <td>{item?.week1Value}</td>
                                            <td>{item?.week2Value}</td>
                                            <td>{item?.price}</td>
                                            <td>{item?.changeInValue}</td>
                                            <td>{item?.percentageChange}</td>
                                        </tr>
                                    })
                                }
                                {/* <tr role="row" className="odd"><td>EWZ</td><td>2023-11-10</td><td>2023-11-03</td><td>32.4000</td><td>0.50</td><td><span >1.57</span></td></tr><tr role="row" className="even"><td>EWZ</td><td>2023-11-03</td><td>2023-10-27</td><td>31.9000</td><td>1.97</td><td><span >6.58</span></td></tr><tr role="row" className="odd"><td>EWZ</td><td>2023-10-27</td><td>2023-10-20</td><td>29.9300</td><td>-0.01</td><td><span >-0.03</span></td></tr><tr role="row" className="even"><td>EWZ</td><td>2023-10-20</td><td>2023-10-13</td><td>29.9400</td><td>-0.29</td><td><span >-0.96</span></td></tr><tr role="row" className="odd"><td>EWZ</td><td>2023-10-13</td><td>2023-10-06</td><td>30.2300</td><td>0.88</td><td><span >3.00</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >3.05</span></td><td><span >10.16%</span></td></tr><tr role="row" className="odd"><td>ITB</td><td>2023-11-10</td><td>2023-11-03</td><td>81.9900</td><td>0.75</td><td><span >0.92</span></td></tr><tr role="row" className="even"><td>ITB</td><td>2023-11-03</td><td>2023-10-27</td><td>81.2400</td><td>9.41</td><td><span >13.10</span></td></tr><tr role="row" className="odd"><td>ITB</td><td>2023-10-27</td><td>2023-10-20</td><td>71.8300</td><td>-0.51</td><td><span >-0.71</span></td></tr><tr role="row" className="even"><td>ITB</td><td>2023-10-20</td><td>2023-10-13</td><td>72.3400</td><td>-3.16</td><td><span >-4.19</span></td></tr><tr role="row" className="odd"><td>ITB</td><td>2023-10-13</td><td>2023-10-06</td><td>75.5000</td><td>-0.85</td><td><span >-1.11</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >5.64</span></td><td><span >8.02%</span></td></tr><tr role="row" className="odd"><td>XLK</td><td>2023-11-10</td><td>2023-11-03</td><td>179.5200</td><td>7.76</td><td><span >4.52</span></td></tr><tr role="row" className="even"><td>XLK</td><td>2023-11-03</td><td>2023-10-27</td><td>171.7600</td><td>10.64</td><td><span >6.60</span></td></tr><tr role="row" className="odd"><td>XLK</td><td>2023-10-27</td><td>2023-10-20</td><td>161.1200</td><td>-2.82</td><td><span >-1.72</span></td></tr><tr role="row" className="even"><td>XLK</td><td>2023-10-20</td><td>2023-10-13</td><td>163.9400</td><td>-4.69</td><td><span >-2.78</span></td></tr><tr role="row" className="odd"><td>XLK</td><td>2023-10-13</td><td>2023-10-06</td><td>168.6300</td><td>0.41</td><td><span >0.24</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >11.30</span></td><td><span >6.86%</span></td></tr><tr role="row" className="odd"><td>SMH</td><td>2023-11-10</td><td>2023-11-03</td><td>157.2800</td><td>7.77</td><td><span >5.20</span></td></tr><tr role="row" className="even"><td>SMH</td><td>2023-11-03</td><td>2023-10-27</td><td>149.5100</td><td>11.20</td><td><span >8.10</span></td></tr><tr role="row" className="odd"><td>SMH</td><td>2023-10-27</td><td>2023-10-20</td><td>138.3100</td><td>-3.79</td><td><span >-2.67</span></td></tr><tr role="row" className="even"><td>SMH</td><td>2023-10-20</td><td>2023-10-13</td><td>142.1000</td><td>-6.28</td><td><span >-4.23</span></td></tr><tr role="row" className="odd"><td>SMH</td><td>2023-10-13</td><td>2023-10-06</td><td>148.3800</td><td>0.03</td><td><span >0.02</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >8.93</span></td><td><span >6.42%</span></td></tr><tr role="row" className="odd"><td>PNQI</td><td>2023-11-10</td><td>2023-11-03</td><td>32.6900</td><td>0.82</td><td><span >2.57</span></td></tr> */}
                            </tbody>
                        </table>
                    </div>
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
                <Footer />
            </div>
        </>
    )
}
