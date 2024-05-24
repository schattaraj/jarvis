import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
export default function AddTicker() {
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
                                    </span>Add Ticker
                                </h3>
                            </div> 
                            <form>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Ticker Name:</label>
                                            <input type="text" className='form-control' placeholder='Ticker Name'/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Company:</label>
                                            <input type="text" className='form-control' placeholder='Company'/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Sector:</label>
                                            <input type="text" className='form-control' placeholder='Sector'/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Industry:</label>
                                            <input type="text" className='form-control' placeholder='Industry'/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Country:</label>
                                            <input type="text" className='form-control' placeholder='Country'/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Market Cap:</label>
                                            <input type="text" className='form-control' placeholder='Market Cap'/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className='btn btn-primary'>Add</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
