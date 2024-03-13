import { useContext, useEffect, useState } from 'react'
import Navigation from '../../../components/navigation';
import Sidebar from '../../../components/sidebar';
import Loader from '../../../components/loader';
import { Context } from '../../../contexts/Context';
import parse from 'html-react-parser';
import { calculateAverage, searchTable } from '../../../utils/utils';
import { getImportsData } from '../../../utils/staticData';
import BondsHistoryModal from '../../../components/BondHstoryModal';
import { Autocomplete, TextField } from '@mui/material';
import BondChart from '../../../components/charts';
import { Pagination } from '../../../components/Pagination';
import SliceData from '../../../components/SliceData';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function BusinessPipeline() {
    const [columnNames, setColumnNames] = useState([
        { "data": "name" },
        { "data": "opportunity" },
        { "data": "opportunityComeAbout" },
        { "data": "amounts" },
        { "data": "status" },
        { "data": "mostRecentActivity" },
        { "data": "dateAdded" },
        { "data": "lastContact" },
        { "data": "followUpAction" },
        { "data": "connections" },
        { "data": "autoFinding" },
        { "data": "otherOpportunities" },
        { "data": "investorLifecycle" },
        { "data": "accreditedInvestor" },
        { "data": "advisorName" }
    ])
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit,setLimit] = useState(25)

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const filter = (e) => {
        const value = e.target.value;
        setFilterData(searchTable(tableData, value))
    }
    const fetchData = async () => {
        try {
            const getBonds = await fetch("https://jharvis.com/JarvisV2/getAllBusinessPipeline?_=1710158570127")
            const getBondsRes = await getBonds.json()
            setTableData(getBondsRes)
            setFilterData(getBondsRes)
        }
        catch (e) {
            console.log("error", e)
        }
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

      const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } 
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig && sortConfig.key === columnName) {
            return sortConfig.direction === 'asc' ? <div className="arrow-icons up">
            <ArrowDropUpIcon/>
            <ArrowDropDownIcon/>
            </div>
            :
            <div className="arrow-icons down">
            <ArrowDropUpIcon/>
            <ArrowDropDownIcon/>
            </div>
        }
        else{
            return <div className="arrow-icons">
            <ArrowDropUpIcon/>
            <ArrowDropDownIcon/>
            </div>
        }
        return null;
    };

    useEffect(() => {
        fetchData()
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
                const startIndex = (currentPage - 1) * limit;
                const endIndex = startIndex + limit;
                items = items.slice(startIndex, endIndex);
                setFilterData(items);
            }
        }
        run();
    }, [currentPage, tableData, sortConfig]);
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
                                    </span>Business Pipeline
                                </h3>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    {/* <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={exportPdf}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button> */}
                                    <button className="dt-button buttons-html5 btn-primary" type="button"><span>Add Pipeline</span></button> 
                                </div>
                                <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                            </div>
                            <div className="table-responsive">
                                <table className="table border display no-footer dataTable" style={{ width: "", marginLeft: "0px" }} role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                                    <thead>
                                         <tr>
                                            {columnNames.map((columnName, index) => (
                                                <th key={index} onClick={() => handleSort(columnName.data)}>
                                                    {columnName.data}
                                                    {getSortIcon(columnName.data)}
                                                    </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filterData.map((rowData, rowIndex) => (
                                            <tr key={rowIndex} style={{ overflowWrap: 'break-word' }}>
                                                {
                                                    columnNames.map((columnName, colIndex) => {
                                                        let content;
                                                        content = rowData[columnName.data]
                                                        return <td key={colIndex}>{content}</td>;
                                                    })
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                                {tableData.length > 0 && <Pagination currentPage={currentPage} totalItems={tableData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage}/> } 
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
