import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader';
import { Context } from '../contexts/Context';
import parse from 'html-react-parser';
import { calculateAverage, searchTable } from '../utils/utils';
import { getImportsData } from '../utils/staticData';
import BondsHistoryModal from '../components/BondHstoryModal';
import { Autocomplete, TextField } from '@mui/material';
import BondChart from '../components/charts';
import { Pagination } from '../components/Pagination';
import SliceData from '../components/SliceData';

const extraColumns = [
    {
        "elementId": null,
        "elementName": "Stock",
        "elementInternalName": "element98",
        "elementDisplayName": "Stock",
        "elementType": null,
        "metadataName": "Bondpricing_Master",
        "isAmountField": 0,
        "isUniqueField": 0,
        "isSearchCriteria": 0,
        "isVisibleInDashboard": 0,
        "isCurrencyField": 0
    },
    {
        "elementId": null,
        "elementName": "Jarvis Rank",
        "elementInternalName": "element99",
        "elementDisplayName": "Jarvis Rank",
        "elementType": null,
        "metadataName": "Bondpricing_Master",
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
        "metadataName": "Bondpricing_Master",
        "isAmountField": 0,
        "isUniqueField": 0,
        "isSearchCriteria": 0,
        "isVisibleInDashboard": 0,
        "isCurrencyField": 0
    }
];


export default function Bonds() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [show, setShow] = useState(false);
    const [allStocks, setAllStocks] = useState([])
    const [reportData, setReportData] = useState([])
    const [reportModal, setReportModal] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState([])
    const [chartData, setChartData] = useState()
    const [callChart, setCallChart] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleStockChange = (event) => {
        setSelectedStock(event.target.value);
    };

    const option = [
        'Select an Option',
        'History',
        'PDF',
        'Bond Home',
        'Ranking',
        'Calculate',
        'Grid View',
        'Chart View',
        'Reset Bond Details',
    ];


    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSelectClick = () => {
        if (selectedOption === 'History') {
            handleOpenModal()
        }
        if (selectedOption === 'Chart View') {
            setCallChart()
        }
    }

    const handleChartView = () => [

    ]


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

    // https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1705052752517
    const fetchColumnNames = async () => {
        context.setLoaderState(true)
        try {            
            const columnApi = await fetch("https://www.jharvis.com/JarvisV2/getColumns?metaDataName=Bondpricing_Master&_=1705052752517")
            const columnApiRes = await columnApi.json()
            columnApiRes.push(...extraColumns)
            setColumnNames(columnApiRes)
            fetchData()
        }
        catch (e) {
            console.log("error", e)
            context.setLoaderState(false)
        }        
    }


    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            const getBonds = await fetch("https://www.jharvis.com/JarvisV2/getImportsData?metaDataName=Bondpricing_Master&_=1705052752518")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
            setStocks(getBondsRes)
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const exportPdf = () => {
        if (tableData.length > 0) {
            const doc = new jsPDF();

            autoTable(doc, { html: '#my-table' })

            doc.save('table.pdf')
        }
    }
    const downloadReport = async (reportName) => {
        try {
            const fetchReport = await fetch("https://jharvis.com/JarvisV2/downloadTickerReport?fileName=" + reportName)
            const fetchReportRes = await fetchReport.json()
            window.open(fetchReportRes.responseStr, '_blank')
        }
        catch (e) {

        }

    }
    const deleteReport = async (reportName) => {
        try {
            const deleteApi = await fetch("https://jharvis.com/JarvisV2/deletePortfolioByName?name=" + reportName)
            const deleteApiRes = await deleteApi.json()
            alert(deleteApiRes.msg)
        }
        catch (e) {

        }

    }

    const getTickerCartDtata = async () => {
        try {
            const tickerName = selectedStock.map(item => item.element1)
            const apiUrl = `https://www.jharvis.com/JarvisV2/getChartForHistoryByTicker?metadataName=Bondpricing_Master&ticker=${encodeURIComponent(tickerName)}&year=2023&year2=2023`;

            const response = await fetch(apiUrl);
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

    useEffect(() => {
        async function run() {
            if (tableData.length > 0) {
                // console.log("tableData",tableData)
                const items = await SliceData(currentPage, limit, tableData);
                // console.log("items",items)
                setFilterData(items)
            }
        }
        run()
    }, [currentPage, tableData])

    useEffect(() => {
        fetchColumnNames()
        getTickerCartDtata()
    }, [])

    // useEffect(() => {
    //     selectedStock.length && getTickerCartDtata()
    // }, [callChart])



    return (
        <>
            <div>
                <BondsHistoryModal open={openModal} handleClose={handleCloseModal} />
            </div>
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
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="">Options</label>
                                    <select name="portfolio_name" className='form-select' onChange={handleChange}>
                                        {option.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {(<div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">Filter Bonds</label>
                                    <Autocomplete
                                        multiple
                                        id="tags-standard"
                                        value={selectedStock}
                                        onChange={(event, newValue) => {
                                            setSelectedStock(newValue);
                                        }}
                                        options={stocks}
                                        getOptionLabel={(option) => option.element98}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Select Stocks"
                                            />
                                        )}
                                    />
                                </div>
                            </div>)}

                            <div className="col-md-3">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={() => {
                                        if (selectedStock.length && selectedOption === 'Chart View') {
                                            getTickerCartDtata()
                                        } else {

                                            handleSelectClick()
                                        }
                                    }}>GO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                            <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                    </div>
                    {selectedOption === 'Chart View' ? <BondChart bondData={chartData} /> :
                        (<div className="table-responsive">
                            <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                <thead>
                                    <tr>
                                        {columnNames.map((columnName, index) => (
                                            <th key={'column' + index} style={{ width: '10% !imporatant' }}>{columnName.elementDisplayName}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterData.map((rowData, rowIndex) => (
                                        <tr key={'rowIndex' + rowIndex} style={{ overflowWrap: 'break-word' }}>
                                            {
                                                columnNames.map((columnName, colIndex) => {
                                                    let content;

                                                    if (columnName.elementInternalName === 'element3') {
                                                        content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                    } else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                        content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                    } else {
                                                        content = rowData[columnName.elementInternalName];
                                                    }

                                                    if (typeof (content) == 'string') {
                                                        content = parse(content)
                                                    }
                                                    return <td key={colIndex}>{content}</td>;
                                                })
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                                <thead>
                                    <tr>
                                        {filterData.length ? columnNames.map((item, index) => {
                                            {
                                                if (item.elementInternalName === 'element3' || item.elementInternalName === 'element9') {
                                                    return <th>
                                                        {calculateAverage(filterData, item.elementInternalName)} % <br />
                                                        ({calculateAverage(tableData, item.elementInternalName)}) %
                                                    </th>
                                                } else {
                                                    return <th key={index}></th>
                                                }
                                            }
                                        }) : null
                                        }
                                    </tr>
                                </thead>
                            </table>

                        </div>)
                    }
                    {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
        </>
    )
}
