import React, { useRef,useContext } from 'react'
import Link from 'next/link'
import { Context } from '../contexts/Context'
import { useRouter } from 'next/router';
export default function Sidebar() {
  const context = useContext(Context)
  const router = useRouter();
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
  const navItems = [
    { label: 'Compare Stocks', route: '/compareStocks', children: [{label:'Pair of stocks',route:'/compareStocks/stocksPair'}, {label:'My stocks',route:'/compareStocks/myStocks'}] }
  ];
   // Function to determine if a route is active
   const isActive = (route) => {
    return router.pathname === route;
  };

  // Function to determine if a child route is active
  const isChildActive = (child) => {
    return router.pathname === child;
  };
  return (
    <>
         <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <Link href="/" className={router.pathname === '/' ? 'nav-link active' : 'nav-link'}>
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
              <Link className={router.pathname === '/dashboard' ? 'nav-link btn active' : 'nav-link'} href="/dashboard">
                <span className="menu-title">Dashboard</span>
                <i className="mdi mdi-home menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/admin' ? 'nav-link btn active' : 'nav-link'} href="/admin">
                <span className="menu-title">Admin</span>
                <i className="mdi mdi-account menu-icon"></i>
              </Link>
            </li>
           
            <li className="nav-item">
              {/* <Link className={router.pathname === '/BusinessActivity' ? 'nav-link btn active' : 'nav-link'} href="/BusinessActivity">
                <span className="menu-title">Business Activity</span>
                <i className="mdi mdi-city-variant menu-icon"></i>
              </Link> */}
              <div className="d-flex align-items-center justify-content-between">
              <Link href="/BusinessActivity" className={router.pathname === '/BusinessActivity' ? 'nav-link menu-title btn active ' : "nav-link menu-title"}><span className="menu-title">Business Activity</span></Link>
              <button className="btn nav-link" data-bs-toggle="collapse" onClick={()=>{context.handleDropdownClick("BusinessActivity")}} aria-expanded={context.openDropdown === "BusinessActivity" ? "true" :"false"} aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-city-variant menu-icon"></i>
              </button>
            </div>
            <div className={context.openDropdown === "BusinessActivity" ? "collapse show" : "collapse"} id="ui-basic" ref={context.collapse}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><Link className={router.pathname === '/BusinessActivity/BusinessPipeline' ? 'nav-link btn active' : 'nav-link'} href="/BusinessActivity/BusinessPipeline">Business Pipeline</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/BusinessActivity/BusinessTracking' ? 'nav-link btn active' : 'nav-link'} href="/BusinessActivity/BusinessTracking">Business Tracking</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/BusinessActivity/Prospects' ? 'nav-link btn active' : 'nav-link'} href="/BusinessActivity/Prospects">Prospects</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/BusinessActivity/SeminarTracking' ? 'nav-link btn active' : 'nav-link'} href="/BusinessActivity/SeminarTracking">Seminar Tracking</Link></li>
                </ul>
                </div>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/SavedSecurities' ? 'nav-link btn active' : 'nav-link'} href="/SavedSecurities">
                <span className="menu-title">Saved Securities</span>
                <i className="mdi mdi-account-key menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/AddTicker' ? 'nav-link btn active' : 'nav-link'} href="/AddTicker">
                <span className="menu-title">Add Ticker</span>
                <i className="mdi mdi-text menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/UploadTickerReports' ? 'nav-link btn active' : 'nav-link'} href="/UploadTickerReports">
                <span className="menu-title">Upload Ticker Reports</span>
                <i className="mdi mdi-upload menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/UploadAnalystVideos' ? 'nav-link btn active' : 'nav-link'} href="/UploadAnalystVideos">
                <span className="menu-title">Upload Analyst Videos</span>
                <i className="mdi mdi-video menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/UploadPodcast' ? 'nav-link btn active' : 'nav-link'} href="/UploadPodcast">
                <span className="menu-title">Upload Podcast</span>
                <i className="mdi mdi-music menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/ChangePassword' ? 'nav-link btn active' : 'nav-link'} href="/ChangePassword">
                <span className="menu-title">Change Password</span>
                <i className="mdi mdi-lock menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/MutualFund' ? 'nav-link btn active' : 'nav-link'} href="/MutualFund">
                <span className="menu-title">Mutual Fund</span>
                <i className="mdi mdi-cash-refund menu-icon"></i>
              </Link>
            </li>
           
           
            <li className="nav-item">
              <div className="d-flex align-items-center justify-content-between">
              <Link href="/marketAnalytics" className={router.pathname === '/marketAnalytics' ? 'nav-link menu-title btn active ' : "nav-link menu-title"} onClick={()=>{context.toggleMarketAnalytics()}}><span className="menu-title">Market Analytics</span></Link>
              <button className="btn nav-link" data-bs-toggle="collapse" onClick={()=>{context.handleDropdownClick("marketAnalytics")}} aria-expanded={context.openDropdown === "marketAnalytics" ? "true" :"false"} aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-contacts menu-icon"></i>
              </button>
            </div>
              <div className={context.openDropdown === "marketAnalytics" ? "collapse show" : "collapse"} id="ui-basic" ref={context.collapse}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><Link className={router.pathname === '/stocks' ? 'nav-link btn active' : 'nav-link'} href="/stocks" onClick={context.toggleStockMenu}>Stocks</Link>
                  {/* <div className={context.stockMenu ?"collapse show" : "collapse"} id="ui-basic">
                <ul className="nav flex-column sub-menu ps-3">
                <li className='nav-item'>
                  <Link className={router.pathname === '/stocks' ? 'nav-link active' : 'nav-link'} href="/stocks">Screener</Link>
                </li>
                <li className='nav-item'>
                  <Link className={router.pathname === '/byIndustry' ? 'nav-link active' : 'nav-link'} href="/byIndustry">By Industry</Link>
                </li>
                <li className='nav-item'>
                  <Link className={router.pathname === '/watchList' ? 'nav-link active' : 'nav-link'} href="/watchList">Watch List</Link>
                </li>
                <li className='nav-item'>
                  <Link className={router.pathname === '/topStocks' ? 'nav-link active' : 'nav-link'} href="/topStocks">Top Stocks</Link>
                </li>
                </ul>
                </div> */}
                  </li>
                  <li className="nav-item"><Link className={router.pathname === '/bonds' ? 'nav-link active' : 'nav-link'} href="/bonds">Bonds</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/etfs' ? 'nav-link active' : 'nav-link'} href="/etfs">ETFs</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/bond-reports' ? 'nav-link active' : 'nav-link'} href="/bond-reports">Bond Reports</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/pem-details' ? 'nav-link active' : 'nav-link'} href="/pem-details">PEM Details</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/pem-rule' ? 'nav-link active' : 'nav-link'} href="/pem-rule">PEM Rule</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/Calls' ? 'nav-link active' : 'nav-link'} href="/Calls">Calls</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/puts' ? 'nav-link active' : 'nav-link'} href="/puts">PUTS</Link></li>
                </ul> 
                </div>
            </li>
            <li className="nav-item">
            <div className="d-flex align-items-center justify-content-between">
              <Link className={router.pathname === '/compareStocks' ? 'nav-link btn active' : 'nav-link'} href="/compareStocks">
                <span className="menu-title">Compare Stocks</span>
              </Link>
              <button className="btn nav-link" data-bs-toggle="collapse" onClick={()=>{context.handleDropdownClick("compareStocks")}} aria-expanded={context.openDropdown === "compareStocks" ? "true" :"false"} aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </button>
              </div>
              <div className={context.openDropdown === "compareStocks" ? "collapse show" : "collapse"} id="ui-basic" ref={context.collapse}>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><Link className={router.pathname === '/compareStocks/stocksPair' ? 'nav-link active' : 'nav-link'} href="/compareStocks/stocksPair">Pair of stocks</Link></li>
                  <li className="nav-item"><Link className={router.pathname === '/compareStocks/myStocks' ? 'nav-link active' : 'nav-link'} href="/compareStocks/myStocks">My stocks</Link></li>
                </ul> 
                </div>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/portfolio' ? 'nav-link btn active' : 'nav-link'} href="/portfolio">
                <span className="menu-title">Portfolios</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/bondPortfolio' ? 'nav-link btn active' : 'nav-link'} href="/bondPortfolio">
                <span className="menu-title">Bond Portfolio</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
            <div className="d-flex align-items-center justify-content-between">
            <Link className={router.pathname === '/insights' ? 'nav-link btn active' : 'nav-link'} href="/insights" onClick={()=>{context.handleDropdownClick("insights")}}>
                <span className="menu-title">Insights</span>
              </Link>
              <button className="btn nav-link" data-bs-toggle="collapse" onClick={()=>{context.handleDropdownClick("insights")}} aria-expanded={context.openDropdown === "insights"  ? "true" :"false"} aria-controls="ui-basic">
                <i className="menu-arrow"></i> <i className="mdi mdi-table-large menu-icon"></i>
              </button>
              </div>
              <div className={context.openDropdown === "insights"  ? "collapse show" : "collapse"} id="ui-basic" ref={context.collapse}>
                <ul className="nav flex-column sub-menu">
                <li className="nav-item"><Link className={router.pathname === '/insights/videoes' ? 'nav-link active' : 'nav-link'} href="/insights/videoes">Videos</Link></li>
                <li className="nav-item"><Link className={router.pathname === '/insights/podcast' ? 'nav-link active' : 'nav-link'} href="/insights/podcast">Podcast</Link></li>
                <li className="nav-item"><Link className={router.pathname === '/insights/reports' ? 'nav-link active' : 'nav-link'} href="/insights/reports">Reports</Link></li>
                <li className="nav-item"><Link className={router.pathname === '/insights/onePageReport' ? 'nav-link active' : 'nav-link'} href="/insights/onePageReport">One Page Report</Link></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <Link className={router.pathname === '/newsletter' ? "btn nav-link" : 'nav-link'} data-bs-toggle="collapse" href="/newsletter" aria-expanded="false" aria-controls="general-pages">
                <span className="menu-title">Newsletter</span>
                {/* <i className="menu-arrow"></i> */}
                <i className="mdi mdi-pen menu-icon"></i>
              </Link>
              
            </li>
         
          </ul>
        </nav>
    </>
  )
}
