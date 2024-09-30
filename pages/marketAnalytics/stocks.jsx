import React, { useRef } from 'react'
import Footer from '../../components/footer';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { Context } from '../../contexts/Context';
import { exportToExcel, generatePDF, getSortIcon, searchTable } from '../../utils/utils';
import { Pagination } from '../../components/Pagination';
import parse from 'html-react-parser';
import SliceData from '../../components/SliceData';
import Swal from 'sweetalert2';
import { Form, Modal, Dropdown } from 'react-bootstrap';
import HightChart from '../../components/HighChart';
import { FilterAlt } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import StockHistoryModal from '../../components/StockHistoryModal';
import Breadcrumb from '../../components/Breadcrumb';
import { FaGlasses } from 'react-icons/fa';
import ReportTable from '../../components/ReportTable';
import { staticStocks } from '../../utils/staticStock';
const extraColumns = [
    {
        "elementId": null,
        "elementName": "OBV",
        "elementInternalName": "element80",
        "elementDisplayName": "OBV",
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
        "elementName": "MOM",
        "elementInternalName": "element81",
        "elementDisplayName": "MOM",
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
        "elementName": "RSI",
        "elementInternalName": "element82",
        "elementDisplayName": "RSI",
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
        "elementName": "EMA",
        "elementInternalName": "element83",
        "elementDisplayName": "EMA",
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
        "elementName": "SMA",
        "elementInternalName": "element84",
        "elementDisplayName": "SMA",
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
    }
];
const bestFiveStockColumn = {
    "company": "Company",
    "bestMovedStock": "Most Risen Stock",
    "bestMovedBy": "Price Risen By",
    "percentageChangeRise": "% In Rise",
    "bestMoveCurrValue": "Current Price",
    "bestMovePrevValue": "Previous Price"
}
const worstFiveStockColumn = {
    "company": "Company",
    "worstMovedStock": "Most Dropped Stock",
    "worstMovedBy": "Price Dropped By",
    "percentageChangeRise": "% In Drop",
    "worstMoveCurrValue": "Current Price",
    "worstMovePrevValue": "Previous Price"
}
export default function Stocks() {
    const [columnNames, setColumnNames] = useState([])
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [selectedTicker, setSelectedTicker] = useState(false)
    const [tickers, setTickers] = useState(false);
    const [activeView, setActiveView] = useState("Ticker Home")
    const [chartHistory, setChartHistory] = useState([])
    const [rankingData, setRankingData] = useState(false)
    const [bestStocksFiltered, setBestStocksFiltered] = useState([])
    const [worstStocksFiltered, setWorstStocksFiltered] = useState([])
    const [historyModal, setHistoryModal] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [calculateModal, setCalculate] = useState(false)
    const [dateRange, setDateRange] = useState({ startDate: 2023, endDate: 2023 })
    const [visibleColumns, setVisibleColumns] = useState(columnNames.map(col => col.elementInternalName));
    const [ViewOptions, setViewOptions] = useState({
        element3: { name: "rankWithInTable", displayName: "Rank Within Table" },
        element32: { name: "enterPriseValue", displayName: "Enterprise value($M)" },
        element33: { name: "priceSale", displayName: "Price / Sales" },
        element34: { name: "grossMargin", displayName: "Gross Margin" },
        element34: { name: "roic", displayName: "ROIC" },
        element34: { name: "priceAvg", displayName: "Price vs 20-day Avg (%)" },
        element34: { name: "price", displayName: "Price" },
        element34: { name: "ytdReturn", displayName: "YTD Return" },
        element34: { name: "dividendYield", displayName: "Dividend Yield" },
        element34: { name: "shortFloat", displayName: "Short as % of Float" },
        element34: { name: "relativeStrength", displayName: "Relative Strength" },
        element34: { name: "priceEarning", displayName: "Price/Earnings" },
        element34: { name: "evEbitda", displayName: "EV / EBITDA" },
    })
    const [selectedView, setSelectedView] = useState('element3')
    const [chartData, setChartData] = useState([])
    const [dateModal, setDateModal] = useState(false)
    const [dates, setRankingDates] = useState({ date1: null, date2: null });
    const [compareData, setCompareData] = useState(false)
    const [reportModal, setReportModal] = useState(false)
    const [formValues, setFormValues] = useState({
        isHighPerforming: 'true',
        rankWithinTableW: '',
        relativeStrengthW: '',
        priceVs20DAvgW: '',
        salesAvgW: '',
        priceSalesW: '',
        ebitdaW: '',
        grossMarginW: '',
        roicW: '',
        priceEarningW: '',
        priceFreeW: '',
    });
    const [file, setFile] = useState(null);
    const [reportTicker, setReportTicker] = useState("")
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef(null);
    // Initial form values
    const initialFormValues = {
        isHighPerforming: '',
        rankWithinTableW: '',
        relativeStrengthW: '',
        priceVs20DAvgW: '',
        salesAvgW: '',
        priceSalesW: '',
        ebitdaW: '',
        grossMarginW: '',
        roicW: '',
        priceEarningW: '',
        priceFreeW: '',
    };
    const context = useContext(Context)
    const handleSelect = (inputs) => {
        let arr = inputs.map((item) => item.value)
        setSelectedTicker(arr.join(","))
    }
    const getHistoryByTicker = async () => {
        if (!selectedTicker) {
            Swal.fire({ title: "Please Select a ticker", confirmButtonColor: "#719B5F" });
            return;
        }
        context.setLoaderState(true)
        try {
            const getBonds = await fetch(`https://jharvis.com/JarvisV2/getHistoryByTickerWatchList?metadataName=Tickers_Watchlist&ticker=${selectedTicker}&_=1722333954367`)
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
            setActiveView("Ticker Home")

        }
        catch (e) {
            console.log("error", e)
        }
        context.setLoaderState(false)
    }
    const charts = async () => {
        setIsExpanded(false)
        if (!selectedTicker || selectedTicker.length == 0) {
            Swal.fire({ title: "Please Select a Ticker", confirmButtonColor: "#719B5F" });
            return;
        }
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
            const getChartHistrory = await fetch(`https://jharvis.com/JarvisV2/getChartForHistoryByTicker?${queryString}`)
            const getChartHistroryRes = await getChartHistrory.json()
            console.log("getChartHistroryRes", getChartHistroryRes)
            setChartHistory(getChartHistroryRes)
            setActiveView("Chart View")
            setTableData(getChartHistroryRes)
            setFilterData(getChartHistroryRes)
            setDateModal(false)
        }
        catch (e) {
            console.log("Error", e)
        }
        context.setLoaderState(false)
    }
    const tickerHome = () => {
        setActiveView("Ticker Home")
    }
    const ranking = async () => {
        context.setLoaderState(true)
        try {
            const rankingApi = await fetch(`https://jharvis.com/JarvisV2/getImportHistorySheetCompare?metadataName=Tickers_Watchlist&date1=${dates?.date1 == null ? '1900-01-01' : dates?.date1}&date2=${dates?.date2 == null ? '1900-01-01' : dates?.date2}&_=1719818279196`)
            const rankingApiRes = await rankingApi.json()
            setRankingData(rankingApiRes)
            setActiveView("Ranking")
        } catch (error) {

        }
        setIsExpanded(false)
        context.setLoaderState(false)
    }
    const reset = () => {
        setActiveView("Ticker Home")
        setSelectedTicker(false)
        fetchData()
    }
    const fetchColumnNames = async () => {
        context.setLoaderState(true)
        try {
            const columnApi = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getColumns?metaDataName=Tickers_Watchlist`)
            const columnApiRes = await columnApi.json()
            columnApiRes.push(...extraColumns)
            setColumnNames(columnApiRes);
            const defaultCheckedColumns = columnApiRes.map(col => col.elementInternalName);
            setVisibleColumns(defaultCheckedColumns);
            fetchData()
            // context.setLoaderState(false)
        }
        catch (e) {
            console.log("error", e)
            context.setLoaderState(false)
        }

    }
    const fetchData = async () => {
        context.setLoaderState(true)
        try {

            const getStocks = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getImportsData?metaDataName=Tickers_Watchlist&_=1705403290395`)
            const getStocksRes = await getStocks.json()
            setTableData(getStocksRes)
            setFilterData(getStocksRes)
            context.setLoaderState(false)
        }
        catch (e) {
            console.log("error", e)
            context.setLoaderState(false)
        }

    }
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const exportPdf = () => {
        if (tableData.length > 0) {
            const doc = new jsPDF({ orientation: 'landscape' });
            // Define autoTable options
            const options = {
                html: '#my-table',
                theme: 'striped', // Optional: adds some style
                margin: { top: 10, left: 10, right: 10, bottom: 10 },
                // tableWidth: 'auto', // Automatically adjust table width
                startY: 20, // Adjust this if the table starts too close to the top of the page
                pageBreak: 'auto', // Automatically handle page breaks
                styles: {
                    cellPadding: 2, // Adjust padding if needed
                    fontSize: 10, // Adjust font size if needed
                    halign: 'center', // Horizontal alignment of text
                    valign: 'middle' // Vertical alignment of text
                },
                headStyles: {
                    fillColor: [255, 255, 255], // Header background color
                    textColor: [0, 0, 0], // Header text color
                    fontSize: 12, // Font size for headers
                    halign: 'center', // Horizontal alignment of header text
                    valign: 'middle', // Vertical alignment of header text
                },
                didParseCell: (data) => {
                    // This callback allows you to make further adjustments if needed
                    if (data.row.index === 0) { // Header row
                        data.cell.styles.cellWidth = 'auto'; // Ensure header cells have auto width
                    }
                },
                // Adjust column widths as needed
                // columnStyles: {
                //     0: { cellWidth: 30 }, // Example: set width for the first column
                //     1: { cellWidth: 40 }, // Set width for the second column
                //     2: { cellWidth: 40 }, // Set width for the second column
                //     3: { cellWidth: 40 }, // Set width for the second column
                //     4: { cellWidth: 40 }, // Set width for the second column
                //     // Add more as needed
                // },
                // Ensure the table fits within the page bounds
            };

            autoTable(doc, options)

            doc.save('table.pdf')
        }
    }
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
    const fetchTickersFunc = async () => {
        // context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
        // context.setLoaderState(false)
    }
    const handleChartView = (e) => {
        setSelectedView(e.target.value)
    }
    const handleDateRange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: Number(e.target.value) })
    }
    const searchBestStocks = (e) => {
        const value = e.target.value;
        setBestStocksFiltered(searchTable(rankingData?.bestFiveStocks, value))
    }
    const searchWorstStocks = (e) => {
        const value = e.target.value;
        setWorstStocksFiltered(searchTable(rankingData?.worstFiveStocks, value))
    }
    const handleCloseModal = () => {
        setHistoryModal(false);
    };
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
            formData.append('metaDataName', 'Tickers_Watchlist');
            formData.append('myfile', file);
            console.log("formData", formData)
            const upload = await fetch(process.env.NEXT_PUBLIC_BASE_URL_V2 + "uploadFileTickerImport", {
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
    const filterBydate = async (date) => {
        context.setLoaderState(true)
        try {
            const getStocks = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getDataByWeek?metadataName=Tickers_Watchlist&date=${date}&_=${new Date().getTime()}`)
            const getStocksRes = await getStocks.json()
            setTableData(getStocksRes)
            setFilterData(getStocksRes)
            setHistoryModal(false)
        } catch (error) {
            console.log("Error: ", error)
        }
        context.setLoaderState(false)
    }
    const rankingPDF = async () => {
        context.setLoaderState(true)
        try {
            const getPDF = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}generateTickerRankPDF?metadataName=Tickers_Watchlist&date1=1900-01-01&date2=1900-01-01&_=${new Date().getTime()}`)
            const getPDFRes = await getPDF.json()
            window.open(getPDFRes?.responseStr, "_blank")
        } catch (error) {
            console.log("Error: ", error)
        }
        context.setLoaderState(false)
    }
    const pdfDownload = async () => {
        context.setLoaderState(true)
        try {
            const getPDF = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}generateTickerPDF?metadataName=Tickers_Watchlist&_=${new Date().getTime()}`)
            const getPDFRes = await getPDF.json()
            window.open(getPDFRes?.responseStr, "_blank")
        } catch (error) {
            console.log("Error: ", error)
        }
        context.setLoaderState(false)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            isHighPerforming,
            rankWithinTableW,
            relativeStrengthW,
            priceVs20DAvgW,
            salesAvgW,
            priceSalesW,
            ebitdaW,
            grossMarginW,
            roicW,
            priceEarningW,
            priceFreeW,
        } = formValues;

        const url = new URL('https://jharvis.com/JarvisV2/getCalculateTicker');
        url.searchParams.append('metadataName', 'Tickers_Watchlist');
        url.searchParams.append('date', '');
        url.searchParams.append('rankWithinTable', rankWithinTableW || '10');
        url.searchParams.append('relativeStrength', relativeStrengthW || '');
        url.searchParams.append('priceVs20DAvg', priceVs20DAvgW || '');
        url.searchParams.append('salesAvg', salesAvgW || '');
        url.searchParams.append('priceSales', priceSalesW || '');
        url.searchParams.append('ebitda', ebitdaW || '');
        url.searchParams.append('grossMargin', grossMarginW || '');
        url.searchParams.append('roic', roicW || '');
        url.searchParams.append('priceEarning', priceEarningW || '');
        url.searchParams.append('priceFree', priceFreeW || '');
        url.searchParams.append('isHighPerforming', isHighPerforming);
        context.setLoaderState(true)
        try {
            const response = await fetch(url.toString());
            const data = await response.json();
            if (data.length > 0) {
                setTableData(data)
                setFilterData(data)
                setCalculate(false)
            }
            if (data.length == 0) {
                Swal.fire({ title: "No data found", confirmButtonColor: "#719B5F" });
            }
            console.log(data); // Handle the response data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        context.setLoaderState(false)
    };
    const handleReset = () => {
        setFormValues(initialFormValues);
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleReportData = (data) => {
        setReportTicker(data)
        setReportModal(true)
    }
    const options = {
        replace: (elememt) => {
            if (elememt?.name === 'a') {
                return (
                    <a onClick={() => { handleReportData(elememt?.children[0]?.data) }} href='#'>
                        {typeof (elememt?.children[0]?.data) == "string" ? parse(elememt?.children[0]?.data) : elememt?.children[0]?.data}
                    </a>
                );
            }
        }
    }
    const options2 = {
        replace(elememt) {
            if (elememt?.name == 'img') {
                return (
                    <React.Fragment>
                        <img className="img-responsive" src={elememt?.attribs?.src} />
                        <a onClick={() => { handleReportData(elememt?.next?.children[0]?.data) }} href='#'>
                            {typeof (elememt?.next?.children[0]?.data) == "string" ? parse(elememt?.next?.children[0]?.data) : elememt?.next?.children[0]?.data}
                        </a>
                    </React.Fragment>
                )
            }
        }
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
            return parse(imgTag, options2);
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
            return parse(matchOnlyAnchor[1], options);
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
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        if (screen.width < 576) {
            if (isExpanded) {
                let max = 0
                Array.from(contentRef.current.children).map((item) => {
                    if (max < item.getBoundingClientRect().width) {
                        max = item.getBoundingClientRect().width
                    }
                });
                setContentWidth(`${max + 8}px`);
                return
            }
            else {
                setContentWidth(`0px`);
            }
        }
        if (isExpanded) {
            if (contentRef.current) {
                let count = 0
                const totalWidth = Array.from(contentRef.current.children).reduce((acc, child) => {
                    count = count + 6
                    return acc + child.getBoundingClientRect().width;
                }, 0);
                // setContentWidth(`${totalWidth+count}px`);
                setContentWidth(`${totalWidth + count}px`);
            }
        }
        else {
            if (contentRef.current) {
                const totalWidth = Array.from(contentRef.current.children).reduce((acc, child) => {
                    return acc + child.getBoundingClientRect().width;
                }, 0);
                setContentWidth(`${0}px`);
            }
        }
    }, [isExpanded]);
    useEffect(() => {
        setChartData(chartHistory.map(item => parseFloat(item[selectedView])))
        //console.log("data", [...new Set(chartHistory.map(item => Math.round(item.element7)))])
    }, [chartHistory, selectedView])
    useEffect(() => {
        if (rankingData?.bestFiveStocks?.length > 0) {
            setBestStocksFiltered(rankingData?.bestFiveStocks)
        }
        if (rankingData?.worstFiveStocks?.length > 0) {
            setWorstStocksFiltered(rankingData?.worstFiveStocks)
        }
    }, [rankingData, activeView])
    useEffect(() => {
        fetchColumnNames()
        fetchTickersFunc()
    }, [])
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
        if (compareData && activeView == "History") {
            setRankingData(compareData)
        }
    }, [compareData, activeView])

    const handleColumnToggle = (column) => {
        setVisibleColumns(prevState =>
            prevState.includes(column)
                ? prevState.filter(col => col !== column)
                : [...prevState, column]
        );
    };

    const handleAllCheckToggle = () => {
        if (visibleColumns.length === columnNames.length) {
            setVisibleColumns([]);
        } else {
            const allColumnNames = columnNames.map(col => col.elementInternalName);
            setVisibleColumns(allColumnNames);
        }
    };

    return (
        <>
            <StockHistoryModal open={historyModal} handleClose={handleCloseModal} setCompareData={setCompareData} setSelectedOption={setActiveView} filterBydate={filterBydate} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <Breadcrumb />
                        <div className={`collapsible-container ${isExpanded ? 'expanded' : ''}`}>
                            <span>{activeView + " :"}</span><button className="main-button ms-2 btn-primary" onClick={toggleExpand}>
                                <i className={isExpanded ? "mdi mdi-chevron-right" : "mdi mdi-chevron-left"}></i>+7 Action
                            </button>
                            <div className="collapsible-content" style={{ maxWidth: "max-content", width: contentWidth }} ref={contentRef}>
                                <button className={`h-100 collapsible-item ${activeView == "History" ? ` active` : ''}`} type="button" title="History" onClick={() => { setHistoryModal(true),setIsExpanded(false) }}><span>History</span></button>
                                <button className={`h-100 collapsible-item${activeView == "Ticker Home" ? ` active` : ''}`} type="button" title="Bond Home" onClick={tickerHome}><span>Ticker Home</span></button>
                                <button className={`h-100 collapsible-item${activeView == "Ranking" ? ` active` : ''}`} type="button" title="Ranking" onClick={ranking}><span>Ranking</span></button>
                                <button className={`h-100 collapsible-item${activeView == "Ranking PDF" ? ` active` : ''}`} type="button" title="Ranking PDF" onClick={rankingPDF}><span>Ranking PDF</span></button>
                                <button className={`h-100 collapsible-item${activeView == "Calculate" ? ` active` : ''}`} type="button" title="Calculate" onClick={() => { setCalculate(true), setIsExpanded(false) }}><span>Calculate</span></button>
                                <button className={`h-100 collapsible-item${activeView == "Chart View" ? ` active` : ''}`} type="button" title="Chart View" onClick={charts}><span>Chart View</span></button>
                                <button className="h-100  collapsible-item" type="button" title="Reset" onClick={reset}><span>Reset</span></button>
                            </div>
                        </div>
                    </div>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Stocks
                        </h3>

                    </div>
                    <div className="selection-area mb-3 d-flex align-items-end">
                        <Form onSubmit={uploadFile} encType="multipart/form-data" className='w-100'>
                            <input type="hidden" name="metaDataName" value="Tickers_Watchlist" />
                            <div className="d-flex align-items-end flex-wrap mb-3">
                            <Select className='mb-0 me-2 col-md-3' isMulti value={selectedTicker && selectedTicker.split(",").map((item) => ({ value: item, label: item }))} onChange={handleSelect} style={{ minWidth: "200px", maxWidth: "300px",flex:"2" }} options={
                                tickers ? tickers.map((item, index) => (
                                    { value: item.element1, label: item.element1 }
                                ))
                                : [{value:"Loading",label:"Loading..."}]
                            } />
                            <div className="actions">
                                <button className={"btn btn-primary mb-0"} type="button" onClick={getHistoryByTicker}><span>Go</span></button>
                            </div>
                            <div className="form-group me-2">
                                <label htmlFor="uploadFile">Upload File</label>
                                <input id="uploadFile" type="file" name="myfile" className='border-1 form-control' required onChange={handleFileChange} />
                            </div>
                            <div className="actions">
                                <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                            </div>
                            </div>
                        </Form>
                    </div>
                    {/* <div className="d-flex mb-3">
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={() => { setCalculate(true) }}><span>Calculate</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Chart View" && " active")} type="button" onClick={charts}><span>Chart View</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ticker Home" && " active")} type="button" onClick={tickerHome}><span>Ticker Home</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ranking" && " active")} type="button" onClick={ranking}><span>Ranking</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={rankingPDF}><span>Ranking PDF</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary" + (activeView == "History" && " active")} type="button" title="History" onClick={() => { setHistoryModal(true) }}><span>History</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="PDF" onClick={pdfDownload}><span>PDF</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="Reset" onClick={reset}><span>Reset</span></button>
                    </div> */}
                    {activeView == "Ticker Home" &&
                        <>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3 d-flex">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" title='EXCEL' onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                    <div className="column-selector">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="btn btn-primary mb-0" id="dropdown-basic">
                                                Columns
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                                style={{
                                                    width: "160px",
                                                    maxHeight: "400px",
                                                    overflowY: "auto",
                                                    overflowX: "hidden",
                                                    marginTop: "1px",
                                                }}
                                            >
                                                <Dropdown.Item
                                                    as="label"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        whiteSpace: "normal",
                                                        wordWrap: "break-word",
                                                        display: "inline-block",
                                                        width: "100%",
                                                        padding: "6px",
                                                        fontWeight: "bold",
                                                    }}
                                                    className="columns-dropdown-item"
                                                >
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={visibleColumns.length === columnNames.length}
                                                        onChange={handleAllCheckToggle}
                                                        label="Select All"
                                                        id={`${activeView}-selectAll`}
                                                    />
                                                </Dropdown.Item>
                                                {columnNames.map((column, index) => (
                                                    <Dropdown.Item
                                                        as="label"
                                                        key={index}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            whiteSpace: "normal",
                                                            wordWrap: "break-word",
                                                            display: "inline-block",
                                                            width: "100%",
                                                            padding: "6px",
                                                        }}
                                                        className="columns-dropdown-item"
                                                    >
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={visibleColumns.includes(column.elementInternalName)}
                                                            onChange={() => handleColumnToggle(column.elementInternalName)}
                                                            label={column.elementDisplayName}
                                                            id={`checkId${column.elementDisplayName}${index}`}
                                                        />
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
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
                                <table className="table border display no-footer dataTable stock-table" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {columnNames.map((columnName, index) => (
                                                visibleColumns.includes(columnName.elementInternalName) && (
                                                    <th key={index} onClick={() => handleSort(columnName.elementInternalName)}
                                                    className={columnName.elementInternalName === "element1" ? "sticky-left" : ""}
                                                    >{columnName.elementDisplayName} {getSortIcon(columnName, sortConfig)}</th>
                                                )
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterData.map((rowData, rowIndex) => (
                                            <tr key={rowIndex} style={{ overflowWrap: 'break-word' }}>
                                                {
                                                    columnNames.map((columnName, colIndex) => {
                                                        if (!visibleColumns.includes(columnName.elementInternalName)) return null;
                                                        let content;

                                                        if (columnName.elementInternalName === 'element3') {
                                                            // content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                            content = rowData[columnName.elementInternalName];
                                                        } else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                            content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                        }
                                                        else if (columnName.elementInternalName === 'element1') {
                                                            content = extractAndConvert(rowData[columnName.elementInternalName])
                                                        }
                                                        else if (columnName.elementInternalName === 'element1') {
                                                            content = parse(rowData[columnName.elementInternalName], options2)
                                                        }
                                                        else {
                                                            content = rowData[columnName.elementInternalName];
                                                        }
                                                        if (typeof (content) == 'string' && columnName.elementInternalName != "element1") {
                                                            content = parse(content, options)
                                                        }
                                                        if(columnName.elementInternalName === 'element1'){
                                                            return <td key={colIndex} className='sticky-left'>{content}</td>;
                                                        }
                                                        return <td key={colIndex}>{content}</td>;
                                                    })
                                                }
                                            </tr>
                                        ))}
                                        {filterData?.length == 0 && <tr><td colSpan={columnNames?.length}>No data available</td></tr>}
                                    </tbody>

                                </table>

                            </div>
                            {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                        </>
                    }
                    {
                        activeView == "Chart View" &&
                        <>
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
                                <div className="d-flex align-items-center mx-2">
                                    <label className='mb-0'><b>{`Year : ${dateRange?.startDate} - ${dateRange?.endDate}`}</b></label>
                                    <button className='ms-2 btn p-0 text-primary' onClick={() => { setDateModal(true) }} type='button'><FilterAlt /></button>
                                </div>
                            </div>
                            {/* <h3>Chart View For {ViewOptions[selectedView]}</h3> */}
                            {/* <BarChart data={data} /> */}
                            {chartHistory.length > 0 && <HightChart data={chartHistory?.map((item) => [new Date(item['lastUpdatedAt']).getTime(), parseFloat(item[selectedView])])} title={selectedView && `Chart View For ${ViewOptions[selectedView].displayName}`} />}
                        </>
                    }
                    {
                        activeView == "Ranking" &&
                        <>

                            <h3 className='mb-3'>Best Stocks</h3>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={searchBestStocks} />
                                    {/* <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select> */}
                                </div>
                            </div>
                            <div className="table-responsive mb-4">
                                <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {Object.entries(bestFiveStockColumn).map(([columnName, displayName]) => (
                                                <th key={columnName}>{displayName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bestStocksFiltered.map((item, index) => {
                                            return <tr key={"best" + index}>
                                                {Object.entries(bestFiveStockColumn).map(([columnName, displayName]) => (
                                                    <td key={item[columnName] + index}>{item[columnName]}</td>
                                                ))}
                                            </tr>
                                        })}
                                        {bestStocksFiltered?.length == 0 &&
                                            <tr><td className='text-center' colSpan={Object.entries(bestFiveStockColumn)?.length}>No data available</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <HightChart data={compareData?.bestFiveStocks?.map((item) => [item['bestMovedStock'], parseFloat(item['percentageChangeRise'])])} title={"Ticker Performance"} typeCheck={{ categories: compareData?.bestFiveStocks?.map((item) => item?.bestMovedStock) }} yAxisTitle={"Risn in %"} titleAlign={"center"} subTitle={`Best Twenty`} />
                            <h3 className='mb-3'>Worst Stocks</h3>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={searchWorstStocks} />
                                    {/* <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select> */}
                                </div>
                            </div>
                            <div className="table-responsive mb-4">
                                <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {Object.entries(worstFiveStockColumn).map(([columnName, displayName]) => (
                                                <th key={columnName}>{displayName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {worstStocksFiltered.map((item, index) => {
                                            return <tr key={"worst" + index}>
                                                {Object.entries(worstFiveStockColumn).map(([columnName, displayName]) => (
                                                    <td key={item[columnName] + index}>{item[columnName]}</td>
                                                ))}
                                            </tr>
                                        })}
                                        {worstStocksFiltered?.length == 0 &&
                                            <tr><td className='text-center' colSpan={Object.entries(worstFiveStockColumn)?.length}>No data available</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <HightChart data={compareData?.worstFiveStocks?.map((item) => [item['worstMovedStock'], parseFloat(item['percentageChangeDrop'])])} title={"Ticker Performance"} typeCheck={{ categories: compareData?.bestFiveStocks?.map((item) => item?.bestMovedStock) }} yAxisTitle={"Risn in %"} titleAlign={"center"} subTitle={"Worst Twenty"} />
                        </>
                    }
                    {
                        activeView == "History" &&
                        <>
                            <h3 className='mb-3'>Best Stocks</h3>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={searchBestStocks} />
                                </div>
                            </div>
                            <div className="table-responsive mb-4">
                                <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                        <tr>
                                            {Object.entries(bestFiveStockColumn).map(([columnName, displayName]) => (
                                                <th key={columnName}>{displayName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bestStocksFiltered.map((item, index) => {
                                            return <tr key={"best" + index}>
                                                {Object.entries(bestFiveStockColumn).map(([columnName, displayName]) => (
                                                    <td key={item[columnName] + index}>{item[columnName]}</td>
                                                ))}
                                            </tr>
                                        })}
                                        {bestStocksFiltered?.length == 0 &&
                                            <tr><td className='text-center' colSpan={Object.entries(bestFiveStockColumn)?.length}>No data available</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <HightChart data={compareData?.bestFiveStocks?.map((item) => [item['bestMovedStock'], parseFloat(item['percentageChangeRise'])])} title={"Ticker Performance"} typeCheck={{ categories: compareData?.bestFiveStocks?.map((item) => item?.bestMovedStock) }} yAxisTitle={"Risn in %"} titleAlign={"center"} subTitle={`Best Twenty`} />
                            <h3 className='my-3'>Worst Stocks</h3>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF('worst-stock-table') }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={searchWorstStocks} />
                                </div>
                            </div>
                            <div className="table-responsive mb-4">
                                <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="worst-stock-table">
                                    <thead>
                                        <tr>
                                            {Object.entries(worstFiveStockColumn).map(([columnName, displayName]) => (
                                                <th key={columnName}>{displayName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {worstStocksFiltered.map((item, index) => {
                                            return <tr key={"worst" + index}>
                                                {Object.entries(worstFiveStockColumn).map(([columnName, displayName]) => (
                                                    <td key={item[columnName] + index}>{item[columnName]}</td>
                                                ))}
                                            </tr>
                                        })}
                                        {worstStocksFiltered?.length == 0 &&
                                            <tr><td className='text-center' colSpan={Object.entries(worstFiveStockColumn)?.length}>No data available</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <HightChart data={compareData?.worstFiveStocks?.map((item) => [item['worstMovedStock'], parseFloat(item['percentageChangeDrop'])])} title={"Ticker Performance"} typeCheck={{ categories: compareData?.bestFiveStocks?.map((item) => item?.bestMovedStock) }} yAxisTitle={"Risn in %"} titleAlign={"center"} subTitle={"Worst Twenty"} />
                        </>
                    }
                </div>
            </div>
            <Modal show={calculateModal} onHide={() => { setCalculate(false) }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Analysis - Ticker Watchlist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Performance</label>
                                    <select name="isHighPerforming" className='form-select' value={formValues.isHighPerforming} onChange={handleChange}>
                                        <option value="true">Best Performing</option>
                                        <option value="false">Worst Performing</option>
                                        <option value="NA">NA</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Rank Less Than(for consecutive 3 weeks)</label>
                                    <input type="text" className="form-control" name='rankWithinTableW' value={formValues.rankWithinTableW} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Relative Strength Greater Than</label>
                                    <input type="text" className="form-control" name='relativeStrengthW' value={formValues.relativeStrengthW} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Price Vs 20 Day Average Greater Than</label>
                                    <input type="text" className="form-control" name='priceVs20DAvgW' value={formValues.priceVs20DAvgW} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Sales 3 Year Average Greater Than</label>
                                    <input type="text" className="form-control" name='salesAvgW' value={formValues.salesAvgW} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Price/Sales Less Than</label>
                                    <input type="text" className="form-control" name='priceSalesW' value={formValues.priceSalesW} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">EV/Ebitda Less Than</label>
                                    <input type="text" className="form-control" name='ebitdaW' value={formValues.ebitdaW} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Gross Margin Greater Than</label>
                                    <input type="text" className="form-control" name='grossMarginW' value={formValues.grossMarginW} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">ROIC Greater Than</label>
                                    <input type="text" className="form-control" name='roicW' value={formValues.roicW} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Price/Earning Less Than</label>
                                    <input type="text" className="form-control" name='priceEarningW' value={formValues.priceEarningW} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Price/Free CashFlow Less Than</label>
                                    <input type="text" className="form-control" name='priceFreeW' value={formValues.priceFreeW} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" type='button'>Cancel</button>
                        <button className="btn btn-primary" type='button' onClick={handleReset}>Reset</button>
                        <button className="btn btn-primary">Compare</button>
                    </Modal.Footer>
                </Form>
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
            <ReportTable name={reportTicker} open={reportModal} handleCloseModal={closeReportModal} news={true}/>
            {isExpanded && <div className='backdrop'></div>}
        </>
    )
}
