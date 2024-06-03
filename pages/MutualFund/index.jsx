import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import { formatDate, searchTable } from '../../utils/utils';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
export default function MutualFund() {
    const [mutualFund, setMutualFund] = useState([])
    const [mutualFundFiltered, setMutualFundFiltered] = useState([])
    const [limit, setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [tickers, setTickers] = useState([]);
    const [navValue, setNavValue] = useState("")
    const fetchMutualFund = async () => {
        try {
            const getMutualFund = await fetch("https://jharvis.com/JarvisV2/getAllMutualFund?_=1716649829527")
            const getMutualFundRes = await getMutualFund.json()
            setMutualFund(getMutualFundRes)
            setMutualFundFiltered(getMutualFundRes)
        }
        catch (e) {

        }
    }
    const filter = (e) => {
        const value = e.target.value;
        setMutualFundFiltered(searchTable(mutualFund, value))
    }
    const handlePage = async (action) => {
        switch (action) {
            case 'prev':
                setCurrentPage(currentPage - 1)
                break;
            case 'next':
                setCurrentPage(currentPage + 1)
                break;
            default:
                setCurrentPage(currentPage)
                break;
        }
    };
    const fetchTickersFunc = async () => {
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1716787665088")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
    }
    const fetchAllNav = async () => {
        try {
            const getAllNav = await fetch("https://jharvis.com/JarvisV2/getAllNav?_=1716873949438")
            const getAllNavRes = await getAllNav.json()
            setNavValue(getAllNavRes.nav)
        }
        catch (e) {

        }
    }
    const handleNavValue = (e) => {
        setNavValue(e.target.value)
    }
    const getStockPriceCheck = async () => {
        try {
            const stockPrice = await fetch("https://jharvis.com/JarvisV2/getStockPriceCheck?_=1716883270435")
            const stockPriceRes = await stockPrice.json()
            alert(stockPriceRes.msg)
        }
        catch (e) {

        }
    }
    const getBondPriceCheck = async () => {
        try {
            const bondPrice = await fetch("https://jharvis.com/JarvisV2/getBondPriceCheck?_=1716883270437")
            const bondPriceRes = await bondPrice.json()
            alert(bondPriceRes.msg)
        }
        catch (e) {

        }

    }
    const createNav = async (e) => {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        try {
            const response = await fetch('https://jharvis.com/JarvisV2/createNav', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.msg)
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }
    const createMutualFund = async (e) => {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        try {
            const response = await fetch('https://jharvis.com/JarvisV2/createMutualFund', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.msg)
                form.reset()
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        async function run() {
            if (mutualFund.length > 0) {
                const items = await SliceData(currentPage, limit, mutualFund);
                setMutualFundFiltered(items)
            }
        }
        run()
    }, [currentPage, mutualFund])
    useEffect(() => {
        fetchTickersFunc()
        fetchMutualFund()
        fetchAllNav()
    }, [])
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Mutual Fund
                        </h3>
                    </div>
                    <div className="mb-3">
                        <form onSubmit={createNav}>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Name of Fund</label>
                                        <input type="text" name="nameFund" value="Left Brain Compound Growth Fund" readOnly="readonly" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Nav</label>
                                        <input type="text" name="nav" value={navValue} onChange={handleNavValue} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button type='submit' className="btn btn-primary me-3">Submit</button>
                                    <button type='button' className="btn btn-primary me-3" onClick={getStockPriceCheck}>Stock Price Check</button>
                                    <button type='button' className="btn btn-primary me-3" onClick={getBondPriceCheck}>Bond Price Check</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="mb-3">
                        <form onSubmit={createMutualFund}>
                            <div className="row align-items-center">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Type</label>
                                        <select name="type" className='form-select' required>
                                            <option value="">--Select--</option>
                                            <option value="Stock">Stock</option>
                                            <option value="Bond">Bond</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Security</label>
                                        <select name="tickerName" className='form-select' required>
                                            <option value="">--Select Ticker--</option>
                                            {tickers.map((item, index) => (
                                                <option key={index} value={item?.element1}>
                                                    {item?.element1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">No of Shares</label>
                                        <input type="text" className='form-control' name="numberShare" required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Price/Shares</label>
                                        <input type="text" className='form-control' name='priceShare' required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="">Date</label>
                                        <input type="date" className='form-control' name='mutualDate' required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-primary" type='submit'>Evaluate</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Security</th>
                                    <th>No of Shares</th>
                                    <th>Price/Shares</th>
                                    <th>Total Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    mutualFundFiltered.map((item, index) => {
                                        return <tr key={"fund" + index}>
                                            <td>{item?.type}</td>
                                            <td>{item?.tickerName}</td>
                                            <td>{item?.numberShare}</td>
                                            <td>{item?.priceShare}</td>
                                            <td>{item?.totalPrice}</td>
                                            <td>{item?.mutualDate && formatDate(item?.mutualDate)}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {mutualFund.length > 0 && <Pagination currentPage={currentPage} totalItems={mutualFund} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
        </>
    )
}
