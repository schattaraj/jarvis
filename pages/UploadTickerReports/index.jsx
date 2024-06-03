import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Context } from '../../contexts/Context';
import Loader from '../../components/loader';
export default function UploadTickerReports() {
    const context = useContext(Context)
    const [tickers, setTickers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [tableData,setTableData] = useState([])
    const fetchTickersFunc = async () => {
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTickerByAdmin?_=1716533190772")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
    }
    const handleChange = () => {

    }
    const fetchTickerReports = async() => {
        context.setLoaderState(true)
        try {
            const fetchAllTickerReports = await fetch("https://jharvis.com/JarvisV2/getAllTickerReports?_=1716974778979");
            const fetchAllTickerReportsRes = await fetchAllTickerReports.json()
            setTableData(fetchAllTickerReportsRes)
        } catch (error) {
            
        }
        context.setLoaderState(false)
    }
    const uploadFormData = async(e)=>{
        context.setLoaderState(true)
        try {
            e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        const response = await fetch('https://jharvis.com/JarvisV2/uploadReportTicker', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("Successfully uploaded")
                const result = await response.json();
                alert(result.msg)
                form.reset()
                fetchTickerReports()
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            
        }
        fetchTickerReports()
        context.setLoaderState(false)
    }
    useEffect(() => {
        fetchTickersFunc()
        fetchTickerReports()
    }, [])
    return (
        <>
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
                                <form onSubmit={uploadFormData}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="">Select Ticker</label>
                                                <select name="tickerName" className='form-select' onChange={handleChange} required>
                                                    <option value="">--Select Ticker--</option>
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
                                                <input type="text" name='description' placeholder="Description" className='form-control' required />

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="">Select Category</label>
                                                <select name="catagoryType" id="" className="form-select" required>
                                                    <option value="">--Select Category--</option>
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
                                                <ReactDatePicker className='form-control' name='reportDate'  selected={startDate} onChange={(date) => setStartDate(date)} required/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="file" name="reportfileDetails" className='form-control' required />
                                        </div>
                                        <div className="actions">
                                            <button className='btn btn-primary' type='submit'>Upload</button>
                                        </div>
                                    </div>
                                </form>
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
            <Loader/>
        </>
    )
}
