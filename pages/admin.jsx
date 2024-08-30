import React, { useContext, useEffect } from 'react'
import Head from 'next/head';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import Link from 'next/link'
import { Context } from '../contexts/Context';
import Card from '../components/Card';
import 'animate.css';
import Breadcrumb from '../components/Breadcrumb';
export default function Admin() {
    const context = useContext(Context)
    useEffect(()=>{
        context.setBackground(true)
    },[])
    return (
        <>
            <Head>
                <title>Admin</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="main-panel">
                <div className="content-wrapper">
        <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span> Admin
                        </h3>
                    </div>
                    <div className="row justify-content-center align-items-center animate__animated animate__fadeInLeft">
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/BusinessActivity" bg="bg-purple" img="/icons/BusinessActivity.png" title="Business Activity" click={context.toggleBusinessActivity(true)}/>
                            <div className="d-none card bg-gradient-danger card-img-holder text-white">
                                <Link href={"/BusinessActivity"} onClick={() => { context.toggleBusinessActivity(true) }}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                        <h2>Business Activity</h2>
                                        {/* <h3 className="mb-5">(Stocks,Bonds,ETFs and more)</h3> */}

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/SavedSecurities" bg="bg-gray" img="/icons/Saved Securities.png" title="Saved Securities"/>
                            <div className="d-none card bg-gradient-info card-img-holder text-white">
                                <Link href={"/SavedSecurities"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                        <h2 className="mb-5">Saved Securities</h2>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/AddTicker" bg="bg-seagreen" img="/icons/Add Ticker.png" title="Add Ticker"/>
                            <div className="d-none card bg-orange-gradient card-img-holder text-white">
                                <Link href={"/AddTicker"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                        <h2 className="mb-5">Add Ticker</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/MutualFund" bg="bg-green" img="/icons/Mutual Funds.png" title="Mutual Fund"/>
                            <div className="d-none card bg-gradient-success  card-img-holder text-white">
                                <Link href={"/MutualFund"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Mutual Fund</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/UploadTickerReports" bg="bg-yellow" img="/icons/Upload Ticker Reports.png" title="Upload Ticker Reports"/>
                            <div className="d-none card bg-green-gradient card-img-holder text-white">
                                <Link href={"/UploadTickerReports"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                        <h2>Upload Ticker Reports</h2>
                                        {/* <h3 className="mb-5">(PDF Reports and Videos on investment Research and more)</h3> */}

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/UploadAnalystVideos" bg="bg-blue" img="/icons/Upload Analysts Videos.png" title="Upload Analyst Videos"/>
                            <div className="d-none card bg-red-gradient  card-img-holder text-white">
                                <Link href={"/UploadAnalystVideos"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Upload Analyst Videos</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/UploadPodcast" bg="bg-orange" img="/icons/Upload Podcast.png" title="Upload Podcast"/>
                            <div className="d-none card bg-gradient-dark  card-img-holder text-white">
                                <Link href={"/UploadPodcast"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Upload Podcast</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 stretch-card grid-margin">
                        <Card route="/ChangePassword" bg="bg-red" img="/icons/Change Password.png" title="Change Password"/>
                             
                            <div className="d-none card bg-gradient-info  card-img-holder text-white">
                                <Link href={"/ChangePassword"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Change Password</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
