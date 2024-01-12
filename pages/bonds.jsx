import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader';
import { Context } from '../contexts/Context';
import parse from 'html-react-parser';
export default function Bonds() {
    const context = useContext(Context)
    const [columnNames,setColumnNames] = useState([])
    const [portfolioNames,setPortfolioNames] = useState([])
    const [selectedPortfolioId,setPortfolioId] = useState(false)
    const [tableData,setTableData] = useState([])
    const [filterData,setFilterData] = useState([])
    const [show, setShow] = useState(false);
    const [allStocks,setAllStocks] = useState([])
    const [reportData,setReportData] = useState([])
    const [reportModal,setReportModal] = useState(false)

    const fetchColumnNames = async()=>{
        try{
            const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master")
            const columnApiRes = await columnApi.json()
            setColumnNames(columnApiRes)
        }
        catch(e){
            console.log("error",e)
        }    
       }
       const fetchData = async()=>{
        try{
             
                const getBonds = await fetch("https://jharvis.com/JarvisV2/getImportsData?metaDataName=Bondpricing_Master")
                const getBondsRes = await getBonds.json()
                setTableData(getBondsRes)
                setFilterData(getBondsRes) 
        }
        catch(e){
            console.log("error",e)
        }    
       }
       const filter = (e)=>{
        console.log('search',e.target.value)
        const value = e.target.value;
        const filtered = tableData.filter(elememt => elememt.element4.toLowerCase().includes(value.toLowerCase()) )
        //   const filtered = tableData.map(elememt => {
        //    return elememt['element4'].toLowerCase().includes(value.toLowerCase())
            // columnNames.map((item,index)=>{
            //     // (elememt.element+(index+1)).toLowerCase().includes(value.toLowerCase())
            //     console.log(elememt['element4'].includes(value))
            //      if(elememt['element4'] == value){
            //    return elememt
            //     }
               
            // }) 
        // });
          console.log('searchdata',filtered)
          console.log('tableData',tableData)
          setFilterData(filtered)
        }
       const exportPdf = ()=>{
        if(tableData.length>0){
            const doc = new jsPDF();
    
            autoTable(doc, { html: '#my-table' })
            
            doc.save('table.pdf')
        }       
    }
    const downloadReport = async(reportName)=>{
        try{
            const fetchReport = await fetch("https://jharvis.com/JarvisV2/downloadTickerReport?fileName="+reportName)
            const fetchReportRes = await fetchReport.json()
            window.open(fetchReportRes.responseStr,'_blank')
        }
        catch(e){
    
        }
    
    }
    const deleteReport = async(reportName)=>{
        try{
            const deleteApi = await fetch("https://jharvis.com/JarvisV2/deletePortfolioByName?name="+reportName)
            const deleteApiRes = await deleteApi.json()
            alert(deleteApiRes.msg)
        }
        catch(e){
    
        }
    
    }
    useEffect(()=>{
        fetchColumnNames()
        fetchData()
    },[])
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
                                    </span>Bonds
                                </h3>
                            </div>
                            <div className="selection-area mb-3">
                                <div className="row">
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter}/></div>
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
                                        filterData.map((item,index)=>{
                                            return <tr key={"tr"+index}>
                                                {
                                                   
                                                    columnNames.map((inner,keyid)=>{ 
                                                        return <td key={"keyid"+keyid}>{parse(item['element'+(keyid+1)], options)}</td>
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>
                                        
                                </table>
                            </div>
                        </div>
                </div>
                </div>                
    </div>
       <Loader/>
    </>
  )
}
