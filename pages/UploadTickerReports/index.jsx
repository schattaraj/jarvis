import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Context } from '../../contexts/Context';
import Loader from '../../components/loader';
import SliceData from '../../components/SliceData';
import Swal from 'sweetalert2';
export default function UploadTickerReports() {
    const context = useContext(Context)
    const [tickers, setTickers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [tableData,setTableData] = useState([])
    const [filteredData,setFilteredData] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [limit,setLimit] = useState(25)
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
    const downloadReport = async(fileName)=>{
        context.setLoaderState(true)
        try{
            const downloadApi = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2+"downloadTickerReport?fileName="+fileName)
            const downloadApiRes = await downloadApi.json()
            window.open(downloadApiRes?.responseStr,'_blank')
        }
        catch(error){
            console.log("Error",error)
        }  
        context.setLoaderState(false)      
    }
    const deleteTickerReport = async(id)=>{
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
                    const formData = new FormData();
                    formData.append("idTickerReports", id)
                    const rowDelete = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2+"deleteTickerReport", {
                        method: 'DELETE',
                        body: formData
                    })
                    if (rowDelete.ok) {
                        const rowDeleteRes = await rowDelete.json()
                        Swal.fire({
                            title: rowDeleteRes?.msg,
                            icon: "success",
                            confirmButtonColor: "#719B5F"
                        })
                        fetchTickerReports()

                    }
                } catch (error) {
                    console.log(error)
                }
                context.setLoaderState(false)
            }
        })
    }
    useEffect(() => {
        fetchTickersFunc()
        fetchTickerReports()
    }, [])
    useEffect(()=>{
        if(tableData.length > 0){
           setFilteredData(SliceData(currentPage,limit,tableData))
        }
    },[tableData])
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
                                            <th className='sticky-action'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        filteredData.length > 0 && filteredData.map((item,index)=>{
                                            return <tr key={"report"+index}>
                                                <td>{item?.tickerName}</td>
                                                <td>{item?.companyName}</td>
                                                <td>{item?.description}</td>
                                                <td>{item?.catagoryType}</td>
                                                <td>{item?.reportDate}</td>
                                                <td className='sticky-action'>
                                                <button className='px-4 btn btn-primary' onClick={() => { downloadReport(item?.reportfileDetails) }}><i className="mdi mdi-download"></i></button>
                                                        <button className='px-4 ms-2 btn btn-danger' title='delete' onClick={() => { deleteTickerReport(item?.idTickerReports) }}><i className="mdi mdi-delete"></i></button>
                                                </td>
                                            </tr>
                                         })   
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            <Loader/>
        </>
    )
}
