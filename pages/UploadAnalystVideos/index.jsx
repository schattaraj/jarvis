import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
export default function UploadAnalystVideos() {
    const [tickers,setTickers] = useState([]);
    const [allAnalystData,setAllAnalystData] = useState([])
    const [show, setShow] = useState(false);
    const [analystVideo,setAnalystVideo] = useState(false)
    const fetchTickersFunc = async()=>{
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1716538528361")
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
    const fetchAllAnalystVideos = async()=>{
        try{
            const getAllAnalyst = await fetch("https://jharvis.com/JarvisV2/getAllAnalystVideo?_=1716538528362")
            const getAllAnalystRes = await getAllAnalyst.json()
            setAllAnalystData(getAllAnalystRes)
        }
        catch(e){
            console.log("Error",e)
        }
        

    }
    const handleClose = () => setShow(false);
    const handleShow = (path) =>{
        setShow(true);
        setAnalystVideo(path)
    }
    const filter = ()=>{

    }
    useEffect(()=>{
        fetchTickersFunc()
        fetchAllAnalystVideos() 
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
                                    </span>Upload Analyst Videos
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
                                                    <option key={index} value={item?.element1}>
                                                        {item?.element1}
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
                           <div className="d-flex justify-content-end">
                            <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                           </div> 
                        <div className="table-responsive">
                            <table className="table">
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Company</th>
                                    <th>Description</th> 
                                    <th>Report Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allAnalystData.map((item,index)=>{
                                      return  <tr key={"analyst"+index}>
                                            <td>{item?.tickerName}</td>
                                            <td>{item?.companyName}</td>
                                            <td>{item?.description}</td>
                                            <td>{item?.reportDate}</td>
                                            <td>
                                            <button className='btn btn-primary me-2' onClick={()=>{handleShow(item?.anaylstVideoDetails)}}><i className="mdi mdi-video menu-icon"></i></button>
                                            <button className='btn btn-danger'><i className="mdi mdi-delete menu-icon"></i></button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                            </table>
                        </div>
                            </div>
                    </div>
                </div>
    </div>
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
          <Modal.Title>Analyst Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
        <video id="videoplayer1" playsinline="" autoplay="" muted="" loop="" height="240" controls="true">
  		<source id="videoSource" src={"https://jharvis.com/JarvisV2/playVideo?fileName="+analystVideo} type="video/mp4"/> 
  		</video>
        </Modal.Body>
    </Modal>
    </>
  )
}
