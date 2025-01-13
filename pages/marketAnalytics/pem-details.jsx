import { useContext, useEffect, useState } from 'react'
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import parse from 'html-react-parser';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
import { calculateAverage, exportToExcel, generatePDF, getSortIcon, searchTable } from '../../utils/utils';
import { Form, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
export default function PemDetails() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(25)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [visibleColumns, setVisibleColumns] = useState(columnNames.map(col => col.elementInternalName));

    const fetchColumnNames = async () => {
        try {
            // const columnApi = await fetch("https://jharvis.com/JarvisV2/getColumns?metaDataName=PEM&_=1706681174127")
            const columnApi = await fetch("/api/proxy?api=getColumns?metaDataName=PEM&_=1706681174127")
            const columnApiRes = await columnApi.json()
            // columnApiRes.push(...extraColumns)
            columnApiRes.splice(0, 0, extraColumns[0])
            columnApiRes.push(...extraColumns.slice(1))
            setColumnNames(columnApiRes);
            const defaultCheckedColumns = columnApiRes.map(col => col.elementInternalName);
            setVisibleColumns(defaultCheckedColumns);
        }
        catch (e) {
            console.log("error", e)
        }
    }


    const fetchData = async () => {
        context.setLoaderState(true)
        try {
            // const getBonds = await fetch("https://jharvis.com/JarvisV2/getImportsData?metaDataName=PEM&_=1706681174128")
            const getBonds = await fetch("/api/proxy?api=getImportsData?metaDataName=PEM&_=1706681174128")
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
        context.setLoaderState(false)
    }

    const handleClick = (elm) => {
        console.log("element", elm)
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
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const changeLimit = (e) => {
        setLimit(e.target.value)
    }
    const uploadFile = async (e)=>{
        e.preventDefault()
        const form = e.target
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        context.setLoaderState(true)
        try {
            const formData = new FormData(form);
        const upload = await fetch("/api/proxy?api=uploadFilePEM", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: formData
        })
        const uploadRes = await upload.json()
        if(upload.status == 400){
        Swal.fire({title:uploadRes?.message,icon:"warning",confirmButtonColor:"var(--primary)"})
        }
        console.log("form",form,upload)
        } catch (error) {
         console.log("Error",error)   
        }        
        context.setLoaderState(false)
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
            <div className="main-panel">
                <div className="content-wrapper">
        <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>PEM Details
                        </h3>
                    </div>
                    <div className="selection-area my-3">
                        <Form onSubmit={uploadFile} encType="multipart/form-data">
                        <input type="hidden" name="metaDataName" value="PEM"/>
                        <div className="row align-items-end">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="uploadFile">Upload File</label>
                                    <input id="uploadFile" type="file" name="myfile" className='border-1 form-control' required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="actions">
                                    <button className='btn btn-primary mb-0' type='submit'>Upload</button>
                                </div></div>
                        </div>
                        </Form>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className="dt-buttons mb-3">
                            <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button" title="PDF" onClick={()=>{generatePDF()}}><span className="mdi mdi-file-pdf-box me-2"></span><span>PDF</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button" onClick={()=>{exportToExcel()}}><span className="mdi mdi-file-excel me-2"></span><span>EXCEL</span></button>
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
                                                        id={`pemNew-selectAll`}
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
                                                            id={`${column.elementDisplayName}${index}`}
                                                        />
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                        </div>
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2 mb-0'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} />
                            <label style={{ textWrap: "nowrap" }} className='text-success ms-2 me-2 mb-0'>Show : </label>
                            <select name="limit" className='form-select w-auto' onChange={changeLimit} value={limit}>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table border display no-footer dataTable" role="grid" aria-describedby="exampleStocksPair_info" id="my-table">
                            <thead>
                                <tr>
                                    {columnNames.map((columnName, index) => (
                                        visibleColumns.includes(columnName.elementInternalName) && (
                                            <th key={index} onClick={() => handleSort(columnName.elementInternalName)}>{columnName.elementDisplayName}{getSortIcon(columnName.elementInternalName, sortConfig)}</th>
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
                                                    content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(2);
                                                } else if (columnName.elementInternalName === 'element80') {

                                                    content = (Number.parseFloat(rowData[columnName.elementInternalName]) || 0).toFixed(0);
                                                }
                                                else if (columnName.elementInternalName === 'lastUpdatedAt') {

                                                    content = new Date(rowData[columnName.elementInternalName]).toLocaleDateString();
                                                }
                                                else if (columnName.elementInternalName === "idMarketData") {
                                                    content = rowData[columnName.elementInternalName]
                                                    return <td key={colIndex}><button className='btn btn-success'><i className="mdi mdi-pen"></i></button></td>;

                                                }
                                                else {
                                                    content = rowData[columnName.elementInternalName];
                                                }

                                                if (typeof (content) == 'string') {
                                                    content = parse(content, options)
                                                }
                                                // return <td key={colIndex}>{parse(JSON.stringify(content),options)}</td>;
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
                </div>
            </div>
        </>
    )
}
