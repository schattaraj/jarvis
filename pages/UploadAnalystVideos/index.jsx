import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { formatDate, getSortIcon, searchTable } from '../../utils/utils';
import { Pagination } from '../../components/Pagination';
import SliceData from '../../components/SliceData';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Context } from '../../contexts/Context';
import Loader from '../../components/loader';
import Swal from 'sweetalert2';
export default function UploadAnalystVideos() {
    const [tickers, setTickers] = useState([]);
    const [allAnalystData, setAllAnalystData] = useState([])
    const [allAnalystDataFiltered, setAllAnalystDataFiltered] = useState([])
    const [show, setShow] = useState(false);
    const [analystVideo, setAnalystVideo] = useState(false)
    const [limit, setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const context = useContext(Context)
    const fetchTickersFunc = async () => {
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1716538528361")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
    }
    const handleChange = () => {

    }
    const fetchHistoryFuc = () => {

    }
    const fetchAllAnalystVideos = async () => {
        context.setLoaderState(true)
        try {
            const getAllAnalyst = await fetch("https://jharvis.com/JarvisV2/getAllAnalystVideo?_=1716538528362")
            const getAllAnalystRes = await getAllAnalyst.json()
            setAllAnalystData([...getAllAnalystRes])
        }
        catch (e) {
            console.log("Error", e)
        }
        context.setLoaderState(false)

    }
    const handleClose = () => setShow(false);
    const handleShow = (path) => {
        setShow(true);
        setAnalystVideo(path)
    }
    const filter = (e) => {
        const value = e.target.value;
        setAllAnalystDataFiltered(searchTable(allAnalystData, value))
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
    const UploadAnalystForm = async (e) => {
        e.preventDefault()
        context.setLoaderState(true)
        const form = e.target;
        const formData = new FormData(form);
        let isFormValid = true;
        for (let [name, value] of formData.entries()) {
            if (!value) {
                isFormValid = false;
                // You can also display an error message or highlight the empty field
                Swal.fire({
                    title: `The field "${name}" is required.`,
                    icon: "error",
                    confirmButtonColor: "#719B5F"
                })
                break; // Stop checking if any field is empty
            }
        }

        if (!isFormValid) {
            context.setLoaderState(false);
            return;
        }
        try {
            const response = await fetch('https://jharvis.com/JarvisV2/uploadAnalystVideo', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    title: result.msg,
                    icon: "success",
                    confirmButtonColor: "#719B5F"
                })
                form.reset()
                fetchAllAnalystVideos()
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {

        }
        context.setLoaderState(false)
    }
    const deleteAnalystVideo = async (id) => {
        let text = "Are you sure You want to delete ?";
        Swal.fire({
            title: text,
            icon:'warning',
            showCancelButton: true,
            confirmButtonText: "Delete",
            customClass: { confirmButton: 'btn-danger', }
        }).then(async (result) => {
            if (result.isConfirmed) {
                context.setLoaderState(true)
                try {
                    const formData = new FormData();
                    formData.append("idAnaylstVideo", id)
                    const analystDelete = await fetch("https://jharvis.com/JarvisV2/deleteAnalystVideo", {
                        method: 'DELETE',
                        body: formData
                    })
                    if (analystDelete.ok) {
                        const analystDeleteRes = await analystDelete.json()
                        Swal.fire({
                            title: analystDeleteRes.msg,
                            icon: "success",
                            confirmButtonColor: "#719B5F"
                        })
                        fetchAllAnalystVideos()
                    }
                } catch (error) {
                    console.log(error)
                }
                fetchAllAnalystVideos()
                context.setLoaderState(false)
            }
        })
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
    useEffect(() => {
        async function run() {
            if (allAnalystData.length > 0) {
                let items = [...allAnalystData];
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
                    dataLimit = items?.length
                    page = 1
                }
                items = await SliceData(page, dataLimit, items);
                setAllAnalystDataFiltered(items)
            }
        }
        run()
    }, [currentPage, allAnalystData, sortConfig])
    useEffect(() => {
        fetchTickersFunc()
        fetchAllAnalystVideos()
    }, [])
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Upload Analyst Videos
                        </h3>
                    </div>
                    <div className="selection-area mb-3">
                        <form onSubmit={UploadAnalystForm} method='post' encType='multipart/form-data'>
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">Select Ticker</label>
                                        <select name="tickerName" className='form-select' onChange={handleChange} required>
                                            <option value={""}>--Select Ticker--</option>
                                            {tickers.map((item, index) => (
                                                <option key={index} value={item?.element1}>
                                                    {item?.element1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">Description</label>
                                        <input type="text" name='description' placeholder="Description" className='form-control' required />

                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">Report Date</label>
                                        {/* <input type="reportDate" className='form-control'/> */}
                                        <ReactDatePicker className='form-control' name='reportDate' selected={startDate} onChange={(date) => setStartDate(date)} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-0">
                                        <input type="file" name="anaylstVideoDetails" className='form-control' required />
                                    </div>
                                </div>

                                <div className="actions">
                                    <button className='btn btn-primary' type='submit'>Upload</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} />
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
                        <table className="table">
                            <thead>
                                <tr>
                                    <th onClick={()=>{handleSort("tickerName")}}>Ticker {getSortIcon("tickerName",sortConfig)}</th>
                                    <th onClick={()=>{handleSort("companyName")}}>Company {getSortIcon("companyName",sortConfig)}</th>
                                    <th onClick={()=>{handleSort("description")}}>Description {getSortIcon("description",sortConfig)}</th>
                                    <th onClick={()=>{handleSort("reportDate")}}>Report Date {getSortIcon("reportDate",sortConfig)}</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allAnalystDataFiltered.map((item, index) => {
                                        return <tr key={"analyst" + index}>
                                            <td>{item?.tickerName}</td>
                                            <td>{item?.companyName}</td>
                                            <td>{item?.description}</td>
                                            <td>{item?.reportDate && formatDate(item?.reportDate)}</td>
                                            <td className='text-center'>
                                                <button className='btn btn-primary me-2 px-4' onClick={() => { handleShow(item?.anaylstVideoDetails) }}><i className="mdi mdi-video menu-icon"></i></button>
                                                <button className='btn btn-danger px-4' onClick={() => { deleteAnalystVideo(item?.idAnaylstVideo) }}><i className="mdi mdi-delete menu-icon"></i></button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {allAnalystData.length > 0 && <Pagination currentPage={currentPage} totalItems={allAnalystData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Analyst Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <video playsInline="" autoPlay="" muted="" loop="" height="240" controls={true}>
                        <source id="videoSource" src={"https://jharvis.com/JarvisV2/playVideo?fileName=" + analystVideo} type="video/mp4" />
                    </video>
                </Modal.Body>
            </Modal>
        </>
    )
}
