import React, { useContext } from 'react'
import Head from 'next/head';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import Link from 'next/link'
import { Context } from '../contexts/Context';
export default function Admin() {
    const context = useContext(Context)
    return (
        <>
         <Head>
                <title>Admin</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
                                    </span> Admin
                                </h3>
                            </div> 
                            <div className="row">
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <Link href={"/BusinessActivity"} onClick={()=>{context.toggleBusinessActivity(true)}}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2>Business Activity</h2>
                                            {/* <h3 className="mb-5">(Stocks,Bonds,ETFs and more)</h3> */}

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-info card-img-holder text-white">
                                        <Link href={"/SavedSecurities"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2 className="mb-5">Saved Securities</h2>
                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-orange-gradient card-img-holder text-white">
                                        <Link href={"/AddTicker"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2 className="mb-5">Add Ticker</h2>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-green-gradient card-img-holder text-white">
                                    <Link href={"/UploadTickerReports"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2>Upload Ticker Reports</h2>
                                            {/* <h3 className="mb-5">(PDF Reports and Videos on investment Research and more)</h3> */}

                                        </div>
                                    </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-red-gradient  card-img-holder text-white">
                                    <Link href={"/UploadAnalystVideos"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                            <h2 className="mb-5">Upload Analyst Videos</h2>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-dark  card-img-holder text-white">
                                    <Link href={"/UploadPodcast"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                            <h2 className="mb-5">Upload Podcast</h2>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-info  card-img-holder text-white">
                                    <Link href={"/ChangePassword"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                            <h2 className="mb-5">Change Password</h2>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-success  card-img-holder text-white">
                                    <Link href={"/MutualFund"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                            <h2 className="mb-5">Mutual Fund</h2>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
            </div>
            </div>
        </>
    )
}
