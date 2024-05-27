import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import { formatDate, searchTable } from '../../utils/utils';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
export default function MutualFund() {
    const [mutualFund, setMutualFund] = useState([])
    const [mutualFundFiltered, setMutualFundFiltered] = useState([])
    const [limit,setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [tickers,setTickers] = useState([]);
    const fetchMutualFund = async () => {
        const getMutualFund = await fetch("https://jharvis.com/JarvisV2/getAllMutualFund?_=1716649829527")
        const getMutualFundRes = await getMutualFund.json()
        setMutualFund(getMutualFundRes)
        setMutualFundFiltered(getMutualFundRes)
    }
    const filter = (e) => {
        const value = e.target.value;
        setMutualFundFiltered(searchTable(mutualFund,value))
    }
    const handlePage = async(action) => {
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
      const fetchTickersFunc = async()=>{
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1716787665088")
            const fetchTickersRes = await fetchTickers.json() 
            setTickers(fetchTickersRes) 
        }
        catch (e) {

        }
    }
      useEffect(()=>{
        async function run(){
            if(mutualFund.length > 0){
                // console.log("tableData",tableData)
                const items = await SliceData(currentPage, limit, mutualFund);
                // console.log("items",items)
                setMutualFundFiltered(items)
            }     
        }
        run() 
      },[currentPage,mutualFund])  
    useEffect(() => {
        fetchTickersFunc()
        fetchMutualFund()
    }, [])
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
                                    </span>Mutual Fund
                                </h3>
                            </div>
                            <div className="mb-3">
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
                                            <input type="text" name="nav" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary me-3">Submit</button>
                                        <button className="btn btn-primary me-3">Stock Price Check</button>
                                        <button className="btn btn-primary me-3">Bond Price Check</button>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                    <div className="form-group">
                                    <label htmlFor="">Type</label>
                                    <select name="" className='form-select'>
                                        <option value="">--Select--</option>
                                        <option value="Stock">Stock</option>
                                        <option value="Bond">Bond</option>
                                    </select>
                                </div>
                                    </div>
                                    <div className="col-md-4">
                                    <div className="form-group">
                                    <label htmlFor="">Security</label>
                                    <select name="" className='form-select'>
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
                                    <input type="text" className='form-control' />
                                </div>
                                    </div>
                                    <div className="col-md-4">
                                    <div className="form-group">
                                    <label htmlFor="">Price/Shares</label>
                                    <input type="text" className='form-control' />
                                </div>
                                    </div>
                                    <div className="col-md-4">
                                    <div className="form-group">
                                    <label htmlFor="">Date</label>
                                    <input type="date" className='form-control' />
                                </div>
                                    </div>
                                    <div className="col-md-4">
                                        <button className="btn btn-primary">Evaluate</button>
                                    </div>
                                </div>
                                
                                
                               
                               
                               
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
                            {mutualFund.length > 0 && <Pagination currentPage={currentPage} totalItems={mutualFund} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage}/> } 
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
