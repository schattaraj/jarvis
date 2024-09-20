import { useContext, useEffect, useState } from 'react'
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Loader from '../../components/loader'; 
import { Context } from '../../contexts/Context'; 
import parse from 'html-react-parser';
import Breadcrumb from '../../components/Breadcrumb';
export default function PUTS() {
    const [option,setOption] = useState([]);
    const [tickers,setTickers] = useState([]);
    const [dates,setDates] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const [inputData,setInputData] = useState({
        putStrikePrice:"",
        putPrice:"",
        expirationDate:"",
        addToDate:""
    })
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [limit, setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const context = useContext(Context)
    const fetchTickersFunc = async()=>{
        context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerBigList?metadataName=Tickers_Watchlist&_=1706798577724")
            const fetchTickersRes = await fetchTickers.json() 
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const fetchDates = async()=>{
        try{
            const fetchDates = await fetch("https://jharvis.com/JarvisV2/findAllDatesPut?_=1706850539768")
            const fetchDateRes = await fetchDates.json()
            setDates(fetchDateRes)
        }
        catch(e){
        }
    }
    const findAllPutsByTickerName = ()=>{
        
    }
    const handleChange = ()=>{
        
    }
    const handleSelectClick = () => {
        if (selectedOption === 'History') {
            handleOpenModal()
        }
    }
    const inputDataHandler = (e)=>{
        setInputData({...inputData, [e.target.name]: e.target.value})
    }
    const formReset = ()=>{
        setInputData({...inputData,putStrikePrice:"",putPrice:"",expirationDate:"",addToDate:""})
    }
    const addData = ()=>{
        // const hasEmptyValue = Object.values(inputData).some(value => value === "");
        Object.entries(inputData).forEach(([key, value]) => {
            if (value === "") {
                alert(`The key "${key}" has an empty value.`);
            }
        });
    }
    useEffect(()=>{
        fetchTickersFunc()
        fetchDates()
    },[])
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
                                            <button className='btn btn-primary' onClick={handleSelectClick}>History</button>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Select Date</label>
                                            <select name="portfolio_name" className='form-select' onChange={handleChange}>
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
                                            <button className='btn btn-primary' onClick={handleSelectClick}>GO</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'> 
                                    <input type="text" className="form-control me-2" placeholder='Put Strike Price' value={inputData?.putStrikePrice} name="putStrikePrice" onChange={inputDataHandler}/>
                                    <input type="text" className="form-control me-2" placeholder='Put Price' value={inputData?.putPrice} name="putPrice" onChange={inputDataHandler}/>
                                    <input type="date" className="form-control me-2" placeholder='Expiration Date' value={inputData?.expirationDate} name="expirationDate" onChange={inputDataHandler}/>
                                    <input type="date" className="form-control me-2" placeholder='Add To Date' value={inputData?.addToDate} name="addToDate" onChange={inputDataHandler}/>
                                    <button className='btn btn-primary me-2' onClick={addData}>Add</button>
                                    <button className='btn btn-primary me-2'>Save</button>
                                    <button className='btn btn-primary me-2' onClick={formReset}>Reset</button>
                                {/* <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button"><span>Create New Rule</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span>View All Rule</span></button>
                                </div> */}
                            </div>
                            <div className="table-responsive mt-4">
                            <table id="example" className="table display">
				<thead>
					<tr>
						<th>Ticker</th>
						<th>Current Ticker Price</th>
						<th>Put Strike Price</th>
						<th>Put Price</th>
						<th>Expiration Date</th>
						<th>Date To Expire</th>
						<th>Required If Exercised</th>
						<th>Break Even</th>
						<th>Downside Protection(%)</th>
						<th>Leverage Ratio</th>
						<th>Income Potential of 10 Puts($)</th>
						<th>Income Per Day</th>
						<th>Annualized premium</th>
						<th>Rank</th>
						<th>Date</th>
						<th>Action</th>

					</tr>
				</thead>
				<tbody>

				</tbody>
			</table>
                            </div>                          
                            </div>
                            </div>
                   </>
  )
}
