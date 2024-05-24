import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useState, useEffect, useContext } from 'react';
import React from 'react'
import { Pagination } from '../../components/Pagination';

export default function SaveSecurities() {
    const [metaDataType, setMetaDataType] = useState("")
    const [allStockData, setStockData] = useState([])
    const [allStockDataFiltered, setStockDataFiltered] = useState([])
    const [allFavoriteStockData, setFavoriteStockData] = useState([])
    const [allFavoriteStockDataFiltered, setFavoriteStockDataFiltered] = useState([])
    const [allBonds, setAllBonds] = useState([])
    const [allBondsFiltered, setAllBondsFiltered] = useState([])
    const [allFavoriteBonds, setAllFavoriteBonds] = useState([])
    const [allFavoriteBondsFiltered, setAllFavoriteBondsFiltered] = useState([])
    const [stockCurrentPage,setStockCurrentPage] = useState(1)
    const [favStockCurrentPage,setFavStockCurrentPage] = useState(1)
    const [bondCurrentPage,setBondCurrentPage] = useState(1)
    const [favBondCurrentPage,setFavBondCurrentPage] = useState(1)
    const [limit,setLimit] = useState(25)
    const handleChange = (e) => {
        setMetaDataType(e.target.value)
        fetchAllBonds()
        fetchAllFavoriteBonds()
    }
    const fetchAllStockData = async () => {
        // const findAllStocks = fetchAllBonds
        // const findAllStocksRes = await findAllStocks.json()
        // setStockData(findAllStocksRes)
    }
    const fetchAllFavoriteStockData = async () => {
        const findAllFavoriteStocks = await fetch("https://jharvis.com/JarvisV2/findAllStocks")
        const findAllFavoriteStocksRes = await findAllStocks.json()
        setFavoriteStockData(findAllFavoriteStocksRes)
    }
    const fetchAllBonds = async () => {
    const findAllBonds = await fetch("https://jharvis.com/JarvisV2/findAllBonds")
    const findAllBondsRes = await findAllBonds.json()
    setAllBonds(findAllBondsRes)
    setAllBondsFiltered(sliceData(findAllBondsRes,bondCurrentPage))
    }
    const fetchAllFavoriteBonds = async () => {
        const findAllFavoriteBonds = await fetch("https://jharvis.com/JarvisV2/findAllFavoriteBonds?userid=2")
        const findAllFavoriteBondsRes = await findAllFavoriteBonds.json()
        setAllFavoriteBonds(findAllFavoriteBondsRes)
        setAllFavoriteBondsFiltered(sliceData(allFavoriteBonds,favBondCurrentPage))
    }
    const handleShow = () => {

    }
    const handleAllStockPage = (action)=>{
        switch (action) {
            case 'prev':
                setStockCurrentPage(stockCurrentPage - 1)
                break;
                case 'next':
                    setStockCurrentPage(stockCurrentPage + 1)
                break;
            default:
                setStockCurrentPage(stockCurrentPage)
                break;
        }
    }
    const handleFavStockPage = (action)=>{
        switch (action) {
            case 'prev':
                setFavStockCurrentPage(favStockCurrentPage - 1)
                break;
                case 'next':
                    setFavStockCurrentPage(favStockCurrentPage + 1)
                break;
            default:
                setFavStockCurrentPage(favStockCurrentPage)
                break;
        }
    }
    const handleBondsPage = (action)=>{
        switch (action) {
            case 'prev':
                setBondCurrentPage(bondCurrentPage - 1)
                break;
                case 'next':
                    setBondCurrentPage(bondCurrentPage + 1)
                break;
            default:
                setBondCurrentPage(bondCurrentPage)
                break;
        }
    }
    const handleFavBondsPage = (action)=>{
        switch (action) {
            case 'prev':
                setFavBondCurrentPage(favBondCurrentPage - 1)
                break;
                case 'next':
                    setFavBondCurrentPage(favBondCurrentPage + 1)
                break;
            default:
                setFavBondCurrentPage(favBondCurrentPage)
                break;
        }
    }
    const sliceData = (data,currentPage)=>{
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
       return data.slice(startIndex, endIndex);
    }
    useEffect(() => {
        allBonds.length > 0 && setAllBondsFiltered(sliceData(allBonds,bondCurrentPage))
    }, [bondCurrentPage])
    useEffect(() => {
        allFavoriteBonds.length > 0 && setAllFavoriteBondsFiltered(sliceData(allFavoriteBonds,bondCurrentPage))
    }, [favBondCurrentPage])
    return (
        <>
            <div className="container-scroller">
                <Navigation />
                <div className="container-fluid page-body-wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <div className="page-header">
                                <h3 className="page-title">
                                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                                        <i className="mdi mdi-home"></i>
                                    </span>Saved Securities
                                </h3>
                            </div>
                            <div className="selection-area mb-3">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Meta Data Type</label>
                                            <select name="portfolio_name" className='form-select' value={metaDataType} onChange={handleChange}>
                                                <option>Please Select</option>
                                                <option value="Stocks">Stocks</option>
                                                <option value="Bonds">Bonds</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="actions">
                                            <button className='btn btn-primary' onClick={() => { }}>Update</button>
                                        </div>
                                    </div>
                                </div>
                                {
                                    metaDataType == "Stocks" &&
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card p-3">
                                                <div className="d-flex justify-content-between">
                                                    <h5>All Stocks: </h5>
                                                    <div className="form-group d-flex align-items-center">
                                                        <label htmlFor="" className='me-2'>Search:</label>
                                                        <input type="text" className='form-control' />
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Symbol</th>
                                                                <th>Company</th>
                                                                <th>Sector</th>
                                                                <th>Industry</th>
                                                                <th>Country</th>
                                                                <th>Market Capital</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                allStockData.map((item,index)=>{
                                                                    return  <tr key={"stock"+index}>
                                                                        <td>{item?.stockName}</td>
                                                                        <td>{item?.company}</td>
                                                                        <td>{item?.sector}</td>
                                                                        <td>{item?.industry}</td>
                                                                        <td>{item?.country}</td>
                                                                        <td>{item?.marketCapital}</td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Pagination currentPage={stockCurrentPage} totalItems={allStockData} limit={limit} setCurrentPage={setStockCurrentPage} handlePage={handleAllStockPage}/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card p-3">
                                                <div className="d-flex justify-content-between">
                                                    <h5>Favourite Stocks: </h5>
                                                    <div className="form-group d-flex align-items-center">
                                                        <label htmlFor="" className='me-2'>Search:</label>
                                                        <input type="text" className='form-control' />
                                                    </div>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Symbol</th>
                                                                <th>Company</th>
                                                                <th>Sector</th>
                                                                <th>Industry</th>
                                                                <th>Country</th>
                                                                <th>Market Capital</th>
                                                                <th>Avg Annual P/E</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                allFavoriteStockData.map((item,index)=>{
                                                                    return <tr key={"favStock"+index}>
                                                                        <td>{item?.stockName}</td>
                                                                        <td>{item?.company}</td>
                                                                        <td>{item?.country}</td>
                                                                        <td>{item?.marketCapital}</td>
                                                                        <td>{item?.avgAnnualPE}</td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    metaDataType == "Bonds" &&
                                    <div className="row">
                                        <div className="col-md-6">
                                        <div className="card p-3">
                                        <div className="d-flex justify-content-between">
                                                    <h5>All Bonds: </h5>
                                                    <div className="form-group d-flex align-items-center">
                                                        <label htmlFor="" className='me-2'>Search:</label>
                                                        <input type="text" className='form-control' />
                                                    </div>
                                                </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Issuer Name</th>
                                                            <th>Bond Type</th>
                                                            <th>YTM</th>
                                                            <th>Coupon</th>
                                                            <th>Matuirity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            allBondsFiltered.map((item,index)=>{
                                                                return <tr key={"bond"+index}>
                                                                    <td>{item?.issuerName}</td>
                                                                    <td>{item?.type}</td>
                                                                    <td>{item?.ytm}</td>
                                                                    <td>{item?.coupon}</td>
                                                                    <td>{item?.maturity}</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Pagination currentPage={bondCurrentPage} totalItems={allBonds} limit={limit} setCurrentPage={setBondCurrentPage} handlePage={handleBondsPage}/>
                                        </div>    
                                        </div>
                                        <div className="col-md-6">
                                        <div className="card p-3">
                                        <div className="d-flex justify-content-between">
                                                    <h5>Favourite Bonds: </h5>
                                                    <div className="form-group d-flex align-items-center">
                                                        <label htmlFor="" className='me-2'>Search:</label>
                                                        <input type="text" className='form-control' />
                                                    </div>
                                                </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Issuer Name</th>
                                                            <th>Bond Type</th>
                                                            <th>YTM</th>
                                                            <th>Coupon</th>
                                                            <th>Matuirity</th>
                                                            <th>Cusio No</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            allFavoriteBondsFiltered.map((item,index)=>{
                                                                return <tr key={"favBond"+index}>
                                                                    <td>{item?.issuerName}</td>
                                                                    <td>{item?.type}</td>
                                                                    <td>{item?.ytm}</td>
                                                                    <td>{item?.coupon}</td>
                                                                    <td>{item?.maturity}</td>
                                                                    <td><input type="text" className='form-control'/></td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <Pagination currentPage={favBondCurrentPage} totalItems={allFavoriteBonds} limit={limit} setCurrentPage={setFavBondCurrentPage} handlePage={handleFavBondsPage}/>
                                        </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
