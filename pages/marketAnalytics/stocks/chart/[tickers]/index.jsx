import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import HightChart from '../../../../../components/HighChart'
import Breadcrumb from '../../../../../components/Breadcrumb'
import { Context } from '../../../../../contexts/Context'
import { fetchWithInterceptor } from '../../../../../utils/utils'
import Select from 'react-select'
import { FilterAlt } from '@mui/icons-material'
import { Modal } from 'react-bootstrap'
const Charts = () => {
  const router = useRouter()
  const [ViewOptions, setViewOptions] = useState({
    element3: { name: "rankWithInTable", displayName: "Rank Within Table" },
    element32: { name: "enterPriseValue", displayName: "Enterprise value($M)" },
    element33: { name: "priceSale", displayName: "Price / Sales" },
    element34: { name: "grossMargin", displayName: "Gross Margin" },
    element35: { name: "roic", displayName: "ROIC" },
    element9: { name: "priceAvg", displayName: "Price vs 20-day Avg (%)" },
    element10: { name: "price", displayName: "Price" },
    element11: { name: "ytdReturn", displayName: "YTD Return" },
    element12: { name: "dividendYield", displayName: "Dividend Yield" },
    element13: { name: "shortFloat", displayName: "Short as % of Float" },
    element18: { name: "relativeStrength", displayName: "Relative Strength" },
    element22: { name: "priceEarning", displayName: "Price/Earnings" },
    element26: { name: "evEbitda", displayName: "EV / EBITDA" },
  })
  const [selectedView, setSelectedView] = useState('element3')
  const [chartHistory, setChartHistory] = useState([])
  const [dateRange, setDateRange] = useState({ startDate: 2023, endDate: 2025 })
  const [selectedTicker,setSelectedTicker] = useState("")
  const [tickers, setTickers] = useState(false);
  const [dateModal, setDateModal] = useState(false)
  const context = useContext(Context)

  const charts = async () => {
    // setIsExpanded(false)
    // if (!selectedTicker || selectedTicker.length == 0) {
    //   Swal.fire({ title: "Please Select a Ticker", confirmButtonColor: "#719B5F" });
    //   return;
    // }
    context.setLoaderState(true)
    try {
      const payload = {
        ticker: selectedTicker,
        year: dateRange?.startDate,
        year2: dateRange?.endDate,
        metadataName: 'Tickers_Watchlist',
        _: new Date().getTime() // This will generate a unique timestamp
      };
      const queryString = new URLSearchParams(payload).toString();
      // const getChartHistrory = await fetch(`https://jharvis.com/JarvisV2/getChartForHistoryByTicker?${queryString}`)
      // const getChartHistroryRes = await getChartHistrory.json()
      const api = `/api/proxy?api=getChartForHistoryByTicker?${queryString}`
      const getChartHistroryRes = await fetchWithInterceptor(api, false)
      setChartHistory(getChartHistroryRes)
      // setActiveView("Chart View")
      // setTableData(getChartHistroryRes)
      // setFilterData(getChartHistroryRes)
      setDateModal(false)
    }
    catch (e) {
      console.log("Error", e)
    }
    context.setLoaderState(false)
  }
  const handleSelect = (inputs) => {
    let arr = inputs.map((item) => item.value)
    setSelectedTicker(arr.join(","))
}
const handleDateRange = (e) => {
  setDateRange({ ...dateRange, [e.target.name]: Number(e.target.value) })
}
const getHistoryByTicker = async () => {
  if (!selectedTicker) {
      Swal.fire({ title: "Please Select a ticker", confirmButtonColor: "#719B5F" });
      return;
  }
  context.setLoaderState(true)
  try {
      // const getBonds = await fetch(`https://jharvis.com/JarvisV2/getHistoryByTickerWatchList?metadataName=Tickers_Watchlist&ticker=${selectedTicker}&_=1722333954367`)
      // const getBondsRes = await getBonds.json()
      const getBonds = `/api/proxy?api=getHistoryByTickerWatchList?metadataName=Tickers_Watchlist&ticker=${selectedTicker}&_=1722333954367`
      const getBondsRes = await fetchWithInterceptor(getBonds,false)
      setTableData(getBondsRes)
      setFilterData(getBondsRes)
      setActiveView("Ticker Home")

  }
  catch (e) {
      console.log("error", e)
  }
  context.setLoaderState(false)
}
const handleChartView = (e) => {
  setSelectedView(e.target.value)
}
const fetchTickersFunc = async () => {
  try {
      const fetchTickers = `/api/proxy?api=getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496`
      const fetchTickersRes = await fetchWithInterceptor(fetchTickers,false)
      setTickers(fetchTickersRes)
  }
  catch (e) {
console.log("Error [tickers].jsx",e);
  }
}

  useEffect(() => {
    console.log("router", router?.query?.tickers)
    setSelectedTicker(router?.query?.tickers)
  }, [router])
  useEffect(()=>{
    if(selectedTicker){
      charts()
    }
    if(!tickers){
      fetchTickersFunc()
    }
  },[selectedTicker])
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <Breadcrumb />
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-end flex-wrap mb-3 w-50">
                            <Select className='mb-0 me-2 col-md-3 flex-grow-1' isMulti value={selectedTicker && selectedTicker.split(",").map((item) => ({ value: item, label: item }))} onChange={handleSelect} style={{ minWidth: "200px", maxWidth: "300px",flex:"2" }} options={
                                tickers ? tickers.map((item, index) => (
                                    { value: item.element1, label: item.element1 }
                                ))
                                : [{value:"Loading",label:"Loading..."}]
                            } />
                            <div className="actions flex-grow-1">
                                <button className={"btn btn-primary mb-0"} type="button" onClick={getHistoryByTicker}><span>Go</span></button>
                            </div>
                           
          </div>
          <div className="w-50">
          <div className="form-group d-flex align-items-center">
            <label htmlFor="" className='me-2 mb-0 form-label'>Chart View:</label>
            <select className='form-select' style={{ maxWidth: "300px" }} onChange={handleChartView}>
              {
                Object.entries(ViewOptions).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.displayName}
                  </option>
                ))
              }
            </select>
            <button className='ms-2 btn btn-primary' onClick={charts}>GO</button>

          </div>
        
          </div>
          </div>
          <div className="d-flex align-items-center justify-content-center mx-2 mb-2">
                                    <label className='mb-0'><b>{`Year : ${dateRange?.startDate} - ${dateRange?.endDate}`}</b></label>
                                    <button className='ms-2 btn p-0 text-primary' onClick={() => { setDateModal(true) }} type='button'><FilterAlt /></button>
          </div>
          {chartHistory.length > 0 && <HightChart data={chartHistory?.map((item) => [new Date(item['lastUpdatedAt']).getTime(), parseFloat(item[selectedView])])} title={selectedView && `Chart View For ${ViewOptions[selectedView].displayName}`} />}
        </div>
      </div>
      <Modal show={dateModal} onHide={() => { setDateModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Chart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="startDate">Start Date</label>
                                <select name="startDate" id="startDate" className='form-select' value={dateRange?.startDate} onChange={handleDateRange}>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="endDate">End Date</label>
                                <select name="endDate" id="endDate" className='form-select' value={dateRange?.endDate} onChange={handleDateRange}>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={charts}>Apply</button>
                </Modal.Footer>
            </Modal>
    </>
  )
}

export default Charts