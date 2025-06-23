import { createContext, useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Loader from "../components/loader";
import { decodeJWT } from "../utils/utils";
import Swal from "sweetalert2";
import { getRoleFromToken } from "../utils/auth";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [marketAnalytics, setMarketAnalytics] = useState(false);
  const [compareStocks, setCompareStocks] = useState(false);
  const [stockMenu, setStockMenu] = useState(false);
  const [insights, setInsights] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const collapse = useRef("");
  const [businessActivity, setBusinessActivity] = useState(false);
  const [background, setBackground] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [accessToken, setAccessToken] = useState(false);
  const [userName, setUserName] = useState("");
  const [formattedBotData, setFormattedBotData] = useState(null);
  const router = useRouter();
  const toggleMarketAnalytics = () => {
    if (marketAnalytics) {
      setMarketAnalytics(false);
    } else {
      setMarketAnalytics(true);
    }
  };
  const toggleStockMenu = () => {
    if (stockMenu) {
      setStockMenu(false);
    } else {
      setStockMenu(true);
    }
  };
  const toggleCompareStock = () => {
    if (compareStocks) {
      setCompareStocks(false);
    } else {
      setCompareStocks(true);
    }
  };
  const toggleInsights = () => {
    if (insights) {
      setInsights(false);
    } else {
      setInsights(true);
    }
  };
  const toggleBusinessActivity = () => {
    if (businessActivity) {
      setBusinessActivity(false);
    } else {
      // setBusinessActivity(true)
    }
  };
  const checkLoginStatus = () => {
    let token = localStorage.getItem("access_token");
    if (token) {
      const { userID, exp, name } = decodeJWT(token);
      const time = new Date();
      const expDate = new Date(exp * 1000);
      if (expDate > time) {
        setAccessToken(token);
        setUserName(name);
        if (router.route == "/login") {
          if (getRoleFromToken() == "internal") {
            router.push("/admin");
          } else {
            router.push("/User/dashboard");
          }
        }
      } else {
        Swal.fire("Your session has been expired");
        localStorage.setItem("access_token", "");
        router.push("/login");
      }
    } else {
      localStorage.setItem("route", router.route);
      router.push("/login");
    }
  };
  const logOut = () => {
    localStorage.setItem("access_token", "");
    router.push("/login");
  };
  const handleDropdownClick = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  useEffect(() => {
    const handleStart = () => {
      setLoaderState(true);
    };
    const handleComplete = () => {
      setLoaderState(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  useEffect(() => {
    checkLoginStatus();
  }, [router.route == "/login"]);
  useEffect(() => {
    if (!loaderState) {
      document.body.classList.remove("sidebar-icon-only");
    }
  }, [loaderState]);
  // const showMenu = (e)=>{
  //   if(e.target.getAttribute('aria-expanded') == "false"){
  //     e.target.setAttribute('aria-expanded',"true");
  //   }
  //   else{
  //     e.target.setAttribute('aria-expanded',"false");
  //   }
  //   let elem = collapse.current
  //   elem.classList.toggle("show")
  // }

  const noLayoutRoutes = ["/login", "/register", "/verify-otp"];
  const isNoLayoutRoute = noLayoutRoutes.includes(router.pathname);

  console.log("loaderState", loaderState);

  return (
    <Context.Provider
      value={{
        collapse,
        setMarketAnalytics,
        marketAnalytics,
        setCompareStocks,
        toggleMarketAnalytics,
        stockMenu,
        setStockMenu,
        toggleStockMenu,
        compareStocks,
        toggleCompareStock,
        loaderState,
        setLoaderState,
        insights,
        setInsights,
        toggleInsights,
        toggleBusinessActivity,
        businessActivity,
        setBusinessActivity,
        logOut,
        background,
        setBackground,
        openDropdown,
        setOpenDropdown,
        handleDropdownClick,
        accessToken,
        userName,
        formattedBotData,
        setFormattedBotData,
      }}
    >
      {isNoLayoutRoute ? children : <Layout>{children}</Layout>}
      <Loader />
    </Context.Provider>
  );
};
