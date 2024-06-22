import React, { useContext } from 'react'
import Head from 'next/head';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Footer from '../../components/footer';
import Link from 'next/link'
import { Context } from '../../contexts/Context';
import Card from '../../components/Card';
function BusinessActivity() {
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span> Business Activity
            </h3>

          </div>
          <div className="row">
            <div className="col-md-4 stretch-card grid-margin">
              <Card route="/BusinessActivity/BusinessPipeline" bg="bg-seagreen" img="/icons/Business Pipeline.png" title="Business Pipeline" />

              {/* <div className="card bg-green-gradient card-img-holder text-white">
                <Link href={"/BusinessActivity/BusinessPipeline"}>
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">Business Pipeline</h2>

                  </div>
                </Link>
              </div> */}
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <Card route="/BusinessActivity/BusinessTracking" bg="bg-blue" img="/icons/Business Tracking.png" title="Business Tracking" />
              {/* <div className="card bg-orange-gradient card-img-holder text-white">
                <Link href={"/BusinessActivity/BusinessTracking"}>
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">Business Tracking</h2>
                  </div>
                </Link>
              </div> */}
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <Card route="/BusinessActivity/Prospects" bg="bg-blue" img="/icons/Prospects.png" title="Prospects" />
              {/* <div className="card bg-red-gradient card-img-holder text-white">
                <Link href={"/BusinessActivity/Prospects"}>
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">Prospects</h2>
                  </div>
                </Link>
              </div> */}
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </>
  )
}

export default BusinessActivity