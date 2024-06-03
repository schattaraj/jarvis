import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { formatDate, searchTable } from '../../utils/utils';
import { Pagination } from '../../components/Pagination';
import Loader from '../../components/loader';
import { Context } from '../../contexts/Context';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SliceData from '../../components/SliceData';
export default function UploadPodcast() {
    const [tickers, setTickers] = useState([]);
    const [allPodcastData, setallPodcastData] = useState([])
    const [allPodcastDataFiltered, setallPodcastDataFiltered] = useState([])
    const [show, setShow] = useState(false);
    const [analystVideo, setAnalystVideo] = useState(false)
    const [limit, setLimit] = useState(25)
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const context = useContext(Context)
    const fetchTickersFunc = async () => {
        context.setLoaderState(true)
        try {
            const fetchTickers = await fetch("https://jharvis.com/JarvisV2/getAllTicker?metadataName=Tickers_Watchlist&_=1716538528361")
            const fetchTickersRes = await fetchTickers.json()
            setTickers(fetchTickersRes)
        }
        catch (e) {

        }
        context.setLoaderState(false)
    }
    const handleChange = () => {

    }
    const fetchHistoryFuc = () => {

    }
    const fetchAllPodcastVideos = async () => {
        context.setLoaderState(true)
        try {
            const getAllAnalyst = await fetch("https://jharvis.com/JarvisV2/getAllPodCasts?_=1716548464958")
            const getAllAnalystRes = await getAllAnalyst.json()
            setallPodcastData(getAllAnalystRes)
            setallPodcastDataFiltered([...getAllAnalystRes])
        } catch (error) {
            console.log("error", error)
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
        setallPodcastDataFiltered(searchTable(allPodcastData, value))
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
    const uploadPodcast = async (e) => {
        context.setLoaderState(true)
        try {
            e.preventDefault()
            const form = e.target;
            const formData = new FormData(form);
            const response = await fetch('https://jharvis.com/JarvisV2/uploadPodCast', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.msg)
                form.reset()
                fetchAllPodcastVideos()
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {

        }
        context.setLoaderState(false)
    }
    const deletePodcast = async (id) => {
        let text = "Are you sure ?";
        if (confirm(text) == true) {
            try {
                const formData = new FormData();
                formData.append("idPodCast", id)
                const podcastDelete = await fetch("https://jharvis.com/JarvisV2/deletePodCast", {
                    method: 'DELETE',
                    body: formData
                })
                if (podcastDelete.ok) {
                    const podcastDeleteRes = await podcastDelete.json()
                    alert(podcastDeleteRes.msg)
                    fetchAllPodcastVideos()

                }
            } catch (error) {
                console.log(error)
            }

        }

    }
    useEffect(() => {
        async function run() {
            if (allPodcastData.length > 0) {
                const items = await SliceData(currentPage, limit, allPodcastData);
                setallPodcastDataFiltered(items)
            }
        }
        run()
    }, [currentPage, allPodcastData])
    useEffect(() => {
        fetchTickersFunc()
        fetchAllPodcastVideos()
    }, [])
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Upload Podcast
                        </h3>
                    </div>
                    <div className="selection-area mb-3">
                        {/* <form action="https://jharvis.com/JarvisV2/uploadPodCast" method='post' encType='multipart/form-data'> */}
                        <form action="https://jharvis.com/JarvisV2/uploadPodCast" onSubmit={uploadPodcast} method='post' encType='multipart/form-data'>
                            <div className="row">
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
                                        <input type="text" placeholder="Description" name='description' className='form-control' required />

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">Podcast Date</label>
                                        {/* <input type="text" className='form-control' name='podCastDate' required/> */}
                                        <ReactDatePicker className='form-control' name='podCastDate' selected={startDate} onChange={(date) => setStartDate(date)} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">Upload File</label>
                                        <input type="file" name="podCastsDetails" className='border-1 form-control' required />
                                    </div>
                                </div>
                                <div className="actions">
                                    <button className='btn btn-primary' type='submit'>Upload</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="form-group d-flex align-items-center"><label htmlFor="" style={{ textWrap: "nowrap" }} className='text-success me-2'>Search : </label><input type="search" placeholder='' className='form-control' onChange={filter} /></div>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Company</th>
                                    <th>Description</th>
                                    <th>Report Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allPodcastDataFiltered.map((item, index) => {
                                        return <tr key={"analyst" + index}>
                                            <td>{item?.tickerName}</td>
                                            <td>{item?.companyName}</td>
                                            <td>{item?.description}</td>
                                            <td>{item?.podCastDate && formatDate(item?.podCastDate)}</td>
                                            <td>
                                                <button className='btn btn-primary me-2' onClick={() => { handleShow(item?.anaylstVideoDetails) }}><i className="mdi mdi-video menu-icon"></i></button>
                                                <button className='btn btn-danger' onClick={() => { deletePodcast(item?.idPodCast) }}><i className="mdi mdi-delete menu-icon"></i></button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    {allPodcastData.length > 0 && <Pagination currentPage={currentPage} totalItems={allPodcastData} limit={limit} setCurrentPage={setCurrentPage} handlePage={handlePage} />}
                </div>
            </div>
            <Loader />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Podcasts</Modal.Title>
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
