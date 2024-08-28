import React, { useContext } from 'react'
import Head from 'next/head';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Footer from '../../components/footer';
import Link from 'next/link'
import { Context } from '../../contexts/Context';
import Card from '../../components/Card';
import 'animate.css';
import Breadcrumb from '../../components/Breadcrumb';
export default function Portfolios() {
    const context = useContext(Context)
    return (
        <>
            <Head>
                <title>Portfolios</title>
                <link rel="icon" href="/favicon.ico" />
                {/* <script src="./vendors/js/vendor.bundle.base.js"></script>
                <script src="./js/misc.js"></script> */}
            </Head>
            <div className="main-panel">
                <div className="content-wrapper">
                    <Breadcrumb/>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span> Portfolios
                        </h3>

                    </div>
                    <div className="row justify-content-center animate__animated animate__fadeInLeft">
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/portfolios/stockPortfolio" bg="bg-yellow" img="/icons/Stocks.png" title="Stock Portfolio" />
                        </div>
                        <div className="col-md-6 col-lg-4 stretch-card grid-margin">
                        <Card route="/portfolios/bondPortfolio" bg="bg-blue" img="/icons/Bonds.png" title="Bond Portfolio" />
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
