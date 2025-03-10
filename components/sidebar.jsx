import React, { useRef, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { Context } from "../contexts/Context";
import { useRouter } from "next/router";
import { getRoleFromToken } from "../utils/auth";
export default function Sidebar() {
  const context = useContext(Context);
  const router = useRouter();
  const [role,setRole] = useState("external")
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
    {
      label: "Compare Stocks",
      route: "/compareStocks",
      children: [
        { label: "Pair of stocks", route: "/compareStocks/stocksPair" },
        { label: "My stocks", route: "/compareStocks/myStocks" },
      ],
    },
  ];
  // Function to determine if a route is active
  const isActive = (route) => {
    return router.pathname === route;
  };

  // Function to determine if a child route is active
  const isChildActive = (child) => {
    return router.pathname === child;
  };
  useEffect(()=>{
    const role = getRoleFromToken()
    setRole(role)
  },[])
  return (
    <>
    {
      role == "internal"
      ?
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <Link
            href="/"
            className={
              router.pathname === "/" ? "nav-link active" : "nav-link"
            }
          >
            <div className="nav-profile-image">
              <img
                src={
                  context.userName.split("@")[0] === "NolandL"
                    ? "/images/team-1.jpg"
                    : "/images/user.png"
                }
                alt="profile"
              />
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text d-flex flex-column">
              <span className="font-weight-bold mb-2">
                {context.userName.split("@")[0]}
              </span>
              <span className="text-secondary text-small">
                {context.userName.split("@")[0] === "NolandL"
                  ? "CEO"
                  : "USER"}
              </span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={
              router.pathname === "/dashboard"
                ? "nav-link btn active"
                : "nav-link"
            }
            href="/dashboard"
          >
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <div className="d-flex align-items-center justify-content-between">
            <Link
              href="/marketAnalytics"
              className={
                router.pathname === "/marketAnalytics"
                  ? "nav-link menu-title btn active "
                  : "nav-link menu-title"
              }
              onClick={() => {
                context.toggleMarketAnalytics();
              }}
            >
              <span className="menu-title">Market Analytics</span>
            </Link>
            <button
              className="btn nav-link"
              data-bs-toggle="collapse"
              onClick={() => {
                context.handleDropdownClick("marketAnalytics");
              }}
              aria-expanded={
                context.openDropdown === "marketAnalytics" ? "true" : "false"
              }
              aria-controls="ui-basic"
            >
              <i className="menu-arrow"></i>{" "}
              <i className="mdi mdi-contacts menu-icon"></i>
            </button>
          </div>
          <div
            className={
              context.openDropdown === "marketAnalytics"
                ? "collapse show"
                : "collapse"
            }
            id="ui-basic"
            ref={context.collapse}
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/stocks"
                      ? "nav-link btn active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/stocks"
                  onClick={context.toggleStockMenu}
                >
                  Stocks
                </Link>
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
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/newStocks"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/newStocks"
                >
                  New Stocks
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/bonds"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/bonds"
                >
                  Bonds
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/etfs"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/etfs"
                >
                  ETFs
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/bond-reports"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/bond-reports"
                >
                  Bond Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/pem"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/pem"
                >
                  PEM
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/Calls"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/Calls"
                >
                  Calls
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/marketAnalytics/puts"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/marketAnalytics/puts"
                >
                  Puts
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <div className="d-flex align-items-center justify-content-between">
            <Link
              className={
                router.pathname === "/compareStocks"
                  ? "nav-link btn active"
                  : "nav-link"
              }
              href="/compareStocks"
            >
              <span className="menu-title">Compare Stocks</span>
            </Link>
            <button
              className="btn nav-link"
              data-bs-toggle="collapse"
              onClick={() => {
                context.handleDropdownClick("compareStocks");
              }}
              aria-expanded={
                context.openDropdown === "compareStocks" ? "true" : "false"
              }
              aria-controls="ui-basic"
            >
              <i className="menu-arrow"></i>{" "}
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            </button>
          </div>
          <div
            className={
              context.openDropdown === "compareStocks"
                ? "collapse show"
                : "collapse"
            }
            id="ui-basic"
            ref={context.collapse}
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/compareStocks/stocksPair"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/compareStocks/stocksPair"
                >
                  Pair of stocks
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/compareStocks/myStocks"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/compareStocks/myStocks"
                >
                  My stocks
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <div className="d-flex align-items-center justify-content-between">
            <Link
              className={
                router.pathname === "/portfolios"
                  ? "nav-link btn active"
                  : "nav-link"
              }
              href="/portfolios"
            >
              <span className="menu-title">Portfolios</span>
            </Link>
            <button
              className="btn nav-link"
              data-bs-toggle="collapse"
              onClick={() => {
                context.handleDropdownClick("portfolios");
              }}
              aria-expanded={
                context.openDropdown === "portfolios" ? "true" : "false"
              }
              aria-controls="ui-basic"
            >
              <i className="menu-arrow"></i>{" "}
              <i className="mdi mdi-chart-bar menu-icon"></i>
            </button>
          </div>
          <div
            className={
              context.openDropdown === "portfolios"
                ? "collapse show"
                : "collapse"
            }
            id="ui-basic"
            ref={context.collapse}
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/portfolios/stockPortfolio"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/portfolios/stockPortfolio"
                >
                  Stock Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/portfolios/bondPortfolio"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/portfolios/bondPortfolio"
                >
                  Bond Portfolio
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <div className="d-flex align-items-center justify-content-between">
            <Link
              className={
                router.pathname === "/insights"
                  ? "nav-link btn active"
                  : "nav-link"
              }
              href="/insights"
              onClick={() => {
                context.handleDropdownClick("insights");
              }}
            >
              <span className="menu-title">Insights</span>
            </Link>
            <button
              className="btn nav-link"
              data-bs-toggle="collapse"
              onClick={() => {
                context.handleDropdownClick("insights");
              }}
              aria-expanded={
                context.openDropdown === "insights" ? "true" : "false"
              }
              aria-controls="ui-basic"
            >
              <i className="menu-arrow"></i>{" "}
              <i className="mdi mdi-table-large menu-icon"></i>
            </button>
          </div>
          <div
            className={
              context.openDropdown === "insights"
                ? "collapse show"
                : "collapse"
            }
            id="ui-basic"
            ref={context.collapse}
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/insights/videoes"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/insights/videoes"
                >
                  Videos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/insights/podcast"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/insights/podcast"
                >
                  Podcast
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/insights/reports"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/insights/reports"
                >
                  Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/insights/onePageReport"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/insights/onePageReport"
                >
                  One Page Report
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <Link
            className={
              router.pathname === "/newsletter" ? "btn nav-link" : "nav-link"
            }
            data-bs-toggle="collapse"
            href="/newsletter"
            aria-expanded="false"
            aria-controls="general-pages"
          >
            <span className="menu-title">Newsletter</span>
            {/* <i className="menu-arrow"></i> */}
            <i className="mdi mdi-pen menu-icon"></i>
          </Link>
        </li>
        <li className="nav-item">
          <div className="d-flex align-items-center justify-content-between">
            <Link
              className={
                router.pathname === "/admin"
                  ? "nav-link btn active"
                  : "nav-link"
              }
              href="/admin"
            >
              <span className="menu-title">Admin</span>
            </Link>
            <button
              className="btn nav-link"
              data-bs-toggle="collapse"
              onClick={() => {
                context.handleDropdownClick("admin");
              }}
              aria-expanded={
                context.openDropdown === "admin" ? "true" : "false"
              }
              aria-controls="ui-basic"
            >
              <i className="menu-arrow"></i>{" "}
              <i className="mdi mdi-account menu-icon"></i>
            </button>
          </div>
          <div
            className={
              context.openDropdown === "admin" ? "collapse show" : "collapse"
            }
            id="ui-basic"
            ref={context.collapse}
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/BusinessActivity"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/BusinessActivity"
                >
                  Business Activity
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/SavedSecurities"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/SavedSecurities"
                >
                  Saved Securities
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/AddTicker"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/AddTicker"
                >
                  Add Ticker
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/MutualFund"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/MutualFund"
                >
                  Mutual Fund
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/UploadTickerReports"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/UploadTickerReports"
                >
                  Upload Ticker Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/UploadAnalystVideos"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/UploadAnalystVideos"
                >
                  Upload Analyst Videos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    router.pathname === "/ChangePassword"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/ChangePassword"
                >
                  Change Password
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* <li className="nav-item"> */}
        {/* <Link className={router.pathname === '/BusinessActivity' ? 'nav-link btn active' : 'nav-link'} href="/BusinessActivity">
              <span className="menu-title">Business Activity</span>
              <i className="mdi mdi-city-variant menu-icon"></i>
            </Link> */}
        {/* <div className="d-flex align-items-center justify-content-between">
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
              </div> */}
        {/* </li> */}
        {/* <li className="nav-item">
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
            <Link className={router.pathname === '/bondPortfolio' ? 'nav-link btn active' : 'nav-link'} href="/bondPortfolio">
              <span className="menu-title">Bond Portfolio</span>
              <i className="mdi mdi-chart-bar menu-icon"></i>
            </Link>
          </li> */}
      </ul>
    </nav>
    :
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
    <ul className="nav">
      <li className="nav-item nav-profile">
        <Link
          href="/"
          className={
            router.pathname === "/" ? "nav-link active" : "nav-link"
          }
        >
          <div className="nav-profile-image">
            <img
              src={
                context.userName.split("@")[0] === "NolandL"
                  ? "/images/team-1.jpg"
                  : "/images/user.png"
              }
              alt="profile"
            />
            <span className="login-status online"></span>
          </div>
          <div className="nav-profile-text d-flex flex-column">
            <span className="font-weight-bold mb-2">
              {context.userName.split("@")[0]}
            </span>
            <span className="text-secondary text-small">
              {context.userName.split("@")[0] === "NolandL"
                ? "CEO"
                : "USER"}
            </span>
          </div>
          <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={
            router.pathname === "/User/dashboard"
              ? "nav-link btn active"
              : "nav-link"
          }
          href="/dashboard"
        >
          <span className="menu-title">Dashboard</span>
          <i className="mdi mdi-home menu-icon"></i>
        </Link>
      </li>
      <li className="nav-item">
        <div className="d-flex align-items-center justify-content-between">
          <Link
            href="/marketAnalytics"
            className={
              router.pathname === "/marketAnalytics"
                ? "nav-link menu-title btn active "
                : "nav-link menu-title"
            }
            onClick={() => {
              context.toggleMarketAnalytics();
            }}
          >
            <span className="menu-title">Market Analytics</span>
          </Link>
          <button
            className="btn nav-link"
            data-bs-toggle="collapse"
            onClick={() => {
              context.handleDropdownClick("marketAnalytics");
            }}
            aria-expanded={
              context.openDropdown === "marketAnalytics" ? "true" : "false"
            }
            aria-controls="ui-basic"
          >
            <i className="menu-arrow"></i>{" "}
            <i className="mdi mdi-contacts menu-icon"></i>
          </button>
        </div>
        <div
          className={
            context.openDropdown === "marketAnalytics"
              ? "collapse show"
              : "collapse"
          }
          id="ui-basic"
          ref={context.collapse}
        >
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/stocks"
                    ? "nav-link btn active"
                    : "nav-link"
                }
                href="/marketAnalytics/stocks"
                onClick={context.toggleStockMenu}
              >
                Stocks
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/newStocks"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/newStocks"
              >
                New Stocks
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/bonds"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/bonds"
              >
                Bonds
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/etfs"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/etfs"
              >
                ETFs
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/bond-reports"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/bond-reports"
              >
                Bond Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/pem"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/pem"
              >
                PEM
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/Calls"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/Calls"
              >
                Calls
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/marketAnalytics/puts"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/marketAnalytics/puts"
              >
                Puts
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li className="nav-item">
        <div className="d-flex align-items-center justify-content-between">
          <Link
            className={
              router.pathname === "/compareStocks"
                ? "nav-link btn active"
                : "nav-link"
            }
            href="/compareStocks"
          >
            <span className="menu-title">Compare Stocks</span>
          </Link>
          <button
            className="btn nav-link"
            data-bs-toggle="collapse"
            onClick={() => {
              context.handleDropdownClick("compareStocks");
            }}
            aria-expanded={
              context.openDropdown === "compareStocks" ? "true" : "false"
            }
            aria-controls="ui-basic"
          >
            <i className="menu-arrow"></i>{" "}
            <i className="mdi mdi-format-list-bulleted menu-icon"></i>
          </button>
        </div>
        <div
          className={
            context.openDropdown === "compareStocks"
              ? "collapse show"
              : "collapse"
          }
          id="ui-basic"
          ref={context.collapse}
        >
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/compareStocks/stocksPair"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/compareStocks/stocksPair"
              >
                Pair of stocks
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/compareStocks/myStocks"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/compareStocks/myStocks"
              >
                My stocks
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li className="nav-item">
        <div className="d-flex align-items-center justify-content-between">
          <Link
            className={
              router.pathname === "/portfolios"
                ? "nav-link btn active"
                : "nav-link"
            }
            href="/portfolios"
          >
            <span className="menu-title">Model Portfolios</span>
          </Link>
          <button
            className="btn nav-link"
            data-bs-toggle="collapse"
            onClick={() => {
              context.handleDropdownClick("portfolios");
            }}
            aria-expanded={
              context.openDropdown === "portfolios" ? "true" : "false"
            }
            aria-controls="ui-basic"
          >
            <i className="menu-arrow"></i>{" "}
            <i className="mdi mdi-chart-bar menu-icon"></i>
          </button>
        </div>
        <div
          className={
            context.openDropdown === "portfolios"
              ? "collapse show"
              : "collapse"
          }
          id="ui-basic"
          ref={context.collapse}
        >
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/portfolios/stockPortfolio"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/portfolios/stockPortfolio"
              >
                Stock Portfolio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/portfolios/bondPortfolio"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/portfolios/bondPortfolio"
              >
                Bond Portfolio
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li className="nav-item">
        <div className="d-flex align-items-center justify-content-between">
          <Link
            className={
              router.pathname === "/insights"
                ? "nav-link btn active"
                : "nav-link"
            }
            href="/insights"
            onClick={() => {
              context.handleDropdownClick("insights");
            }}
          >
            <span className="menu-title">Model Insights</span>
          </Link>
          <button
            className="btn nav-link"
            data-bs-toggle="collapse"
            onClick={() => {
              context.handleDropdownClick("insights");
            }}
            aria-expanded={
              context.openDropdown === "insights" ? "true" : "false"
            }
            aria-controls="ui-basic"
          >
            <i className="menu-arrow"></i>{" "}
            <i className="mdi mdi-table-large menu-icon"></i>
          </button>
        </div>
        <div
          className={
            context.openDropdown === "insights"
              ? "collapse show"
              : "collapse"
          }
          id="ui-basic"
          ref={context.collapse}
        >
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/insights/videoes"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/insights/videoes"
              >
                Videos
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/insights/podcast"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/insights/podcast"
              >
                Podcast
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/insights/reports"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/insights/reports"
              >
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  router.pathname === "/insights/onePageReport"
                    ? "nav-link active"
                    : "nav-link"
                }
                href="/insights/onePageReport"
              >
                One Page Report
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li className="nav-item">
        <Link
          className={
            router.pathname === "/newsletter" ? "btn nav-link" : "nav-link"
          }
          data-bs-toggle="collapse"
          href="/newsletter"
          aria-expanded="false"
          aria-controls="general-pages"
        >
          <span className="menu-title">Newsletter</span>
          {/* <i className="menu-arrow"></i> */}
          <i className="mdi mdi-pen menu-icon"></i>
        </Link>
      </li>
    </ul>
  </nav>
    }
     
    </>
  );
}
