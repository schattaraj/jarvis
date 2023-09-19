import Link from 'next/link';

const Header = () => {
  return (<>
   <header className="tp-header-area p-relative">
         <div className="tp-header-box p-relative">
            <div className="tp-header-logo p-relative">
               <span className="tp-header-logo-bg"></span>
               <a href="index-2.html">
                  <img src="assets/img/logo/logo.png" alt="" />
               </a>
            </div>
            <div className="tp-header-wrapper-inner header__sticky p-relative">
               <div className="tp-header-top d-none d-xl-flex">
                  <div className="tp-header-top-info">
                     <a href="https://www.google.com/maps/search/6391+Elgin+St,+Wilmington,+DE,+USA/@39.7298967,-75.5645038,13z/data=!3m1!4b1" target="_blank"><span><i className="fa-sharp fa-solid fa-location-dot"></i></span>6391 Elgin St. Celina, 10299</a>
                  </div>
                  <div className="tp-header-top-right d-flex justify-content-end align-items-center">
                     <div className="header-social ">
                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#"><i className="fa-brands fa-twitter"></i></a>
                        <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                     </div>
                  </div>
               </div>
               <div className="tp-header-main-menu d-flex align-items-center justify-content-between">
                  <div className="tp-main-menu d-none d-xl-block">
                     <nav className="tp-main-menu-content">
                        <ul>
                           <li className="has-dropdown">
                              <a href="index-2.html">Home</a>
                              <div className="tp-submenu submenu has-homemenu">
                                 <div className="row gx-6 row-cols-1 row-cols-md-2 row-cols-xl-3">
                                    <div className="col homemenu">
                                       <div className="homemenu-thumb mb-15">
                                          <img src="assets/img/menu/img-1.jpg" alt=""/>
                                          <div className="homemenu-btn">
                                             <a className="menu-btn show-1" href="index-2.html">Multi Page</a> <br/>
                                             <a className="menu-btn show-2" href="index1-one-page.html">One Page</a>
                                          </div>
                                       </div>
                                       <div className="homemenu-content text-center">
                                          <h4 className="homemenu-title">
                                             <a href="index-2.html">Home 01</a>
                                          </h4>
                                       </div>
                                    </div>
                                    <div className="col homemenu">
                                       <div className="homemenu-thumb mb-15">
                                          <img src="assets/img/menu/img-2.jpg" alt=""/>
                                          <div className="homemenu-btn">
                                             <a className="menu-btn show-1" href="index-3.html">Multi Page</a> <br/>
                                             <a className="menu-btn show-2" href="index2-one-page.html">One Page</a>
                                          </div>
                                       </div>
                                       <div className="homemenu-content text-center">
                                          <h4 className="homemenu-title">
                                             <a href="index-3.html">Home 02</a>
                                          </h4>
                                       </div>
                                    </div>
                                    <div className="col homemenu">
                                       <div className="homemenu-thumb mb-15">
                                          <img src="assets/img/menu/img-3.jpg" alt=""/>
                                          <div className="homemenu-btn">
                                             <a className="menu-btn show-1" href="index-4.html">Multi Page</a> <br/>
                                             <a className="menu-btn show-2" href="index3-one-page.html">One Page</a>
                                          </div>
                                       </div>
                                       <div className="homemenu-content text-center">
                                          <h4 className="homemenu-title">
                                             <a href="index-4.html">Home 03</a>
                                          </h4>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </li>
                           <li><a href="about.html">About Us</a></li>
                           <li className="has-dropdown"><a href="service.html">Services</a>
                              <ul className="submenu">
                                 <li><a href="service.html">Service</a></li>
                                 <li><a href="service-details.html">Service Details</a></li>
                              </ul>
                           </li>
                           <li className="has-dropdown">
                              <a href="index-2.html">Page</a>
                              <ul className="submenu">
                                 <li><a href="project.html">Project</a></li>
                                 <li><a href="project-details.html">Project Details</a></li>
                                 <li><a href="team.html">Team</a></li>
                                 <li><a href="team-details.html">Team Details</a></li>
                                 <li><a href="faq.html">Faq</a></li>
                              </ul>
                           </li>
                           <li className="has-dropdown"><a href="blog-classic.html">Blog</a>
                              <ul className="submenu">
                                 <li><a href="blog-classic.html">Blog</a></li>
                                 <li><a href="blog-details.html">Blog Details</a></li>
                              </ul>
                           </li>
                           <li><a href="contact.html">Contact</a></li>
                        </ul>
                     </nav>
                  </div>
                  <div className="tp-header-main-right d-flex align-items-center justify-content-xl-end">
                     <div className="tp-header-contact d-xl-flex align-items-center d-none">
                        <div className="tp-header-contact-search search-open-btn d-none d-xxl-block">
                           <span><i className="fa-solid fa-magnifying-glass"></i></span>
                        </div>
                        <div className="tp-header-contact-inner d-flex align-items-center">
                           <div className="tp-header-contact-icon">
                              <span><i className="fa-solid fa-phone"></i></span>
                           </div>
                           <div className="tp-header-contact-content">
                              <p>Requesting A Call:</p>
                              <span><a href="tel:555-0111">(629) 555-0129</a></span>
                           </div>
                        </div>
                     </div>
                     <div className="tp-header-sticky-hamburger d-xl-none offcanvas-open-btn">
                        <button className="hamburger-btn">
                           <span></span>
                           <span></span>
                           <span></span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div className="tp-header-btn">
               <a className="tp-btn d-none d-xl-block" href="contact.html">Get a quote <i className="fa-regular fa-arrow-right"></i></a>
               <div className="tp-header-main-right-hamburger-btn d-xl-none offcanvas-open-btn">
                  <button className="hamburger-btn">
                     <span></span>
                     <span></span>
                     <span></span>
                  </button>
               </div>
            </div>
         </div>
      </header>
  </>
  )
}

export default Header;