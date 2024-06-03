import React from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Link from 'next/link'
export default function InsightsHome() {
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>Insights
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
                <Link href="/insights/videoes">
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">Videos</h2>

                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <Link href="/insights/podcast">
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">Podcast</h2>

                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <Link href="/insights/reports">
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h2 className="mb-5">Reports</h2>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <Link href="/insights/reports">
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h2 className="mb-5">One Page Report</h2>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </>
  )
}
