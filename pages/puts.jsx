import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader'; 
import { Context } from '../contexts/Context'; 
import parse from 'html-react-parser';
export default function PUTS() {
    const [option,setOption] = useState([]);
    const [tickers,setTickers] = useState([]);
    const [dates,setDates] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const fetchTickersFunc = async()=>{
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerBigList?metadataName=Tickers_Watchlist&_=1706798577724")
            const fetchTickersRes = await fetchTickers.json() 
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
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
    const handleChange = ()=>{

    }
    const handleSelectClick = () => {
        if (selectedOption === 'History') {
            handleOpenModal()
        }
    }
    useEffect(()=>{
        fetchTickersFunc()
        fetchDates()
    },[])
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
                                    </span>PUTS
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
                                    <input type="text" className="form-control me-2" placeholder='Call Strike Price'/>
                                    <input type="text" className="form-control me-2" placeholder='Call Price'/>
                                    <input type="text" className="form-control me-2" placeholder='Expiration Date'/>
                                    <input type="text" className="form-control me-2" placeholder='Add To Date'/>
                                    <button className='btn btn-primary me-2'>Add</button>
                                    <button className='btn btn-primary me-2'>Save</button>
                                    <button className='btn btn-primary me-2'>Reset</button>
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

				</tbody>
			</table>
                            </div>                          
                            </div>
                            </div>
</div>
</div>
                   </>
  )
}
