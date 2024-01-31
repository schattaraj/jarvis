import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Link from 'next/link'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation as Nav2,Autoplay } from 'swiper/modules';
export default function Podcast() {
    const [reports,setReports] = useState([])
    const [show, setShow] = useState(false);
    const [currentPdf, setCurrentPdf] = useState(false);
    const [loader,setLoader] = useState(false)
    const fetchVideoes = async()=>{
        setLoader(true)
        try{
            const apiCall = await fetch("https://jharvis.com/JarvisV2/getAllTickerReports?filterText=&_=1699874262000")
            const response = await apiCall.json()
            setReports(response)
            setCurrentPdf(response[0])
            console.log(response)
        }
        catch(e){
            console.log("error",e)
        }
        setLoader(false)
    }


    const handleClose = () => setShow(false);
    const handleShow = (path) =>{
        // setShow(true);
        setCurrentPdf(path)
        console.log("path",path)
    }
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
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
    </span>Podcast
  </h3>
</div>
{/* <h3 className='mb-3'>FIRST FOCUS, FRESH LOOK, READ & REACT & THE FUNDAMENTALS OF INVESTING - REPORTS</h3> */}
<p className='mb-4'>Coming Soon....</p>
 
{/* <div className="row">{
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
       reports.length > 0 && reports.map((item,index)=>{
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
</div> */}

</div>
<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <iframe className="embed-responsive-item" src={"https://jharvis.com/JarvisV2/playPdf?fileName="+currentPdf.reportfileDetails} id="video" allowscriptaccess="always" allow="autoplay" style={{width:"100%"}}></iframe>
        </Modal.Body>
      </Modal>
<Footer/>
        </div>
    </div>
</div>
</>
  )
}
