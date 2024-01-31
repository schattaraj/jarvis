import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader'; 
import { Context } from '../contexts/Context'; 
import parse from 'html-react-parser';
export default function PemDetails() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])

    const fetchColumnNames = async () => {
        try {
            const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=PEM&_=1706681174127")
            const columnApiRes = await columnApi.json()
            // columnApiRes.push(...extraColumns)
            columnApiRes.splice(0,0,extraColumns[0])
            columnApiRes.push(...extraColumns.slice(1)) 
            setColumnNames(columnApiRes)
        }
        catch (e) {
            console.log("error", e)
        }
    }


    const fetchData = async () => {
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getImportsData?metaDataName=PEM&_=1706681174128")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
            // setTimeout(() => {
            //     setTableData(getImportsData)
            //     setFilterData(getImportsData)
            // }, 1500)
        }
        catch (e) {
            console.log("error", e)
        }
    }

    const handleClick = (elm)=>{
        console.log("element",elm)
    }

    const options = {
        replace: (elememt) => {
            if (elememt.name === 'a') {
                // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
                return (
                    <a onClick={() => { handleClick(elememt.children[0].data) }} href='#'>
                        {parse(elememt.children[0].data)}
                    </a>
                );
            }
        }
    }
    useEffect(() => {
        fetchColumnNames()
        fetchData()
    }, [])
    const extraColumns = [
        {
            "elementId": null,
            "elementName": "Total Rank",
            "elementInternalName": "element80",
            "elementDisplayName": "Total Rank",
            "elementType": null,
            "metadataName": "PEM",
            "isAmountField": 0,
            "isUniqueField": 0,
            "isSearchCriteria": 0,
            "isVisibleInDashboard": 0,
            "isCurrencyField": 0
        },
        {
            "elementId": null,
            "elementName": "Date",
            "elementInternalName": "lastUpdatedAt",
            "elementDisplayName": "Date",
            "elementType": null,
            "metadataName": "Everything_List_New",
            "isAmountField": 0,
            "isUniqueField": 0,
            "isSearchCriteria": 0,
            "isVisibleInDashboard": 0,
            "isCurrencyField": 0
        },
        {
            "elementId": null,
            "elementName": "idMarketData",
            "elementInternalName": "idMarketData",
            "elementDisplayName": "Action",
            "elementType": null,
            "metadataName": "Everything_List_New",
            "isAmountField": 0,
            "isUniqueField": 0,
            "isSearchCriteria": 0,
            "isVisibleInDashboard": 0,
            "isCurrencyField": 0
        }
    ];
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
                                    </span>PEM Details
                                </h3>
                            </div>
                            <div className="table-responsive">
                                <table className="table border display no-footer dataTable" style={{ width: "", marginLeft: "0px" }} role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {columnNames.map((columnName, index) => (
                                                <th key={index}>{columnName.elementDisplayName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterData.map((rowData, rowIndex) => (
                                            <tr key={rowIndex} style={{ overflowWrap: 'break-word' }}>
                                                {
                                                    columnNames.map((columnName, colIndex) => {
                                                        let content;

                                                        if (columnName.elementInternalName === 'element3') {
                                                            content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                        } else if (columnName.elementInternalName === 'element80') {

                                                            content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(0);
                                                        } 
                                                        else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                            content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                        } 
                                                        else if(columnName.elementInternalName === "idMarketData"){
                                                            content = rowData[columnName.elementInternalName]
                                                        return <td key={colIndex}><button className='btn btn-success'><i className="mdi mdi-pen"></i></button></td>;

                                                        }
                                                        else {
                                                            content = rowData[columnName.elementInternalName];
                                                        } 
                                                        
                                                        if(typeof(content) == 'string'){
                                                            content = parse(content,options)
                                                        }
                                                        // return <td key={colIndex}>{parse(JSON.stringify(content),options)}</td>;
                                                        return <td key={colIndex}>{content}</td>;
                                                    })
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                 
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Loader />
    </>
  )
}
