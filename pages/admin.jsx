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
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span> Admin
                        </h3>
                    </div>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/BusinessActivity"} onClick={() => { context.toggleBusinessActivity(true) }}>
                                <div className="d-flex bg-purple">
                                    <img src="/icons/BusinessActivity.png" alt="" />
                                    <h3>Business Activity</h3>
                                </div>
                            </Link>
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
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/SavedSecurities"}>
                                <div className="d-flex bg-gray">
                                    <img src="/icons/Saved Securities.png" alt="" />
                                    <h3>Saved Securities</h3>
                                </div>
                            </Link>
                            <div className="d-none card bg-gradient-info card-img-holder text-white">
                                <Link href={"/SavedSecurities"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                        <h2 className="mb-5">Saved Securities</h2>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/AddTicker"}>
                                <div className="d-flex bg-seagreen">
                                    <img src="/icons/Add Ticker.png" alt="" />
                                    <h3>Add Ticker</h3>
                                </div>
                            </Link>
                            <div className="d-none card bg-orange-gradient card-img-holder text-white">
                                <Link href={"/AddTicker"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                        <h2 className="mb-5">Add Ticker</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/UploadTickerReports"}>
                                <div className="d-flex bg-yellow">
                                    <img src="/icons/Upload Ticker Reports.png" alt="" />
                                    <h3>Upload Ticker Reports</h3>
                                </div>
                            </Link>
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
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/UploadAnalystVideos"}>
                                <div className="d-flex bg-blue">
                                    <img src="/icons/Upload Analysts Videos.png" alt="" />
                                    <h3>Upload Analyst Videos</h3>
                                </div>
                            </Link>
                            <div className="d-none card bg-red-gradient  card-img-holder text-white">
                                <Link href={"/UploadAnalystVideos"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Upload Analyst Videos</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/UploadPodcast"}>
                                <div className="d-flex bg-orange">
                                    <img src="/icons/Upload Podcast.png" alt="" />
                                    <h3>Upload Podcast</h3>
                                </div>
                            </Link>
                            <div className="d-none card bg-gradient-dark  card-img-holder text-white">
                                <Link href={"/UploadPodcast"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Upload Podcast</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/ChangePassword"}>
                                <div className="d-flex bg-red">
                                    <img src="/icons/Change Password.png" alt="" />
                                    <h3>Change Password</h3>
                                </div>
                            </Link>
                            <div className="d-none card bg-gradient-info  card-img-holder text-white">
                                <Link href={"/ChangePassword"}>
                                    <div className="card-body">
                                        <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                        <h2 className="mb-5">Change Password</h2>

                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-4 stretch-card grid-margin">
                            <Link href={"/MutualFund"}>
                                <div className="d-flex bg-green">
                                    <img src="/icons/Mutual Funds.png" alt="" />
                                    <h3>Mutual Fund</h3>
                                </div>
                            </Link>
                            <div className="d-none card bg-gradient-success  card-img-holder text-white">
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

        </>
    )
}
