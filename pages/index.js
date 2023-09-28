import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../components/header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Home() {
   const router = useRouter()
   useEffect(()=>{
      router.push("/login")
   },[])
  return (
   <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="/js/jquery-appear.js" />
        <script src="/js/main.js" />
      </Head>

        <Header />
        <section className="tp-hero-area p-relative">
            <div className="tp-hero-wrapper-slider">
               <div className="tp-hero-active swiper-container">
                  <div className="swiper-wrapper">
                     <div className="swiper-slide pt-160 pb-115" data-bg-color="#16243E">
                        <div className="tp-hero-bg" data-background="assets/img/hero/shape-bg.png"></div>
                        <div className="container">
                           <div className="row">
                              <div className="col-lg-7">
                                 <div className="tp-hero-content p-relative">
                                    <div className="tp-hero-title-wrapper">
                                       <span className="tp-hero-subtitle">Be Invest</span>
                                       <h2 className="tp-hero-title">Invest with confidence harvest the rewards</h2>
                                       <p>And In Order To Make A Business, Brand Advertising And Marketing Plays An Important <br/> Role. Similarly, In Making Cultivation Business A Brand, Good Slogans Are Necessary.</p>
                                    </div>
                                    <div className="tp-hero-button-wrapper d-flex flex-wrap align-items-center">
                                       <div className="tp-hero-btn mr-30">
                                          <a className="tp-btn" href="contact.html">Get Started <span><i className="fa-regular fa-plus"></i></span></a>
                                       </div>
                                       <div className="tp-hero-call d-flex align-items-center">
                                         <span>
                                          <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M29.6887 13.0168H25.1079C25.1079 13.0168 27.5332 8.62052 27.9335 8.12946C28.3382 7.63298 28.7214 7.94264 28.758 8.38069C28.7945 8.81866 28.7397 15.1698 28.7397 15.1698M22.9387 15.2699C22.9387 15.2699 19.4019 15.3144 19.2343 15.2585C19.0667 15.2027 19.503 14.9077 21.8218 11.5945C22.2549 10.9757 22.4932 10.4537 22.5947 10.0163L22.6306 9.73512C22.6306 8.70778 21.7978 7.875 20.7705 7.875C19.8665 7.875 19.1132 8.51977 18.9453 9.37455" stroke="url(#paint0_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <path d="M32.7861 26.6714L29.7163 23.6016C28.7645 22.6497 27.2212 22.6497 26.2694 23.6016L23.6842 26.1867C21.5426 28.3284 18.0577 27.4539 13.7745 23.1708C9.49123 18.8875 8.61683 15.4026 10.7585 13.2611L13.3436 10.6759C14.2954 9.72406 14.2954 8.18084 13.3436 7.22902L10.2737 4.15918C9.32192 3.20736 7.7787 3.20736 6.82688 4.15918L4.24177 6.74429C-0.279393 11.2655 2.32723 20.3406 9.46592 27.4793C16.6046 34.618 25.6798 37.2246 30.201 32.7035L32.7862 30.1183C33.7379 29.1665 33.7379 27.6233 32.7861 26.6714Z" stroke="url(#paint1_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <path d="M34.2298 21.7512C35.2892 19.7749 35.8906 17.5164 35.8906 15.1172C35.8906 7.35068 29.5946 1.05469 21.8281 1.05469C19.4289 1.05469 17.1704 1.65614 15.1941 2.71554M32.7861 26.6715L29.7163 23.6017C28.7645 22.6498 27.2212 22.6498 26.2694 23.6017L23.6842 26.1868C21.5426 28.3285 18.0577 27.454 13.7745 23.1709C9.49123 18.8876 8.61683 15.4027 10.7585 13.2611L13.3436 10.676C14.2954 9.72415 14.2954 8.18093 13.3436 7.22911L10.2737 4.15927C9.32192 3.20745 7.7787 3.20745 6.82688 4.15927L4.24177 6.74437C-0.279393 11.2655 2.32723 20.3407 9.46592 27.4794C16.6046 34.6181 25.6798 37.2247 30.201 32.7035L32.7862 30.1184C33.7379 29.1665 33.7379 27.6234 32.7861 26.6715Z" stroke="url(#paint2_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <defs>
                                             <linearGradient id="paint0_linear_3043_11" x1="18.9453" y1="11.5808" x2="29.6887" y2="11.5808" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             <linearGradient id="paint1_linear_3043_11" x1="2" y1="19.1953" x2="33.5" y2="19.1953" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             <linearGradient id="paint2_linear_3043_11" x1="2" y1="18" x2="35.8906" y2="18" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             </defs>
                                          </svg>
                                         </span>
                                         <div className="tp-hero-call-inner">
                                          <p>Need help?</p>
                                          <span><a href="tel:5550111">(808) 555-0111</a></span>
                                         </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="col-lg-5">
                                 <div className="tp-hero-thumb p-relative">
                                    <div className="tp-hero-thumb-shape">
                                       <img className="shape-1" src="assets/img/hero/shape-2.png" alt=""/>
                                       <img className="shape-2" src="assets/img/hero/shape-1.png" alt=""/>
                                       <img className="shape-3" src="assets/img/hero/shape-1.png" alt=""/>
                                    </div>
                                    <img src="assets/img/hero/img-1.jpg" alt=""/>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="swiper-slide pt-160 pb-115" data-bg-color="#16243E">
                        <div className="tp-hero-bg" data-background="assets/img/hero/shape-bg.png"></div>
                        <div className="container">
                           <div className="row">
                              <div className="col-lg-7">
                                 <div className="tp-hero-content p-relative">
                                    <div className="tp-hero-title-wrapper">
                                       <span className="tp-hero-subtitle">Be Invest</span>
                                       <h2 className="tp-hero-title">Where your
                                          financial dreams
                                          become reality</h2>
                                       <p>And In Order To Make A Business, Brand Advertising And Marketing Plays An Important <br/> In Making Cultivation Business A Brand, Good Slogans Are Necessary.</p>
                                    </div>
                                    <div className="tp-hero-button-wrapper d-flex flex-wrap align-items-center">
                                       <div className="tp-hero-btn mr-30">
                                          <a className="tp-btn" href="contact.html">Get Started <span><i className="fa-regular fa-plus"></i></span></a>
                                       </div>
                                       <div className="tp-hero-call d-flex align-items-center">
                                         <span>
                                          <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M29.6887 13.0168H25.1079C25.1079 13.0168 27.5332 8.62052 27.9335 8.12946C28.3382 7.63298 28.7214 7.94264 28.758 8.38069C28.7945 8.81866 28.7397 15.1698 28.7397 15.1698M22.9387 15.2699C22.9387 15.2699 19.4019 15.3144 19.2343 15.2585C19.0667 15.2027 19.503 14.9077 21.8218 11.5945C22.2549 10.9757 22.4932 10.4537 22.5947 10.0163L22.6306 9.73512C22.6306 8.70778 21.7978 7.875 20.7705 7.875C19.8665 7.875 19.1132 8.51977 18.9453 9.37455" stroke="url(#paint0_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <path d="M32.7861 26.6714L29.7163 23.6016C28.7645 22.6497 27.2212 22.6497 26.2694 23.6016L23.6842 26.1867C21.5426 28.3284 18.0577 27.4539 13.7745 23.1708C9.49123 18.8875 8.61683 15.4026 10.7585 13.2611L13.3436 10.6759C14.2954 9.72406 14.2954 8.18084 13.3436 7.22902L10.2737 4.15918C9.32192 3.20736 7.7787 3.20736 6.82688 4.15918L4.24177 6.74429C-0.279393 11.2655 2.32723 20.3406 9.46592 27.4793C16.6046 34.618 25.6798 37.2246 30.201 32.7035L32.7862 30.1183C33.7379 29.1665 33.7379 27.6233 32.7861 26.6714Z" stroke="url(#paint1_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <path d="M34.2298 21.7512C35.2892 19.7749 35.8906 17.5164 35.8906 15.1172C35.8906 7.35068 29.5946 1.05469 21.8281 1.05469C19.4289 1.05469 17.1704 1.65614 15.1941 2.71554M32.7861 26.6715L29.7163 23.6017C28.7645 22.6498 27.2212 22.6498 26.2694 23.6017L23.6842 26.1868C21.5426 28.3285 18.0577 27.454 13.7745 23.1709C9.49123 18.8876 8.61683 15.4027 10.7585 13.2611L13.3436 10.676C14.2954 9.72415 14.2954 8.18093 13.3436 7.22911L10.2737 4.15927C9.32192 3.20745 7.7787 3.20745 6.82688 4.15927L4.24177 6.74437C-0.279393 11.2655 2.32723 20.3407 9.46592 27.4794C16.6046 34.6181 25.6798 37.2247 30.201 32.7035L32.7862 30.1184C33.7379 29.1665 33.7379 27.6234 32.7861 26.6715Z" stroke="url(#paint2_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <defs>
                                             <linearGradient id="paint0_linear_3043_11" x1="18.9453" y1="11.5808" x2="29.6887" y2="11.5808" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             <linearGradient id="paint1_linear_3043_11" x1="2" y1="19.1953" x2="33.5" y2="19.1953" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             <linearGradient id="paint2_linear_3043_11" x1="2" y1="18" x2="35.8906" y2="18" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             </defs>
                                          </svg>
                                         </span>
                                         <div className="tp-hero-call-inner">
                                          <p>Need help?</p>
                                          <span><a href="tel:5550111">(808) 555-0111</a></span>
                                         </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="col-lg-5">
                                 <div className="tp-hero-thumb p-relative">
                                    <div className="tp-hero-thumb-shape">
                                       <img className="shape-1" src="assets/img/hero/shape-2.png" alt=""/>
                                       <img className="shape-2" src="assets/img/hero/shape-1.png" alt=""/>
                                       <img className="shape-3" src="assets/img/hero/shape-1.png" alt=""/>
                                    </div>
                                    <img src="assets/img/hero/img-2.jpg" alt=""/>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="swiper-slide pt-160 pb-115" data-bg-color="#16243E">
                        <div className="tp-hero-bg" data-background="assets/img/hero/shape-bg.png"></div>
                        <div className="container">
                           <div className="row">
                              <div className="col-lg-7">
                                 <div className="tp-hero-content p-relative">
                                    <div className="tp-hero-title-wrapper">
                                       <span className="tp-hero-subtitle">Be Invest</span>
                                       <h2 className="tp-hero-title">Our mission is your financial success</h2>
                                       <p>And In Order To Make A Business, Brand Advertising And Marketing Plays An Important <br/> Role. Similarly, In Making Cultivation Business A Brand.</p>
                                    </div>
                                    <div className="tp-hero-button-wrapper d-flex flex-wrap align-items-center">
                                       <div className="tp-hero-btn mr-30">
                                          <a className="tp-btn" href="contact.html">Get Started <span><i className="fa-regular fa-plus"></i></span></a>
                                       </div>
                                       <div className="tp-hero-call d-flex align-items-center">
                                         <span>
                                          <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M29.6887 13.0168H25.1079C25.1079 13.0168 27.5332 8.62052 27.9335 8.12946C28.3382 7.63298 28.7214 7.94264 28.758 8.38069C28.7945 8.81866 28.7397 15.1698 28.7397 15.1698M22.9387 15.2699C22.9387 15.2699 19.4019 15.3144 19.2343 15.2585C19.0667 15.2027 19.503 14.9077 21.8218 11.5945C22.2549 10.9757 22.4932 10.4537 22.5947 10.0163L22.6306 9.73512C22.6306 8.70778 21.7978 7.875 20.7705 7.875C19.8665 7.875 19.1132 8.51977 18.9453 9.37455" stroke="url(#paint0_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <path d="M32.7861 26.6714L29.7163 23.6016C28.7645 22.6497 27.2212 22.6497 26.2694 23.6016L23.6842 26.1867C21.5426 28.3284 18.0577 27.4539 13.7745 23.1708C9.49123 18.8875 8.61683 15.4026 10.7585 13.2611L13.3436 10.6759C14.2954 9.72406 14.2954 8.18084 13.3436 7.22902L10.2737 4.15918C9.32192 3.20736 7.7787 3.20736 6.82688 4.15918L4.24177 6.74429C-0.279393 11.2655 2.32723 20.3406 9.46592 27.4793C16.6046 34.618 25.6798 37.2246 30.201 32.7035L32.7862 30.1183C33.7379 29.1665 33.7379 27.6233 32.7861 26.6714Z" stroke="url(#paint1_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <path d="M34.2298 21.7512C35.2892 19.7749 35.8906 17.5164 35.8906 15.1172C35.8906 7.35068 29.5946 1.05469 21.8281 1.05469C19.4289 1.05469 17.1704 1.65614 15.1941 2.71554M32.7861 26.6715L29.7163 23.6017C28.7645 22.6498 27.2212 22.6498 26.2694 23.6017L23.6842 26.1868C21.5426 28.3285 18.0577 27.454 13.7745 23.1709C9.49123 18.8876 8.61683 15.4027 10.7585 13.2611L13.3436 10.676C14.2954 9.72415 14.2954 8.18093 13.3436 7.22911L10.2737 4.15927C9.32192 3.20745 7.7787 3.20745 6.82688 4.15927L4.24177 6.74437C-0.279393 11.2655 2.32723 20.3407 9.46592 27.4794C16.6046 34.6181 25.6798 37.2247 30.201 32.7035L32.7862 30.1184C33.7379 29.1665 33.7379 27.6234 32.7861 26.6715Z" stroke="url(#paint2_linear_3043_11)" strokeWidth="2.10938" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                             <defs>
                                             <linearGradient id="paint0_linear_3043_11" x1="18.9453" y1="11.5808" x2="29.6887" y2="11.5808" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             <linearGradient id="paint1_linear_3043_11" x1="2" y1="19.1953" x2="33.5" y2="19.1953" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             <linearGradient id="paint2_linear_3043_11" x1="2" y1="18" x2="35.8906" y2="18" gradientUnits="userSpaceOnUse">
                                             <stop stopColor="#004D6E"/>
                                             <stop offset="1" stopColor="#00ACCC"/>
                                             </linearGradient>
                                             </defs>
                                          </svg>
                                         </span>
                                         <div className="tp-hero-call-inner">
                                          <p>Need help?</p>
                                          <span><a href="tel:5550111">(808) 555-0111</a></span>
                                         </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="col-lg-5">
                                 <div className="tp-hero-thumb p-relative">
                                    <div className="tp-hero-thumb-shape">
                                       <img className="shape-1" src="assets/img/hero/shape-2.png" alt=""/>
                                       <img className="shape-2" src="assets/img/hero/shape-1.png" alt=""/>
                                       <img className="shape-3" src="assets/img/hero/shape-1.png" alt=""/>
                                    </div>
                                    <img src="assets/img/hero/img-3.jpg" alt=""/>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="tp-hero-nav">
                  <button type="button" className="hero-button-prev-1"><i className="fa-regular fa-arrow-left"></i>
                  </button>
                  <button type="button" className="hero-button-next-1"><i className="fa-regular fa-arrow-right"></i>
                  </button>
               </div>
               <div className="tp-hero-pagination"></div>
            </div>
         </section>
      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      </>
  );
}
