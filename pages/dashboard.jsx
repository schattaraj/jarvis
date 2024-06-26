import React, { useContext } from 'react'
import Head from 'next/head';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import Link from 'next/link'
import { Context } from '../contexts/Context';
import Card from '../components/Card';
export default function Admin() {
    const context = useContext(Context)
    return (
        <>
            <Head>
                <title>Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
                {/* <script src="./vendors/js/vendor.bundle.base.js"></script>
                <script src="./js/misc.js"></script> */}
            </Head>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span> Dashboard
                        </h3>

                    </div>
                    <div className="row justify-content-center animate__animated animate__fadeInLeft">
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/marketAnalytics" bg="bg-yellow" img="/icons/Marketing Analytics.png" title="Market Analytics (Stocks,Bonds,ETFs and more)" click={context.setMarketAnalytics(true)}/>
                        </div>
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/compareStocks" bg="bg-blue" img="/icons/Compare Stocks.png" title="Compare Stocks, ETFs"  click={context.setCompareStocks(true)}/>
                        </div>
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/portfolio" bg="bg-orange" img="/icons/Portfolio.png" title="Portfolios" />
                        </div>
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/insights" bg="bg-red" img="/icons/Insights.png" title="Insights (PDF Reports and Videos on investment Research and more)" />
                        </div>
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/newsletter" bg="bg-green" img="/icons/Newsletter.png" title="Newsletter" />
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
                <Footer />
            </div>
        </>
    )
}
