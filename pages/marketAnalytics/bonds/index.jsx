import React, { useContext, useEffect, useState } from 'react'
import Navigation from '../../../components/navigation';
import Sidebar from '../../../components/sidebar';
import Loader from '../../../components/loader';
import { Context } from '../../../contexts/Context';
import parse from 'html-react-parser';
import { calculateAverage, getSortIcon, searchTable } from '../../../utils/utils';
import { getImportsData } from '../../../utils/staticData';
import BondsHistoryModal from '../../../components/BondHstoryModal';
import { Autocomplete, TextField } from '@mui/material';
import BondChart from '../../../components/charts';
import { Pagination } from '../../../components/Pagination';
import SliceData from '../../../components/SliceData';
import HightChart from '../../../components/HighChart';
import { Form, Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';
import Swal from 'sweetalert2';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FilterAlt } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Breadcrumb from '../../../components/Breadcrumb';
import { elements } from 'chart.js';
import ReportTable from '../../../components/ReportTable';
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
    const [selectedOption, setSelectedOption] = useState('Bond Home');
    const [stocks, setStocks] = useState([]);
    const [selectedBond, setSelectedBond] = useState([])
    const [chartData, setChartData] = useState()
    const [callChart, setCallChart] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [compareData, setCompareData] = useState(false)
    const [risenStocks, setRisenStocks] = useState([])
    const [risenStocksFiltered, setRisenStocksFiltered] = useState([])
    const [dropStocks, setDropStocks] = useState([])
    const [dropStocksFiltered, setDropStocksFiltered] = useState([])
    const [rankingData, setRankingData] = useState(false)
    const [calculateModal, setCalculateModal] = useState(false)
    const [rating, setRating] = useState([]);
    const [treasuryYield, setTreasuryYield] = useState('');
    const [year, setYear] = useState('Any');
    const [maturityMin, setMaturityMin] = useState('Any');
    const [maturityMax, setMaturityMax] = useState('Any');
    const [ytwMin, setYtwMin] = useState('Any');
    const [ytwMax, setYtwMax] = useState('Any');
    const [callable, setCallable] = useState('Any');
    const [secured, setSecured] = useState('Any');
    const [tickers, setTickers] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: 2023, endDate: 2023 })
    const [chartHistory, setChartHistory] = useState([])
    const [ViewOptions, setViewOptions] = useState({
        element9: "Price",
        element3: "YTW",
    })
    const [selectedView, setSelectedView] = useState('element9')
    const [dateModal, setDateModal] = useState(false)
    const [file, setFile] = useState(null);
    const [fileDate, setFileDate] = useState('');
    const [reportTicker, setReportTicker] = useState("")
    const router = useRouter()
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleStockChange = (event) => {
        setSelectedBond(event.target.value);
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

    const handleSelectClick = async () => {
        const payload = {
            ticker: selectedBond.map(r => r.value.split('-')[1]).join(','),            
            metadataName: 'Bondpricing_Master',
            _: new Date().getTime() 
        };

        const queryString = new URLSearchParams(payload).toString();
        context.setLoaderState(true)
        try {
            const getBonds = await fetch(`https://www.jharvis.com/JarvisV2/getHistoryByTickerBond?${queryString}`)
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
            setSelectedOption("Bond Home")
        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }

    const handleChartView = () => [

    ]
const handleClick = (data)=>{
console.log("handleClick",data)
}
const handleReportData = (data)=>{
    const regex = /\(([^)]+)\)$/;
    const match = data.match(regex);
    setReportTicker(match ? match[1] : '')
    setReportModal(true)
}
    const options = {
        replace: (elememt) => {
            if (elememt?.name === 'a') {
                return (
                    <a onClick={() => { handleReportData(elememt?.children[0]?.data) }} href='#'>
                        {typeof(elememt?.children[0]?.data) == "string" ? parse(elememt?.children[0]?.data) : elememt?.children[0]?.data}
                    </a>
                );
            }
        }
    }
    const options2 = {
        replace (elememt){
            if (elememt?.name == 'img') {
                return (
                    <React.Fragment>
                        <img className="img-responsive" src={elememt?.attribs?.src} />
                        <a onClick={() => { handleReportData(elememt?.next?.children[0]?.data) }} href='#'>
                            {typeof(elememt?.next?.children[0]?.data) == "string" ? parse(elememt?.next?.children[0]?.data) : elememt?.next?.children[0]?.data}
                        </a>
                        </React.Fragment>
                )
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
            const tickerName = selectedBond.map(item => item.element1)
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
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const filterBestStocks = (e) => {
        const value = e.target.value;
        setRisenStocksFiltered(searchTable(risenStocks, value))
    }
    const filterWorstStocks = (e) => {
        const value = e.target.value;
        setDropStocksFiltered(searchTable(dropStocks, value))
    }
    const ranking = async () => {
        context.setLoaderState(true)
        try {
            const rankingApi = await fetch(`https://jharvis.com/JarvisV2/getImportHistorySheetCompare?metadataName=Bondpricing_Master&date1=1900-01-01&date2=1900-01-01&_=1719818279196`)
            const rankingApiRes = await rankingApi.json()
            setRankingData(rankingApiRes)
            setCompareData(rankingApiRes)
            setSelectedOption("Ranking")
        } catch (error) {
            console.log("Erorr 258", error)
        }
        context.setLoaderState(false)
    }
    const handleSearch = async () => {
        const payload = {
            couponMin: '',
            couponMax: '',
            rating: rating.map(r => r.value).join(','),
            treasuryYield,
            treasuryYr: year,
            ytwMin,
            ytwMax,
            maturityMin,
            maturityMax,
            callable,
            secured,
            metadataName: 'Bondpricing_Master',
            _: new Date().getTime() // This will generate a unique timestamp
        };

        const queryString = new URLSearchParams(payload).toString();
        console.log("queryString", queryString)
        const url = `https://jharvis.com/JarvisV2/getCalculateBond?${queryString}`;
        context.setLoaderState(true)
        try {
            const response = await fetch(url);
            const data = await response.json();
            setTableData(data)
            setFilterData(data)
            setCalculateModal(false)
            setSelectedOption("Calculate")
            console.log(data); // Handle the response data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        context.setLoaderState(false)
    };
    const charts = async () => {
        if (!selectedBond || selectedBond.length == 0) {
            Swal.fire({ title: "Please Select Bond", confirmButtonColor: "#719B5F" });
            return;
        }
        context.setLoaderState(true)
        try {
            const payload = {
                ticker: selectedBond.map(r => r.value.split('-')[1]).join(','),
                year: dateRange?.startDate,
                year2: dateRange?.endDate,
                metadataName: 'Bondpricing_Master',
                _: new Date().getTime() // This will generate a unique timestamp
            };
            const queryString = new URLSearchParams(payload).toString();
            const getChartHistrory = await fetch(`https://jharvis.com/JarvisV2/getChartForHistoryByTicker?${queryString}`)
            const getChartHistroryRes = await getChartHistrory.json()
            console.log("getChartHistroryRes", getChartHistroryRes)
            setChartHistory(getChartHistroryRes)
            setSelectedOption("Chart View")
            setDateModal(false)
            setTableData(getChartHistroryRes)
            setFilterData(getChartHistroryRes)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const fetchTickersFunc = async () => {
        // context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Bondpricing_Master&_=" + new Date().getTime())
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {
            console.log("Error - 335", e);
        }
        // context.setLoaderState(false)
    }
    const handleDateRange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: Number(e.target.value) })
    }
    const gridView = () => {
        setSelectedOption("Grid View")
    }
    const bondHome = () => {
        setSelectedOption("Bond Home")
        fetchData()
    }
    const uploadFile = async (e) => {
        e.preventDefault()
        const form = e.target
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        context.setLoaderState(true)
        try {
            const formData = new FormData();
            formData.append('metaDataName', 'Bondpricing_Master');
            formData.append('fileDate', fileDate);
            formData.append('myfile', file);
            console.log("formData",formData)
            const upload = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "uploadFileBondImport", {
                method: "POST",
                // headers: {
                //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                //     'Cache-Control': 'max-age=0',
                //     'Content-Type': 'multipart/form-data',
                //   },
                body: formData
            })
            const uploadRes = await upload.json()
            if (upload.status == 400) {
                Swal.fire({ title: uploadRes?.message, icon: "warning", confirmButtonColor: "var(--primary)" })
            }
        } catch (error) {
            console.log("Error", error)
        }
        context.setLoaderState(false)
    }
    const handleFileChange = (e) => {
        console.log(e.target.files)
        setFile(e.target.files[0]);
      };
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
    function extractAndConvert(inputString) {
        // Define regex patterns to match both cases
        const pathAndAnchorRegex = /(.*?\.jpg)\s(<a.*?<\/a>)/;
        const onlyPathRegex = /(.*?\.jpg)/;
        const onlyAnchorRegex = /(<a.*?<\/a>)/;
    
        // Try to match both path and anchor
        const matchPathAndAnchor = inputString.match(pathAndAnchorRegex);
        if (matchPathAndAnchor) {
            const filePath = matchPathAndAnchor[1];
            const anchorTag = matchPathAndAnchor[2];
            // Create img tag from file path
            const imgTag = `<img src="https://jharvis.com/JarvisV2/downloadPDF?fileName=${filePath}" alt="Image">${anchorTag}`;
            return parse(imgTag,options2);
        }
    
        // Try to match only file path
        const matchOnlyPath = inputString.match(onlyPathRegex);
        if (matchOnlyPath) {
            const filePath = matchOnlyPath[1];
            // Create img tag from file path
            const imgTag = `<img src="https://jharvis.com/JarvisV2/downloadPDF?fileName=${filePath}" alt="Image">`;
            return parse(imgTag);
        }
    
        // Try to match only anchor tag
        const matchOnlyAnchor = inputString.match(onlyAnchorRegex);
        if (matchOnlyAnchor) {
            return parse(matchOnlyAnchor[1],options);
        }
        const pathAndTextRegex = /(.*?\.png)\s*(.*)/;
        const matchPathAndText = inputString.match(pathAndTextRegex);
        if (matchPathAndText) {
            const filePath = matchPathAndText[1];
            const additionalText = matchPathAndText[2];
            // Create img tag from file path
            const imgTag = `<img src="https://jharvis.com/JarvisV2/downloadPDF?fileName=${filePath}" alt="Image"></br>`;
            // Combine img tag with additional text
            const resultHtml = `${imgTag} ${additionalText}`;
            return parse(resultHtml); // Adjust parse function as needed
        }
        // If neither pattern is matched, return an empty array
        return inputString;
    }
    const closeReportModal = () => {
        setReportModal(false)
    }
    useEffect(() => {
        async function run() {
            if (tableData.length > 0) {
                let items = [...tableData];
                if (sortConfig !== null) {
                    items.sort((a, b) => {
                        if (a[sortConfig.key] < b[sortConfig.key]) {
                            return sortConfig.direction === 'asc' ? -1 : 1;
                        }
                        if (a[sortConfig.key] > b[sortConfig.key]) {
                            return sortConfig.direction === 'asc' ? 1 : -1;
                        }
                        return 0;
                    });
                }
                let dataLimit = limit
                let page = currentPage
                if (dataLimit == "all") {
                    dataLimit = tableData?.length
                    page = 1
                }
                items = await SliceData(page, dataLimit, items);
                setFilterData(items)
            }
        }
        run()
    }, [currentPage, tableData, sortConfig, limit])

    useEffect(() => {
        fetchTickersFunc()
        fetchColumnNames()
        // getTickerCartDtata()
    }, [])
    useEffect(() => {
        if (compareData) {
            setRisenStocks(compareData?.bestFiveStocks)
            setRisenStocksFiltered(compareData?.bestFiveStocks)
            setDropStocks(compareData?.worstFiveStocks)
            setDropStocksFiltered(compareData?.worstFiveStocks)
        }
    }, [compareData])
    // useEffect(() => {
    //     selectedStock.length && getTickerCartDtata()
    // }, [callChart])

    const customStyles = {
        container: (provided) => ({
            ...provided,
            zIndex: 4,
        }),
    };

    return (
        <>
            <div>
                <BondsHistoryModal open={openModal} handleClose={handleCloseModal} setCompareData={setCompareData} setSelectedOption={setSelectedOption} />
            </div>
            <div className="main-panel">
                <div className="content-wrapper">
        <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Bonds
                        </h3>
                    </div>
                    <div className="selection-area mb-3">
                        <div className="row">
                            {/* <div className="col-md-3">
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
                            </div> */}
                            {(<div className="col-md-4">
                                <div className="form-group">
                                    {/* <label htmlFor="">Filter Bonds</label> */}
                                    {/* <Autocomplete
                                        multiple
                                        id="tags-standard"
                                        value={selectedBond}
                                        onChange={(event, newValue) => {
                                            setSelectedBond(newValue?.element1);
                                        }}
                                        options={tickers.map((item)=>({label:item?.elememt1,value:item?.elememt1}))}
                                        getOptionLabel={(option) => option?.element1}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Select Bond"
                                            />
                                        )}
                                    /> */}
                                    <ReactSelect className='mb-0 me-2' isMulti onChange={setSelectedBond} styles={customStyles} options={
                                        tickers && tickers.map((item, index) => (
                                            { value: item.element1, label: item.element1 }
                                        ))
                                    } />
                                </div>
                            </div>)}

                            <div className="col-md-3">
                                <div className="actions">
                                    <button className='btn btn-primary' onClick={() => {
                                        if (selectedBond.length && selectedOption === 'Chart View') {
                                            charts()
                                        } else {

                                            handleSelectClick()
                                        }
                                    }}>GO</button>
                                </div>
                            </div>
                            <div className="col-md-4">

                            </div>
                        </div>
                    </div>
                    <div className="selection-area mb-3" style={{ zIndex: "1" }}>
                        <Form onSubmit={uploadFile} encType="multipart/form-data">
                            <input type="hidden" name="metaDataName" value="Bondpricing_Master" />
                            <div className="row align-items-center">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>File Upload Date</label>
                                        <input type="date" className="form-control" name='fileDate' required onChange={(e)=>{setFileDate(e.target.value)}}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="uploadFile">Upload File</label>
                                        <input id="uploadFile" type="file" name="myfile" className='border-1 form-control' required  onChange={handleFileChange} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="actions">
                                        <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                                    </div></div>
                            </div>
                        </Form>
                    </div>
                    <div className="d-flex">
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "History" ? ` active` : ''}`} type="button" title="History" onClick={handleOpenModal}><span>History</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Bond Home" ? ` active` : ''}`} type="button" title="Bond Home" onClick={bondHome}><span>Bond Home</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Ranking" ? ` active` : ''}`} type="button" title="Ranking" onClick={ranking}><span>Ranking</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Calculate" ? ` active` : ''}`} type="button" title="Calculate" onClick={() => { setCalculateModal(true) }}><span>Calculate</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Grid View" ? ` active` : ''}`} type="button" title="Grid View" onClick={gridView}><span>Grid View</span></button>
                        <button className={`h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3${selectedOption == "Chart View" ? ` active` : ''}`} type="button" title="Chart View" onClick={charts}><span>Chart View</span></button>
                        <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3" type="button" title="Reset" onClick={bondHome}><span>Reset</span></button>
                        {/* <button className="h-100 dt-button buttons-pdf buttons-html5 btn-primary mb-3" type="button" title="Bond Details" onClick={() => { }}><span>Bond Details</span></button> */}
                    </div>

                    {
                        (selectedOption === 'Bond Home' || selectedOption === 'Calculate' || selectedOption === 'Grid View') &&
                        (
                            <>
                                <div className='d-flex justify-content-between'>
                                    <div className="dt-buttons mb-3">
                                        <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                        <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                    </div>
                                    <div className="form-group d-flex align-items-center">
                                    <div className="form-group d-flex align-items-center mb-0 me-3">
                                        {/* <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /> */}
                                <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="all">All</option>
                                </select>
                            </div>
                                        <label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table border display no-footer dataTable bond-table" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                        <thead>
                                            <tr>
                                                {columnNames.map((columnName, index) => (
                                                    <th key={'column' + index} style={{ width: '10% !imporatant' }} onClick={() => handleSort(columnName.elementInternalName)}>{columnName.elementDisplayName}{getSortIcon(columnName.elementInternalName, sortConfig)}</th>
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
                                                            } 
                                                            else if (columnName.elementInternalName === 'element1') {
                                                                // content = rowData[columnName.elementInternalName].split(" ")[0]
                                                                // content = `<img src=https://jharvis.com/JarvisV2/downloadPDF?fileName=${rowData[columnName.elementInternalName].split(" ")[0]}/>${rowData[columnName.elementInternalName].split(" ")[2]}`
                                                                content = extractAndConvert(rowData[columnName.elementInternalName])
                                                            } else {
                                                                content = rowData[columnName.elementInternalName];
                                                            }

                                                            if (typeof (content) == 'string' && columnName.elementInternalName != "element1") {
                                                                content = parse(content,options)
                                                            }
                                                            return <td key={colIndex}>{content}</td>;
                                                        })
                                                    }
                                                </tr>
                                            ))}
                                            {
                                                filterData.length == 0 &&
                                                <tr>
                                                    <td colSpan={columnNames?.length}>No data available</td>
                                                </tr>
                                            }
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

                                </div>
                                {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                            </>)
                    }
                    {(selectedOption == "History" || selectedOption == "Ranking") &&
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group d-flex align-items-center mb-2"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filterBestStocks} /></div>
                                <div className="table-responsive mb-3">
                                    <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                        <thead>
                                            <tr>
                                                <th>Most Risen Stock</th>
                                                <th>Price Risen By</th>
                                                <th>% In Rise</th>
                                                <th>Current Price</th>
                                                <th>Previous Price</th>
                                                <th>Current YTM</th>
                                                <th>Previous YTM</th>
                                                <th>Maturity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                risenStocksFiltered?.map((item, index) => {
                                                    return <tr key={"bestStock" + index}>
                                                        <td>{item?.bestMovedStock}</td>
                                                        <td>{item?.bestMovedBy}</td>
                                                        <td>{item?.percentageChangeRise}</td>
                                                        <td>{item?.bestMoveCurrValue}</td>
                                                        <td>{item?.bestMovePrevValue}</td>
                                                        <td>{item?.currytm}</td>
                                                        <td>{item?.prevytm}</td>
                                                        <td>{item?.maturityDate}</td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <HightChart data={compareData?.bestFiveStocks?.map((item) => [item['bestMovedStock'], parseFloat(item['percentageChangeRise'])])} title={"Bond Performance"} typeCheck={{ categories: compareData?.bestFiveStocks?.map((item) => item?.bestMovedStock) }} yAxisTitle={"Risn in %"} titleAlign={"center"} subTitle={"Best Fifty"} />
                            </div>
                            <div className="col-md-6">
                                <div className="form-group d-flex align-items-center mb-2"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filterWorstStocks} /></div>
                                <div className="table-responsive mb-3">
                                    <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                        <thead>
                                            <tr>
                                                <th>Most Dropped Stock</th>
                                                <th>Price Dropped By</th>
                                                <th>% In Drop</th>
                                                <th>Current Price</th>
                                                <th>Previous Price</th>
                                                <th>Current YTM</th>
                                                <th>Previous YTM</th>
                                                <th>Maturity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dropStocksFiltered?.map((item, index) => {
                                                    return <tr key={"worstStock" + index}>
                                                        <td>{item?.worstMovedStock}</td>
                                                        <td>{item?.worstMovedBy}</td>
                                                        <td>{item?.percentageChangeRise}</td>
                                                        <td>{item?.worstMoveCurrValue}</td>
                                                        <td>{item?.worstMovePrevValue}</td>
                                                        <td>{item?.currytm}</td>
                                                        <td>{item?.prevytm}</td>
                                                        <td>{item?.maturityDate}</td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <HightChart data={compareData?.worstFiveStocks?.map((item) => [item['worstMovedStock'], parseFloat(item['percentageChangeDrop'])])} title={"Bond Performance"} typeCheck={{ categories: compareData?.bestFiveStocks?.map((item) => item?.bestMovedStock) }} yAxisTitle={"Risn in %"} titleAlign={"center"} subTitle={"Worst Fifty"} />
                            </div>
                        </div>
                    }
                    {
                        selectedOption == "Chart View" &&
                        <>
                            <Tabs
                                defaultActiveKey="price"
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="price" title="Price">
                                    <div className="d-flex align-items-center mx-2 mb-2">
                                        <label className='mb-0'><b>{`Year : ${dateRange?.startDate} - ${dateRange?.endDate}`}</b></label>
                                        <button className='ms-2 btn p-0 text-primary' onClick={() => { setDateModal(true) }} type='button'><FilterAlt /></button>
                                    </div>
                                    <HightChart data={chartHistory?.map((item) => [new Date(item['lastUpdatedAt']).getTime(), parseFloat(item[selectedView])])} title={ViewOptions[selectedView] && `Chart View For ${ViewOptions[selectedView]}`} yAxisTitle="Price" />
                                </Tab>
                                <Tab eventKey="ytm" title="YTM">
                                    <div className="d-flex align-items-center mx-2 mb-2">
                                        <label className='mb-0'><b>{`Year : ${dateRange?.startDate} - ${dateRange?.endDate}`}</b></label>
                                        <button className='ms-2 btn p-0 text-primary' onClick={() => { setDateModal(true) }} type='button'><FilterAlt /></button>
                                    </div>
                                    <HightChart data={chartHistory?.map((item) => [new Date(item['lastUpdatedAt']).getTime(), parseFloat(item['element3'])])} title={ViewOptions['element3'] && `Chart View For ${ViewOptions['element3']}`} yAxisTitle="YTW" />
                                </Tab>
                            </Tabs>

                        </>

                    }
                    <Modal show={calculateModal} onHide={() => { setCalculateModal(false) }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Analysis - Bond</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className="form-label">Rating</label>
                                        <ReactSelect className='' isMulti onChange={setRating} style={{ minWidth: "200px", maxWidth: "300px" }} options={
                                            [
                                                { value: "Any", label: "Any" },
                                                { value: "AAA", label: "AAA" },
                                                { value: "AA", label: "AA" },
                                                { value: "A", label: "A" },
                                                { value: "BBB", label: "BBB" },
                                                { value: "BB", label: "BB" },
                                                { value: "B", label: "B" },
                                                { value: "CCC", label: "CCC" },
                                                { value: "CC", label: "CC" },
                                                { value: "C", label: "C" },
                                            ]
                                        } />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="treasuryYield" className="form-label">Treasury Yield</label>
                                        <input type="text" name="treasuryYield" id="treasuryYield" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className="form-label">Year</label>
                                        <select name="year" id="" className='form-select'>
                                            <option value="Any">Any</option>
                                            <option value="0-1">0-1</option>
                                            <option value="1-3">1-3</option>
                                            <option value="3-5">3-5</option>
                                            <option value="5-7">5-7</option>
                                            <option value="7-10">7-10</option>
                                            <option value="10-20">10-20</option>
                                            <option value="20+">20+</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>Maturity Range(Min):</label>
                                        <select name="maturityMin" id="" className="form-select">
                                            <option value="Any">Any</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>Maturity Range(Max):</label>
                                        <select name="maturityMax" id="" className="form-select">
                                            <option value="Any">Any</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>YTM Range(Min):</label>
                                        <select name="ytwMin" id="" className="form-select">
                                            <option value="Any">Any</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>YTM Range(Max):</label>
                                        <select name="ytwMax" id="" className="form-select">
                                            <option value="Any">Any</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>Callable:</label>
                                        <select name="callable" id="" className="form-select">
                                            <option value="Any">Any</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="" className='form-label'>Secured:</label>
                                        <select name="secured" id="" className="form-select">
                                            <option value="Any">Any</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-secondary" onClick={() => { setCalculateModal(false) }}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                        </Modal.Footer>
                    </Modal>
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
                </div>
            </div>
            <ReportTable name={reportTicker} open={reportModal} handleCloseModal={closeReportModal} />
        </>
    )
}
