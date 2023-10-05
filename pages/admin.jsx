import React from 'react'
import Head from 'next/head';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import Link from 'next/link'
export default function Admin() {
    return (
        <>
            <Head>
                <title>Admin</title>
                <link rel="icon" href="/favicon.ico" />
                {/* <script src="./vendors/js/vendor.bundle.base.js"></script>
                <script src="./js/misc.js"></script> */}
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
                                    </span> Dashboard
                                </h3>

                            </div>
                            <div className="row">
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-danger card-img-holder text-white">
                                        <Link href={"marketAnalytics"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2>Market Analytics</h2>
                                            <h3 className="mb-5">(Stocks,Bonds,ETFs and more)</h3>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-info card-img-holder text-white">
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2 className="mb-5">Compare Stocks, ETFs</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-orange-gradient card-img-holder text-white">
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2 className="mb-5">Portfolios</h2>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-green-gradient card-img-holder text-white">
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                                            <h2>Insights</h2>
                                            <h3 className="mb-5">(PDF Reports and Videos on investment Research and more)</h3>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-red-gradient  card-img-holder text-white">
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />


                                            <h2 className="mb-5">Newsletter</h2>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Login</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form className="pt-3">
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Username" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password" />
                                            </div>
                                            <div className="mt-3">
                                                <a className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="../../index.html">SIGN IN</a>
                                            </div>
                                            <div className="my-2 d-flex justify-content-between align-items-center">
                                                <div className="form-check">
                                                    <label className="form-check-label text-muted">
                                                        <input type="checkbox" className="form-check-input" /> Keep me signed in </label>
                                                </div>
                                                <a href="#" className="auth-link text-black">Forgot password?</a>
                                            </div>
                                            <div className="text-center mt-4 font-weight-light"> Don't have an account? <a href="register.html" className="text-primary">Create</a>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                      <Footer/>
                    </div>
                </div>
            </div>
        </>
    )
}
