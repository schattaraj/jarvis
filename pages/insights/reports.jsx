import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Link from 'next/link'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
export default function Reports() {
    const [reports,setReports] = useState([])
    const [show, setShow] = useState(false);
    const [currentPdf, setCurrentPdf] = useState("");
    const [loader,setLoader] = useState(false)
    const fetchVideoes = async()=>{
        setLoader(true)
        try{
            const apiCall = await fetch("https://jharvis.com/JarvisV2/getAllTickerReports?filterText=&_=1699874262000")
            const response = await apiCall.json()
            setReports(response)
            console.log(response)
        }
        catch(e){
            console.log("error",e)
        }
        setLoader(false)
    }


    const handleClose = () => setShow(false);
    const handleShow = (path) =>{
        setShow(true);
        setCurrentPdf(path)
        console.log("path",path)
    }
    useEffect(()=>{
        fetchVideoes()
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
    </span>Reports
  </h3>
  <nav aria-label="breadcrumb">
    <ul className="breadcrumb">
      <li className="breadcrumb-item active" aria-current="page">
        <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
      </li>
    </ul>
  </nav>
</div>
<div className="row">{
    loader ?
<>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    <div className="col-md-4 stretch-card grid-margin">
    <SkeletonTheme>
    <div className='w-100'>
    <Skeleton  width={"100%"} height={"300px"}/>
    </div>
  </SkeletonTheme>
    </div>
    </>
    :
        reports.map((item,index)=>{
            return  <div className="col-md-4 stretch-card grid-margin" key={index}>
                <div className="report">
                <img src="/images/ReportsTN.png" alt="" className='image'/>
                <h5 className='card-title'>{item.tickerName}</h5>
                <p className ="card-text">{item.companyName}</p>
                <button className='btn btn-success' onClick={()=>{handleShow(item.reportfileDetails)}}>View</button>
                </div>
            </div>
        })
}
</div>

</div>
<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <iframe className="embed-responsive-item" src={"https://jharvis.com/JarvisV2/playPdf?fileName="+currentPdf} id="video" allowscriptaccess="always" allow="autoplay" style={{width:"100%"}}></iframe>
        </Modal.Body>
      </Modal>
<Footer/>
        </div>
    </div>
</div>
</>
  )
}
