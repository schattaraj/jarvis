import React, { useRef,useContext } from 'react'
import Link from 'next/link'
import { Context } from '../contexts/Context'
export default function Sidebar() {
  const context = useContext(Context)
  // const collapse = useRef("")
  // const showMenu = (e)=>{
  //   let elem = context.collapse.current
  //   if(e.target.getAttribute('aria-expanded') == "false"){
  //     e.target.setAttribute('aria-expanded',"true");
  //     elem.classList.add("show")
  //   }
  //   else{
  //     e.target.setAttribute('aria-expanded',"false");
  //     elem.classList.remove("show")
  //   }
    
    
  // }
  return (
    <>
         <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <Link href="/" className="nav-link">
                <div className="nav-profile-image">
                  <img src="/images/team-1.jpg" alt="profile"/>
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
              <button className="btn nav-link" data-bs-toggle="collapse" onClick={()=>{context.toggleMarketAnalytics()}} aria-expanded={context.marketAnalytics ? "true" :"false"} aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-contacts menu-icon"></i>
              </button>
            </div>
              <div className={context.marketAnalytics ? "collapse show" : "collapse"} id="ui-basic" ref={context.collapse}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><Link className="nav-link" href="stocks" onClick={context.toggleStockMenu}>Stocks</Link>
                  <div className={context.stockMenu ?"collapse show" : "collapse"} id="ui-basic">
                <ul className="nav flex-column sub-menu ps-3">
                <li className='nav-item'>
                  <Link className='nav-link' href="/stocks">Screener</Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' href="/byIndustry">By Industry</Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' href="/watchList">Watch List</Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' href="/topStocks">Top Stocks</Link>
                </li>
                </ul>
                </div>
                  </li>
                  <li className="nav-item"><a className="nav-link" href="#">Bonds</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">ETFs</a></li>
                </ul> 
                </div>
            </li>
            <li className="nav-item">
            <div className="d-flex align-items-center justify-content-between">
              <Link className="nav-link" href="compareStocks">
                <span className="menu-title">Compare Stocks</span>
              </Link>
              <button className="btn nav-link" data-bs-toggle="collapse" onClick={()=>{context.toggleCompareStock()}} aria-expanded={context.compareStocks ? "true" :"false"} aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </button>
              </div>
              <div className={context.compareStocks ? "collapse show" : "collapse"} id="ui-basic" ref={context.collapse}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><Link className="nav-link" href="/compareStocks/stocksPair">Pair of stocks</Link></li>
                  <li className="nav-item"><Link className="nav-link" href="/compareStocks/myStocks">My stocks</Link></li>
                </ul> 
                </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <span className="menu-title">Portfolios</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </a>
            </li>
            <li className="nav-item">
            <Link className="nav-link" href="/insights">
                <span className="menu-title">Insights</span>
                <i className="mdi mdi-table-large menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <a className="btn nav-link" data-bs-toggle="collapse" href="#general-pages" aria-expanded="false" aria-controls="general-pages">
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
