import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import parse from 'html-react-parser';
export default function Portfolio() {
 
    const [columnNames,setColumnNames] = useState([])
    const [portfolioNames,setPortfolioNames] = useState([])
    const [selectedPortfolioId,setPortfolioId] = useState(false)
    const [tableData,setTableData] = useState([])

   const fetchColumnNames = async()=>{
    try{
        const columnApi = await fetch("https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Tickers_Watchlist&_=170004124669")
        const columnApiRes = await columnApi.json()
        setColumnNames(columnApiRes)
    }
    catch(e){
        console.log("error",e)
    }    
   }
   const fetchPortfolioNames = async()=>{
    try{
        const portfolioApi = await fetch("https://www.jharvis.com/JarvisV2/getAllPortFolioTicker?userId=2")
        const portfolioApiRes = await portfolioApi.json()
        setPortfolioNames(portfolioApiRes)
    }
    catch(e){
        console.log("error",e)
    }    
   }
   const fetchData = async()=>{
    try{
        if(selectedPortfolioId){
            const getPortfolio = await fetch("https://www.jharvis.com/JarvisV2/getPortFolioStockSet?idPortfolio="+selectedPortfolioId)
            const getPortfolioRes = await getPortfolio.json()
            setTableData(getPortfolioRes)
        }
    }
    catch(e){
        console.log("error",e)
    }    
   }
   const handleChange = (e)=>{
    setPortfolioId(e.target.value)
   }
   const exportPdf = ()=>{
    if(tableData.length>0){
        const doc = new jsPDF();

        autoTable(doc, { html: '#my-table' })
        
        doc.save('table.pdf')
    }       
}
    useEffect(() => {
        fetchColumnNames()
        fetchPortfolioNames()
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
                                    </span>Portfolio
                                </h3>
                            </div>
                            <div className="selection-area mb-3">
                                <div className="row">
                                   
                                    <div className="col-md-4">


                                        <div className="form-group">
                                            <label htmlFor="">Portfolio Name</label>
                                            <select name="portfolio_name" className='form-select' onChange={handleChange}>
                            <option>Select Portfolio</option>
                          {
                            portfolioNames.length > 0 && portfolioNames.map((item,index)=>{
                                return <option value={item?.idPortfolio} key={"name"+index}>{item?.name}</option>
                            })
                          }
                            </select>
                                        </div>
                                        </div>
                                      
                                    <div className="col-md-4">
                                    <div className="actions">
                                <button className='btn btn-primary' onClick={fetchData}>GO</button>
                                {/* <button className='btn btn-primary'>MANAGE</button> */}
                                </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" tabindex="0" aria-controls="exampleStocksPair" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" tabindex="0" aria-controls="exampleStocksPair" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' /></div>
                            </div>
                            <div className="table-responsive">
                                <table className="table border display no-footer dataTable" style={{ width: "", marginLeft: "0px" }} role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                <thead>
                                    <tr>
                                        {
                                            columnNames.length > 0 && columnNames.map((item,index)=>{
                                                return <th key={index}>{item?.elementName}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tableData.map((item,index)=>{
                                            return <tr key={"tr"+index}>
                                                {
                                                   
                                                    columnNames.map((inner,keyid)=>{ 
                                                        return <td key={"keyid"+keyid}>{parse(item['element'+(keyid+1)])}</td>
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>
                                        
                                </table>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    )
}
