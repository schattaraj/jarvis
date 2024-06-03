import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
import { calculateAverage, searchTable } from '../../utils/utils';
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
    const fetchStockByDate = async () => {
        let str = ""
        selectedStocks.map((item, index) => { str += item })
        console.log("selceddata" + str)
        if (selectedStocks.length > 0) {
            try {
                // const stockByDataApi = await fetch("https://jharvis.com/JarvisV2/findHistoricalStockDataByDateWithPercentageChange?startDate="+inputData?.startDate+"&endDate="+inputData?.endDate
                // +str
                // )
                const stockByDataApi = await fetch("https://jharvis.com/JarvisV2/findHistoricalStockDataByDateWithPercentageChange?startDate=10/01/2023&endDate=11/15/2023&myArray[]=ZX&myArray[]=ZUO&myArray[]=XOP&myArray[]=XME&myArray[]=XLY&myArray[]=XLV&myArray[]=XLU&myArray[]=XLP&myArray[]=XLK&myArray[]=XLI&myArray[]=XLF&myArray[]=XLE&myArray[]=XLB&myArray[]=XHB&myArray[]=XES&myArray[]=XBI&myArray[]=VWO&myArray[]=UUP&myArray[]=USO&myArray[]=TLT&myArray[]=TAN&myArray[]=SPY&myArray[]=SMH&myArray[]=RYT&myArray[]=RYH&myArray[]=RWO&myArray[]=RSX&myArray[]=RSP&myArray[]=RHS&myArray[]=QQQ&myArray[]=PWV&myArray[]=PNQI&myArray[]=PIN&myArray[]=PFF&myArray[]=PBE&myArray[]=OIL&myArray[]=MUB&myArray[]=MJ&myArray[]=MDY&myArray[]=IYT&myArray[]=IYR&myArray[]=IWO&myArray[]=IWM&myArray[]=IVV&myArray[]=ITB&myArray[]=IJR&myArray[]=IHY&myArray[]=IGV&myArray[]=IBB&myArray[]=HYG&myArray[]=HYEM&myArray[]=HYD&myArray[]=HEFA&myArray[]=HEDJ&myArray[]=HACK&myArray[]=GDX&myArray[]=FXI&myArray[]=FDN&myArray[]=EWZ&myArray[]=EWJ&myArray[]=EMCB&myArray[]=EFA&myArray[]=EEM&myArray[]=CWB&myArray[]=BKLN&myArray[]=AMLP&myArray[]=AGG&_=1700026935546")
                const stockByDateRes = await stockByDataApi.json()
                console.log("Data", stockByDateRes)
                setTableData(stockByDateRes)
            }
            catch (e) {
                console.log("error", e)
            }
        }

    }
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    useEffect(() => {
        async function run() {
            if (tableData.length > 0) {
                const items = await SliceData(currentPage, limit, tableData);
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
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5" tabindex="0" aria-controls="exampleStocksPair" type="button" title="PDF"><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5" tabindex="0" aria-controls="exampleStocksPair" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                    </div>
                    <div className="table-responsive">
                        <table className="table border display no-footer dataTable" style={{ width: "", marginLeft: "0px" }} role="grid" aria-describedby="exampleStocksPair_info"><thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Week 1</th>
                                <th>Week 2</th>
                                <th>Price</th>
                                <th>Change</th>
                                <th>Change %</th>
                            </tr>
                        </thead>
                            <tbody id="allStockDropTable">

                                <tr role="row" className="odd"><td>EWZ</td><td>2023-11-10</td><td>2023-11-03</td><td>32.4000</td><td>0.50</td><td><span >1.57</span></td></tr><tr role="row" className="even"><td>EWZ</td><td>2023-11-03</td><td>2023-10-27</td><td>31.9000</td><td>1.97</td><td><span >6.58</span></td></tr><tr role="row" className="odd"><td>EWZ</td><td>2023-10-27</td><td>2023-10-20</td><td>29.9300</td><td>-0.01</td><td><span >-0.03</span></td></tr><tr role="row" className="even"><td>EWZ</td><td>2023-10-20</td><td>2023-10-13</td><td>29.9400</td><td>-0.29</td><td><span >-0.96</span></td></tr><tr role="row" className="odd"><td>EWZ</td><td>2023-10-13</td><td>2023-10-06</td><td>30.2300</td><td>0.88</td><td><span >3.00</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >3.05</span></td><td><span >10.16%</span></td></tr><tr role="row" className="odd"><td>ITB</td><td>2023-11-10</td><td>2023-11-03</td><td>81.9900</td><td>0.75</td><td><span >0.92</span></td></tr><tr role="row" className="even"><td>ITB</td><td>2023-11-03</td><td>2023-10-27</td><td>81.2400</td><td>9.41</td><td><span >13.10</span></td></tr><tr role="row" className="odd"><td>ITB</td><td>2023-10-27</td><td>2023-10-20</td><td>71.8300</td><td>-0.51</td><td><span >-0.71</span></td></tr><tr role="row" className="even"><td>ITB</td><td>2023-10-20</td><td>2023-10-13</td><td>72.3400</td><td>-3.16</td><td><span >-4.19</span></td></tr><tr role="row" className="odd"><td>ITB</td><td>2023-10-13</td><td>2023-10-06</td><td>75.5000</td><td>-0.85</td><td><span >-1.11</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >5.64</span></td><td><span >8.02%</span></td></tr><tr role="row" className="odd"><td>XLK</td><td>2023-11-10</td><td>2023-11-03</td><td>179.5200</td><td>7.76</td><td><span >4.52</span></td></tr><tr role="row" className="even"><td>XLK</td><td>2023-11-03</td><td>2023-10-27</td><td>171.7600</td><td>10.64</td><td><span >6.60</span></td></tr><tr role="row" className="odd"><td>XLK</td><td>2023-10-27</td><td>2023-10-20</td><td>161.1200</td><td>-2.82</td><td><span >-1.72</span></td></tr><tr role="row" className="even"><td>XLK</td><td>2023-10-20</td><td>2023-10-13</td><td>163.9400</td><td>-4.69</td><td><span >-2.78</span></td></tr><tr role="row" className="odd"><td>XLK</td><td>2023-10-13</td><td>2023-10-06</td><td>168.6300</td><td>0.41</td><td><span >0.24</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >11.30</span></td><td><span >6.86%</span></td></tr><tr role="row" className="odd"><td>SMH</td><td>2023-11-10</td><td>2023-11-03</td><td>157.2800</td><td>7.77</td><td><span >5.20</span></td></tr><tr role="row" className="even"><td>SMH</td><td>2023-11-03</td><td>2023-10-27</td><td>149.5100</td><td>11.20</td><td><span >8.10</span></td></tr><tr role="row" className="odd"><td>SMH</td><td>2023-10-27</td><td>2023-10-20</td><td>138.3100</td><td>-3.79</td><td><span >-2.67</span></td></tr><tr role="row" className="even"><td>SMH</td><td>2023-10-20</td><td>2023-10-13</td><td>142.1000</td><td>-6.28</td><td><span >-4.23</span></td></tr><tr role="row" className="odd"><td>SMH</td><td>2023-10-13</td><td>2023-10-06</td><td>148.3800</td><td>0.03</td><td><span >0.02</span></td></tr><tr role="row" className="even"><td></td><td></td><td></td><td><span >CUMULATIVE CHANGE</span></td><td><span >8.93</span></td><td><span >6.42%</span></td></tr><tr role="row" className="odd"><td>PNQI</td><td>2023-11-10</td><td>2023-11-03</td><td>32.6900</td><td>0.82</td><td><span >2.57</span></td></tr></tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
