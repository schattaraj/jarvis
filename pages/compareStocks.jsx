import React from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
export default function CompareStocs() {
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
                </span> Compare Stocks
              </h3>
              
            </div>
            <div className="row">
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-green-gradient card-img-holder text-white">
                  <div className="card-body">
                    <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    
                    <h2 className="mb-5">Pair of Stocks</h2>
                   
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-orange-gradient card-img-holder text-white">
                  <div className="card-body">
                    <img src="assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                   
                    <h2 className="mb-5">My Stocks</h2>
                  </div>
                </div>
              </div>
            
            </div>
          
          </div>
                        <footer className="footer">
                            <div className="container-fluid d-flex justify-content-between">
                                <span className="text-muted d-block text-center text-sm-start d-sm-inline-block">Copyright © confitechsol.com 2023</span>
                                <span className="float-none float-sm-end mt-1 mt-sm-0 text-end"> Free <a href="https://www.bootstrapdash.com/bootstrap-admin-template/" target="_blank">Bootstrap admin template</a> from Bootstrapdash.com</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
    </>
  )
}
