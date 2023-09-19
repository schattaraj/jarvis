import React from 'react'
import Link from 'next/link'
export default function Sidebar() {
  return (
    <>
         <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <Link href="/" className="nav-link">
                <div className="nav-profile-image">
                  <img src="./images/team-1.jpg" alt="profile"/>
                  <span className="login-status online"></span>
                  
                </div>
                <div className="nav-profile-text d-flex flex-column">
                  <span className="font-weight-bold mb-2">Noland</span>
                  <span className="text-secondary text-small">CEO</span>
                </div>
                <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/admin">
                <span className="menu-title">Dashboard</span>
                <i className="mdi mdi-home menu-icon"></i>
              </Link>
            </li>
           
            <li className="nav-item">
              <div className="d-flex align-items-center justify-content-between">
              <Link href="marketAnalytics" className="nav-link menu-title"><span className="menu-title">Market Analytics</span></Link>
              <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-contacts menu-icon"></i>
              </a>
            </div>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><a className="nav-link" href="#">Stocks</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Bonds</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">ETFs</a></li>
                </ul> 
                </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="compareStocks">
                <span className="menu-title">Compare Stocks</span>
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <span className="menu-title">Portfolios</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <span className="menu-title">Insights</span>
                <i className="mdi mdi-table-large menu-icon"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#general-pages" aria-expanded="false" aria-controls="general-pages">
                <span className="menu-title">Newsletter</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-medical-bag menu-icon"></i>
              </a>
              
            </li>
         
          </ul>
        </nav>
    </>
  )
}
