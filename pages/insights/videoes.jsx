import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Link from 'next/link'
export default function videoes() {
    const [videoes,setVideoes] = useState([])
    const fetchVideoes = async()=>{
        try{
            const apiCall = await fetch("https://jharvis.com/JarvisV2/getAllAnalystVideo?filterText=&_=1699861659729")
            const response = await apiCall.json()
            setVideoes(response)
            console.log(response)
        }
        catch(e){
            console.log("error",e)
        }
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
    </span>Videos
  </h3>
  <nav aria-label="breadcrumb">
    <ul className="breadcrumb">
      <li className="breadcrumb-item active" aria-current="page">
        <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
      </li>
    </ul>
  </nav>
</div>
<div className="row">
    {
        videoes.map((item,index)=>{
            return  <div className="col-md-4 stretch-card grid-margin" key={index}>
                <div className="video">
                {/* <div className="overlay">
                <img src="/images/VideoTN.png" className='image'/>
                <button className='play-btn'><img src="/icons/play.svg" alt="" /></button>
                </div> */}
                <video src={"https://jharvis.com/JarvisV2/playVideo?fileName="+item?.anaylstVideoDetails} controls style={{width:"100%"}}></video>
                </div>
            </div>
        })
    }

</div>

</div>
<Footer/>
        </div>
    </div>
</div>
</>
  )
}
