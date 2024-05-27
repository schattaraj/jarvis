import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Loader from '../components/loader'; 
import { Context } from '../contexts/Context'; 
import parse from 'html-react-parser';
export default function PemRule() {
    const context = useContext(Context)
    const [columnNames, setColumnNames] = useState([])
    const [portfolioNames, setPortfolioNames] = useState([])
    const [selectedPortfolioId, setPortfolioId] = useState(false)
    const [tableData, setTableData] = useState([])
    const [filterData, setFilterData] = useState([])

     
    const handleClick = (elm)=>{
        console.log("element",elm)
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
    useEffect(() => {
       
    }, [])
   
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
                                    </span>PEM Rule
                                </h3>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className="dt-buttons mb-3">
                                    <button className="dt-button buttons-pdf buttons-html5 btn-primary" type="button"><span>Create New Rule</span></button>
                                    <button className="dt-button buttons-excel buttons-html5 btn-primary" type="button"><span>View All Rule</span></button>
                                </div>
                            </div>
                           <table className="table table-bordered mb-3">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Operator</th>
                                    <th>Value</th>
                                    <th>Connector</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="form-control" style={{textAlign:"center",padding :"6px",width:"200px"}} type="text" name="txtMessage" id="txtMessage" readOnly=""/></td>
                                    <td>
                                        <select className="form-select" style={{padding :"6px"}}>
											    <option value="-1">Select</option>
												<option value="=">=</option>
												<option value="<">&lt;</option>
												<option value=">">&gt;</option>
												<option value="<=">≤</option>
												<option value=">=">≥</option>
											</select>
                                    </td>
                                    <td>
                                    <input className="form-control" style={{textAlign:"center", padding:"6px"}} type="text" name="txtVal" id="txtVal"/>
                                    </td>
                                    <td>
                                    <select className="form-select" style={{textAlign:"center",padding :"6px"}}>
												<option value="-1">--Select--</option>
												<option value="and">AND</option>																					
											</select>
                                    </td>
                                    <td style={{textAlign:'center'}}><button className='btn btn-danger'><i className="mdi mdi-delete"></i></button></td>
                                </tr>
                            </tbody>
                           </table>
                           <div className="text">
							<h3>Simple Rules</h3>
							<textarea name="txtSimpleRule" id="txtSimpleRule" className="txtDropTarget" readonly="" cols="80" rows="4"></textarea>
							
						</div>
                        <div class="row mt-3"> 
					<div class="col-md-4" style={{marginLeft: ""}}>
						Rank : <input style={{padding:"6px"}} type="text" id="rank" name="rank"/>
					</div>
					<div class="col-md-4">						
						<button type="button" style={{backgroundColor:"#357920",padding:"6px"}} class="btn btn-info btn-sm">Submit</button>
						&nbsp;&nbsp;
						<button type="button" style={{backgroundColor:"#357920",padding:"6px"}} class="btn btn-info btn-sm">Reset</button>
					</div>
								
						
						
						&nbsp;&nbsp;
						
						<div>

					</div>
					</div>
                        </div>
                       
                    </div>
                </div>
            </div>
            <Loader />
    </>
  )
}
