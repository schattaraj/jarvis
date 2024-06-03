import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import { useContext, useEffect, useState } from 'react'
export default function ChangePassword() {
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>Change Password
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">New Password:</label>
                                <input type="text" className='form-control' />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="">Confirm Password:</label>
                                <input type="text" className='form-control' />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <button className='btn btn-primary'>Save Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
