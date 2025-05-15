// import "../styles/css/bootstrap.css"
// import "../styles/css/animate.css"
// import "../styles/css/magnific-popup.css"
// import "../styles/css/slick.css"
// import "../styles/css/spacing.css"
// import "../styles/css/swiper-bundle.css"
// import "../styles/css/main.css"
import "../styles/app.scss"
import "../styles/chatbot.css"
import { ContextProvider } from '../contexts/Context';
export default function App({ Component, pageProps }) {
  return   <ContextProvider>
    <Component {...pageProps} />
    </ContextProvider>
}
