import React from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Link from 'next/link';
export default function CompareStocs() {
  return (
    <>
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
                <Link href="/compareStocks/stocksPair">
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">Pair of Stocks</h2>

                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-orange-gradient card-img-holder text-white">
                <Link href="/compareStocks/myStocks">
                  <div className="card-body">
                    <img src="/assets/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />

                    <h2 className="mb-5">My Stocks</h2>
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
