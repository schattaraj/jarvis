import React from 'react'
import Footer from '../components/footer';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Link from 'next/link'
export default function MarketAnalytics() {
  return (
    <>
                    <div className="main-panel">
                    <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home"></i>
                </span> Market Analytics
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
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-danger card-img-holder text-white">
                  <Link href="/stocks">
                  <div className="card-body">
                    <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    
                    <h2 className="mb-5">Stock</h2>
                    
                  </div>
                  </Link>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-info card-img-holder text-white">
                <Link href={"/bonds"}>
                  <div className="card-body">
                    <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    
                    <h2 className="mb-5">Bonds</h2>
                    
                  </div>
                  </Link>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-success card-img-holder text-white">
                <Link href={"/etfs"}>
                  <div className="card-body">
                    <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h2 className="mb-5">ETFs</h2>
                  </div>
                  </Link>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-red-gradient card-img-holder text-white">
                                        <Link href={"/bond-reports"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
 
                                            <h3 className="mb-5">Bond Reports</h3>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-primary card-img-holder text-white">
                                        <Link href={"/pem-details"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
 
                                            <h3 className="mb-5">PEM Details</h3>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-dark card-img-holder text-white">
                                        <Link href={"/pem-rule"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
 
                                            <h3 className="mb-5">PEM Rule</h3>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-success card-img-holder text-white">
                                        <Link href={"/Calls"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
 
                                            <h3 className="mb-5">CALLS</h3>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-4 stretch-card grid-margin">
                                    <div className="card bg-gradient-warning card-img-holder text-white">
                                        <Link href={"/puts"}>
                                        <div className="card-body">
                                            <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
 
                                            <h3 className="mb-5">PUTS</h3>

                                        </div>
                                        </Link>
                                    </div>
                                </div>
            </div>
          
          </div>
          <Footer/>
                    </div>    
    </>
  )
}
