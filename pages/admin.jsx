import React from 'react'
import Head from 'next/head';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
export default function Admin() {
    return (
        <>
            <Head>
                <title>Admin</title>
                <link rel="icon" href="/favicon.ico" />
                <script src="./vendors/js/vendor.bundle.base.js"></script>
                <script src="./js/misc.js"></script>
            </Head>
            <div className="container-scroller">
                <Navigation />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div class="main-panel">
                        <div class="content-wrapper">
                            <div class="page-header">
                                <h3 class="page-title">
                                    <span class="page-title-icon bg-gradient-primary text-white me-2">
                                        <i class="mdi mdi-home"></i>
                                    </span> Dashboard
                                </h3>

                            </div>
                            <div class="row">
                                <div class="col-md-4 stretch-card grid-margin">
                                    <div class="card bg-gradient-danger card-img-holder text-white">
                                        <div class="card-body">
                                            <img src="assets/images/dashboard/circle.svg" class="card-img-absolute" alt="circle-image" />

                                            <h2>Market Analytics</h2>
                                            <h3 class="mb-5">(Stocks,Bonds,ETFs and more)</h3>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 stretch-card grid-margin">
                                    <div class="card bg-gradient-info card-img-holder text-white">
                                        <div class="card-body">
                                            <img src="assets/images/dashboard/circle.svg" class="card-img-absolute" alt="circle-image" />

                                            <h2 class="mb-5">Compare Stocks, ETFs</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 stretch-card grid-margin">
                                    <div class="card bg-orange-gradient card-img-holder text-white">
                                        <div class="card-body">
                                            <img src="assets/images/dashboard/circle.svg" class="card-img-absolute" alt="circle-image" />

                                            <h2 class="mb-5">Portfolios</h2>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 stretch-card grid-margin">
                                    <div class="card bg-green-gradient card-img-holder text-white">
                                        <div class="card-body">
                                            <img src="assets/images/dashboard/circle.svg" class="card-img-absolute" alt="circle-image" />

                                            <h2>Insights</h2>
                                            <h3 class="mb-5">(PDF Reports and Videos on investment Research and more)</h3>

                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 stretch-card grid-margin">
                                    <div class="card bg-red-gradient  card-img-holder text-white">
                                        <div class="card-body">
                                            <img src="assets/images/dashboard/circle.svg" class="card-img-absolute" alt="circle-image" />


                                            <h2 class="mb-5">Newsletter</h2>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Login</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form class="pt-3">
                                            <div class="form-group">
                                                <input type="email" class="form-control form-control-lg" id="exampleInputEmail1" placeholder="Username" />
                                            </div>
                                            <div class="form-group">
                                                <input type="password" class="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password" />
                                            </div>
                                            <div class="mt-3">
                                                <a class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" href="../../index.html">SIGN IN</a>
                                            </div>
                                            <div class="my-2 d-flex justify-content-between align-items-center">
                                                <div class="form-check">
                                                    <label class="form-check-label text-muted">
                                                        <input type="checkbox" class="form-check-input" /> Keep me signed in </label>
                                                </div>
                                                <a href="#" class="auth-link text-black">Forgot password?</a>
                                            </div>
                                            <div class="text-center mt-4 font-weight-light"> Don't have an account? <a href="register.html" class="text-primary">Create</a>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <footer class="footer">
                            <div class="container-fluid d-flex justify-content-between">
                                <span class="text-muted d-block text-center text-sm-start d-sm-inline-block">Copyright © confitechsol.com 2023</span>
                                <span class="float-none float-sm-end mt-1 mt-sm-0 text-end"> Free <a href="https://www.bootstrapdash.com/bootstrap-admin-template/" target="_blank">Bootstrap admin template</a> from Bootstrapdash.com</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    )
}
