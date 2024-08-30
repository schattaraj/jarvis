import React from 'react'
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
import { Form, Modal } from 'react-bootstrap';
import HightChart from '../../components/HighChart';
import { FilterAlt } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import StockHistoryModal from '../../components/StockHistoryModal';
import Breadcrumb from '../../components/Breadcrumb';
import { FaGlasses } from 'react-icons/fa';
import ReportTable from '../../components/ReportTable';
const extraColumns = [
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
    const [filterData, setFilterData] = useState([{
        idMarketData: 10120699,
        metadataName: "Tickers_Watchlist",
        element1: "QQQJ",
        element2: "- ",
        element3: "- ",
        element4: "<a href='#' data-toggle='modal' onclick='openCompanyModal('Invesco NASDAQ Next Gen 100 ETF')'>Invesco NASDAQ Next Gen 100 ETF</a>",
        element5: "",
        element6: "0.17",
        element7: "0.0066",
        element8: "-0.013",
        element9: "0.997",
        element10: "25.8",
        element11: "0.083",
        element12: "0.008",
        element13: "- ",
        element14: "",
        element15: "25.87",
        element16: "25.27",
        element17: "24.78",
        element18: "49.7",
        element19: "709.0",
        element20: "",
        element21: "$21.15 $36.24",
        element22: "- ",
        element23: "- ",
        element24: "- ",
        element25: "- ",
        element26: "- ",
        element27: "- ",
        element28: "- ",
        element29: "126238.0",
        element30: "- ",
        element31: "- ",
        element32: "- ",
        element33: "- ",
        element34: "- ",
        element35: "- ",
        element36: null,
        element37: null,
        element38: null,
        element39: null,
        element40: null,
        element41: null,
        element42: null,
        element43: null,
        element44: null,
        element45: null,
        element46: null,
        element47: null,
        element48: null,
        element49: null,
        element50: null,
        element51: null,
        element52: null,
        element53: null,
        element54: null,
        element55: null,
        element56: null,
        element57: null,
        element58: null,
        element59: null,
        element60: null,
        element61: null,
        element62: null,
        element63: null,
        element64: null,
        element65: null,
        element66: null,
        element67: null,
        element68: null,
        element69: null,
        element70: null,
        element71: null,
        element72: null,
        element73: null,
        element74: null,
        element75: null,
        element76: null,
        element77: null,
        element78: null,
        element79: null,
        element80: null,
        element81: null,
        element82: null,
        element83: null,
        element84: null,
        element85: null,
        element86: null,
        element87: null,
        element88: null,
        element89: null,
        element90: null,
        element91: null,
        element92: null,
        element93: null,
        element94: null,
        element95: null,
        element96: null,
        element97: null,
        element98: null,
        element99: null,
        element100: null,
        amount: null,
        isSoftDeleted: "0",
        status: null,
        lastUpdatedBy: "User",
        lastUpdatedAt: "2023-07-07T17:03:40.627+0000",
        attractionIndex: null
    },
    {
        idMarketData: 10120700,
        metadataName: "Tickers_Watchlist",
        element1: "YNDX",
        element2: "- ",
        element3: "- ",
        element4: "<a href='#' data-toggle='modal' onclick='openCompanyModal('Yandex')'>Yandex</a>",
        element5: "Communication Services",
        element6: "0.0",
        element7: "0.0",
        element8: "0.0",
        element9: "1.0",
        element10: "18.94",
        element11: "0.0",
        element12: "- ",
        element13: "0.007",
        element14: "3.75;3.75;3.75;3.75;0.00",
        element15: "18.94",
        element16: "18.94",
        element17: "18.94",
        element18: "20.7",
        element19: "6848.0",
        element20: "",
        element21: "$14.11 $87.11",
        element22: "12.6",
        element23: "2.3",
        element24: "29.6",
        element25: "0.182",
        element26: "5.3",
        element27: "0.2",
        element28: "9.3",
        element29: "- ",
        element30: "-0.738",
        element31: "0.462",
        element32: "7268.0",
        element33: "1.3",
        element34: "0.551",
        element35: "0.139",
        element36: null,
        element37: null,
        element38: null,
        element39: null,
        element40: null,
        element41: null,
        element42: null,
        element43: null,
        element44: null,
        element45: null,
        element46: null,
        element47: null,
        element48: null,
        element49: null,
        element50: null,
        element51: null,
        element52: null,
        element53: null,
        element54: null,
        element55: null,
        element56: null,
        element57: null,
        element58: null,
        element59: null,
        element60: null,
        element61: null,
        element62: null,
        element63: null,
        element64: null,
        element65: null,
        element66: null,
        element67: null,
        element68: null,
        element69: null,
        element70: null,
        element71: null,
        element72: null,
        element73: null,
        element74: null,
        element75: null,
        element76: null,
        element77: null,
        element78: null,
        element79: null,
        element80: null,
        element81: null,
        element82: null,
        element83: null,
        element84: null,
        element85: null,
        element86: null,
        element87: null,
        element88: null,
        element89: null,
        element90: null,
        element91: null,
        element92: null,
        element93: null,
        element94: null,
        element95: null,
        element96: null,
        element97: null,
        element98: null,
        element99: null,
        element100: null,
        amount: null,
        isSoftDeleted: "0",
        status: null,
        lastUpdatedBy: "User",
        lastUpdatedAt: "2023-07-07T17:03:40.627+0000",
        attractionIndex: null
    },
    {
        idMarketData: 10120701,
        metadataName: "Tickers_Watchlist",
        element1: "<img style='width:25%' class='img-responsive' src='data:image/jpg;base64,/9j/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAAUCAKKA+gEASIAAhEBAxEBBCIA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADgQBAAIRAxEEAAA/AOfooorlPPPn+iiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAoo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iiiiipNAooooooooAKKKKKKKKACiiimyRpKm2RQy+hrMudKwC1uSf9g/0NatFdFDFVaDvB/LocOMy/D4uNqsde/X7zG8Q+FND8VWn2bWtNgu1xhXZcOn+6w5H4GvAvHXwB1DSklv/C8kmo2o+ZrN/wDXoP8AZxw4/I+xr6WormCCpIIII4INJW/d2aXSjJ2uOjYrEmheCQxyDBH619LhMdDEqy0l2PhcyyqrgZXesHs/8+x8BOjxSNHIrI6kqysMEEdQRTa+tviT8I9N8a28l9YrFZa4oys4GEn/ANmQD/0LqPccV8ravpF/oWqT6bqds9tdwNtkjccj3HqD1BHBFR0UUV2nllKiiiiiiigAooooooooAKKKKv6T/wAfTf7h/mK2axtJ/wCPpv8AcP8AMVs18vm3+8v0R9/w7/uK9Wem/AT/AJKnaf8AXtN/6DX1lXyb8BP+Sp2n/XtN/wCg19ZUUUUV5p7oUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFNf7jfQ06mv9xvoa5eiiivuj8jPgKiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKK6O2/wCPWH/cX+Vc5XR23/HrD/uL/KvGzr+HH1PqOF/41T0X5hX254A/5J14a/7Blv8A+i1r4jr7c8Af8k68Nf8AYMt//Ra1LRRRXzx9odHRRRWDqP8Ax/y/h/IVVq1qP/H/AC/h/IVVr7PC/wACHovyPy7MP97q/wCKX5s+N/i//wAlW1//AK7J/wCi1riK7f4v/wDJVtf/AOuyf+i1riKK0dKljj87e6rnGNxxnrWdRTxFFV6bpt2uLBYp4WvGtFXav+KsFez/AAA8SaJ4dn19tY1S1sRMtuIvPfbvwZM4+mR+deMUV0f2mD/nvH/32KPtMH/PeP8A77Fc5RXmf2LT/mZ73+tF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J7r8j4niXCuFaNdbS0fqv+B+R4h+0hobXGg6Trca5NpM0EuB/DIAQT7Arj/gVfN9fdPifQbfxP4Z1DRbk4ju4SgbGdjdVb8GAP4V8Qanp11pGqXWnXsRiurWVopUPZgcH6j3ptFFFewfMlWiiiiiiigAooorfsZIHt/3ChMfeXuDVmubhmeCQSRnBH61vW1ylzHuXgj7y+lfMZhgpUZOotYv8PU++yXNaeJgqMkozXTZNeX+X9L6i+Amq+F5vCzadpUIttYjAe/SRgZJj0EgPdOcAfw598t67XwbpOr3+hapb6nply9vd27bo5E7ex9QehB4Ir63+GvxLsPH2l7W2W2sW6j7Ta54PbenqpP4g8HsTNRRRXmHvHd0UUVSvrEXA8yMASj/AMerFIKkgggjgg109Ur6xFwPMjAEo/8AHq9jL8w9nalVenR9v+B+R8znWS+2viMOve6rv/wfz9d/DPjD8H/7RE/iXw1bf6Zy95ZRj/XeroP7/qP4uo5+98519/14Z8YPg9/aAuPEvhq3/wBM5kvLKNf9d6ug/v8AqP4uo5+9iUUpBUkEEEcEGkr6I+JasfOdFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFWtO/4/4vx/kaq1a07/j/AIvx/kawxX8Cfo/yOvL/APe6X+KP5oK6b4df8lI8N/8AYRg/9DFczXTfDr/kpHhv/sIwf+hit6iiivjD9RPtmiiiiuXrqK5evdyT/l58v1PkeKf+XX/b36FDW/8AkAaj/wBesv8A6Ca+D6+8Nb/5AGo/9esv/oJr4Poooor3T5EKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooooooAKKKKKKKKACiiiiiiigAooooro7b/j1h/3F/lXOV0dt/x6w/7i/wAq8bOv4cfU+o4X/jVPRfmFfbngD/knXhr/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UUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUUUUUUAFFFFFFFFABRRRRRRRQAUUUV//2Q=='/> <a href='#' data-toggle='modal' onclick='openModal('EQT')'>EQT</a>",
        element2: "2.0",
        element3: "1.0",
        element4: "<a href='#' data-toggle='modal' onclick='openCompanyModal('EQT')'>EQT</a>",
        element5: "Energy",
        element6: "0.79",
        element7: "0.0201",
        element8: "-0.025",
        element9: "1.008",
        element10: "40.07",
        element11: "0.196",
        element12: "0.015",
        element13: "0.096",
        element14: "5.24;5.05;4.52;4.44;4.43",
        element15: "39.76",
        element16: "36.92",
        element17: "36.03",
        element18: "54.8",
        element19: "14499.0",
        element20: "-2.7",
        element21: "$4.21 $51.97",
        element22: "3.5",
        element23: "1.2",
        element24: "6.6",
        element25: "0.372",
        element26: "2.3",
        element27: "0.3",
        element28: "1.0",
        element29: "5989446.0",
        element30: "0.215",
        element31: "0.593",
        element32: "17843.0",
        element33: "1.4",
        element34: "0.649",
        element35: "0.269",
        element36: null,
        element37: null,
        element38: null,
        element39: null,
        element40: null,
        element41: null,
        element42: null,
        element43: null,
        element44: null,
        element45: null,
        element46: null,
        element47: null,
        element48: null,
        element49: null,
        element50: null,
        element51: null,
        element52: null,
        element53: null,
        element54: null,
        element55: null,
        element56: null,
        element57: null,
        element58: null,
        element59: null,
        element60: null,
        element61: null,
        element62: null,
        element63: null,
        element64: null,
        element65: null,
        element66: null,
        element67: null,
        element68: null,
        element69: null,
        element70: null,
        element71: null,
        element72: null,
        element73: null,
        element74: null,
        element75: null,
        element76: null,
        element77: null,
        element78: null,
        element79: null,
        element80: null,
        element81: null,
        element82: null,
        element83: null,
        element84: null,
        element85: null,
        element86: null,
        element87: null,
        element88: null,
        element89: null,
        element90: null,
        element91: null,
        element92: null,
        element93: null,
        element94: null,
        element95: null,
        element96: null,
        element97: null,
        element98: null,
        element99: null,
        element100: null,
        amount: null,
        isSoftDeleted: "0",
        status: null,
        lastUpdatedBy: "User",
        lastUpdatedAt: "2023-07-07T17:03:40.627+0000",
        attractionIndex: null
    }
])
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
        context.setLoaderState(false)
    }
    const reset = () => {
        setActiveView("Ticker Home")
        setSelectedTicker(false)
        fetchData()
    }
    const fetchColumnNames = async () => {
        // context.setLoaderState(true)
        try {
            const columnApi = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getColumns?metaDataName=Tickers_Watchlist`)
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
        context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1718886601496")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
        context.setLoaderState(false)
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
                        {typeof(elememt?.children[0]?.data) == "string" ? parse(elememt?.children[0]?.data) : elememt?.children[0]?.data}
                    </a>
                );
            }
        }
    }
    const options2 = {
        replace: (elememt) => {
            if (elememt?.name == 'img') {
                return (
                    <>
                        <img className="img-responsive" src={elememt?.attribs?.src} />
                        <a onClick={() => { handleReportData(elememt?.next?.next?.children[0]?.data) }} href='#'>
                            {typeof(elememt?.next?.next?.children[0]?.data) == "string" ? parse(elememt?.next?.next?.children[0]?.data) : elememt?.next?.next?.children[0]?.data}
                        </a>
                    </>
                )
            }
        }
    }
    const closeReportModal = () => {
        setReportModal(false)
    }
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
    return (
        <>
            <StockHistoryModal open={historyModal} handleClose={handleCloseModal} setCompareData={setCompareData} setSelectedOption={setActiveView} filterBydate={filterBydate} />
            <div className="main-panel">
                <div className="content-wrapper">
                    <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Stocks
                        </h3>

                    </div>
                    <div className="selection-area mb-3 d-flex align-items-center">
                        <Select className='mb-0 me-2 col-md-3' isMulti value={selectedTicker && selectedTicker.split(",").map((item) => ({ value: item, label: item }))} onChange={handleSelect} style={{ minWidth: "200px", maxWidth: "300px" }} options={
                            tickers && tickers.map((item, index) => (
                                { value: item.element1, label: item.element1 }
                            ))
                        } />
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={getHistoryByTicker}><span>Go</span></button>
                        <Form onSubmit={uploadFile} encType="multipart/form-data">
                            <input type="hidden" name="metaDataName" value="Tickers_Watchlist" />
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="uploadFile">Upload File</label>
                                        <input id="uploadFile" type="file" name="myfile" className='border-1 form-control' required onChange={handleFileChange} />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="actions">
                                        <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                                    </div></div>
                            </div>
                        </Form>
                    </div>
                    <div className="selection-area mb-3" style={{ zIndex: "1" }}>

                    </div>
                    <div className="d-flex mb-3">
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={() => { setCalculate(true) }}><span>Calculate</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Chart View" && " active")} type="button" onClick={charts}><span>Chart View</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ticker Home" && " active")} type="button" onClick={tickerHome}><span>Ticker Home</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary" + (activeView == "Ranking" && " active")} type="button" onClick={ranking}><span>Ranking</span></button>
                        <button className={"dt-button h-100 buttons-excel buttons-html5 btn-primary"} type="button" onClick={rankingPDF}><span>Ranking PDF</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary" + (activeView == "History" && " active")} type="button" title="History" onClick={() => { setHistoryModal(true) }}><span>History</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="PDF" onClick={pdfDownload}><span>PDF</span></button>
                        <button className={"h-100 dt-button buttons-pdf buttons-html5 btn-primary"} type="button" title="Reset" onClick={reset}><span>Reset</span></button>
                    </div>
                    {activeView == "Ticker Home" &&
                        <>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={() => { generatePDF() }}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" title='EXCEL' onClick={() => { exportToExcel() }}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
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
                                                <th key={index} onClick={() => handleSort(columnName.elementInternalName)}>{columnName.elementDisplayName} {getSortIcon(columnName, sortConfig)}</th>
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
                                                            // content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                            content = rowData[columnName.elementInternalName];
                                                        } else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                            content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                        }
                                                        else if (columnName.elementInternalName === 'element1') {
                                                            content = parse(rowData[columnName.elementInternalName], options2)
                                                        }
                                                        else {
                                                            content = rowData[columnName.elementInternalName];
                                                        }
                                                        console.log("typeof (content)", typeof (content));
                                                        if (typeof (content) == 'string' && columnName.elementInternalName != "element1") {
                                                            content = parse(content, options)
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
            <ReportTable name={reportTicker} open={reportModal} handleCloseModal={closeReportModal} />
        </>
    )
}
