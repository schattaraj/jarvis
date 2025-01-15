import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { Context } from '../../contexts/Context';
import Loader from '../../components/loader';
import { useContext } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { fetchWithInterceptor } from '../../utils/utils';
export default function AddTicker() {
    const context = useContext(Context)
    const uploadFormData = async(e)=>{
        context.setLoaderState(true)
        try {
            e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        const response = await fetchWithInterceptor('/api/proxy?api=addTicker', false, {}, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.msg)
                form.reset()
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            
        }
        context.setLoaderState(false)
    }
    return (
        <>
                    <div className="main-panel">
                        <div className="content-wrapper">
        <Breadcrumb />
                            <div className="page-header">
                                <h3 className="page-title">
                                    <span className="page-title-icon bg-gradient-primary text-white me-2">
                                        <i className="mdi mdi-home"></i>
                                    </span>Add Ticker
                                </h3>
                            </div> 
                            <form onSubmit={uploadFormData}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Ticker Name:</label>
                                            <input type="text" name='tickerName' className='form-control' placeholder='Ticker Name' required/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Company:</label>
                                            <input type="text" name='company' className='form-control' placeholder='Company' required/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Sector:</label>
                                            <input type="text" name='sector' className='form-control' placeholder='Sector' required/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Industry:</label>
                                            <input type="text" name='industry' className='form-control' placeholder='Industry' required/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Country:</label>
                                            <input type="text" name='country' className='form-control' placeholder='Country' required/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="">Market Cap:</label>
                                            <input type="text" name='marketCap' className='form-control' placeholder='Market Cap' required/>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button className='btn btn-primary' type='submit'>Add</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
        </>
    )
}
