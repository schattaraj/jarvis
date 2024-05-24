import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
export default function UploadTickerReports() {
    const [tickers,setTickers] = useState([]);
    const fetchTickersFunc = async()=>{
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerByAdmin?_=1716533190772")
            const fetchTickersRes = await fetchTickers.json() 
            setTickers(fetchTickersRes) 
        }
        catch (e) {

        }
    }
    const handleChange = ()=>{

    }
    const fetchHistoryFuc = ()=>{

    }
    useEffect(()=>{
        fetchTickersFunc()
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
                                    </span>Upload Ticker Reports
                                </h3>
                            </div> 
                            <div className="selection-area mb-3">
                                <div className="row">
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label htmlFor="">Select Ticker</label>
                                            <select name="portfolio_name" className='form-select' onChange={handleChange}>
                                                {/* <option></option> */}
                                                {tickers.map((item, index) => (
                                                    <option key={index} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        </div> 
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label htmlFor="">Description</label>
                                            <input type="text" placeholder="Description" className='form-control'/>
                                            
                                        </div>
                                        </div> 
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label htmlFor="">Select Category</label>
                                            <select name="catagoryType" id="" className="form-select">
                                                    <option value="-1">--Select Category--</option>
													<option value="First Focus">First Focus</option>
													<option value="Fresh Look">Fresh Look</option>
													<option value="Read and React">Read and React</option>	
													<option value="Grab and Go 7-packs">Grab and Go 7-packs</option>
													<option value="Special Reports">Special Reports</option>
													<option value="Annual Reports">Annual Reports</option>
													<option value="Shareholder Letters">Shareholder Letters</option>
													<option value="Jarvis Weekly">Jarvis Weekly</option>
													<option value="Logo">Logo</option>
													<option value="One Page Reports">One Page Reports</option>
                                            </select>
                                        </div> 
                                        </div> 
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label htmlFor="">Report Date</label>
                                            <input type="date" className='form-control'/>
                                        </div>
                                        </div> 
                                        <div className="form-group">
                                        <input type="file" name="reportfileDetails"/>
                                        </div>
                                        <div className="actions">
                                            <button className='btn btn-primary' onClick={()=>{}}>Upload</button>
                                        </div> 
                                </div>
                            </div>
                        <div className="table-responsive">
                            <table className="table">
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
                            </table>
                        </div>
                            </div>
                    </div>
                </div>
    </div>
    </>
  )
}
