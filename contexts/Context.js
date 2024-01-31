import { createContext, useEffect, useState, useContext,useRef } from "react";
import {useRouter} from 'next/router'

export const Context = createContext()

export const ContextProvider = ({ children }) =>{
  const [marketAnalytics,setMarketAnalytics] = useState(false)
  const [compareStocks,setCompareStocks] = useState(false)
  const [stockMenu,setStockMenu] = useState(false)
  const [insights,setInsights] = useState(false)
  const [loaderState,setLoaderState] = useState(false)
  const collapse = useRef("")
  const toggleMarketAnalytics = ()=>{
    if(marketAnalytics){
      setMarketAnalytics(false)
    }
    else{
      setMarketAnalytics(true)
    }
  }
  const toggleStockMenu = ()=>{
    if(stockMenu){
      setStockMenu(false)
    }
    else{
      setStockMenu(true)
    }
  }
  const toggleCompareStock = ()=>{
    if(compareStocks){
      setCompareStocks(false)
    }
    else{
      setCompareStocks(true)
    }
  }
  const toggleInsights = ()=>{
    if(insights){
      setInsights(false)
    }
    else{
      setInsights(true)
    }
  }
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
    return (
        <Context.Provider value={{collapse,setMarketAnalytics,marketAnalytics,toggleMarketAnalytics,stockMenu,setStockMenu,toggleStockMenu,compareStocks,toggleCompareStock,loaderState,setLoaderState,insights,setInsights,toggleInsights}}>
          {children}
        </Context.Provider>
      )
}