import React from 'react'
import Footer from '../components/footer';
import Navigation from '../components/navigation';
import Sidebar from '../components/sidebar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Breadcrumb from '../components/Breadcrumb';
export default function ByIndustry() {
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
        <Breadcrumb />
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <i className="mdi mdi-home"></i>
                            </span>By Industry
                        </h3>

                    </div>
                    <Tabs
                        defaultActiveKey="overview"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="overview" title="Overview">
                            <div className="row">
                                <div className="col-md-4 offset-8">
                                    <div className="d-flex align-items-center mb-3">
                                        <label className='me-2'>Search:</label><input type="search" className="ml-3 px-3 form-control" placeholder="" aria-controls="example" />
                                    </div>
                                </div>
                            </div>
                            <table className="table table-striped" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Industry Name</th>
                                        <th>Stocks</th>
                                        <th>Market Cap</th>
                                        <th>Div. Yield</th>
                                        <th>PE Ratio</th>
                                        <th>Profit Margin</th>
                                        <th>1D Change</th>
                                        <th>1Y Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>Internet Content &amp; Information</td><td>66</td><td>2,709.08B</td><td>0.76%</td><td>32.70</td><td>16.15%</td><td><div class="rr">-0.64%</div></td><td><div class="rr">-7.72%</div></td> </tr>
                                    <tr><td>Telecom Services</td><td>58</td><td>1,024.53B</td><td>872.35%</td><td>22.51</td><td>5.01%</td><td><div class="rg">0.63%</div></td><td><div class="rr">-3.69%</div></td> </tr>
                                    <tr><td>Entertainment</td><td>48</td><td>500.07B</td><td>1.03%</td><td>495.96</td><td>0.33%</td><td><div class="rr">-0.11%</div></td><td><div class="rr">-6.10%</div></td> </tr>
                                    <tr><td>Advertising Agencies</td><td>41</td><td>51.36B</td><td>1.92%</td><td>53.77</td><td>1.40%</td><td><div class="rr">-1.99%</div></td><td><div class="rr">-17.67%</div></td> </tr>
                                    <tr><td>Electronic Gaming &amp; Multimedia</td><td>26</td><td>225.86B</td><td>0.57%</td><td>70.85</td><td>6.73%</td><td><div class="rg">2.01%</div></td><td><div class="rg">1.88%</div></td> </tr>
                                </tbody>
                                {/* <tfoot>
                      <tr>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Office</th>
                          <th>Age</th>
                          <th>Start date</th>
                          <th>Salary</th>
                      </tr>
                  </tfoot> */}
                            </table>
                        </Tab>
                        <Tab eventKey="sectors" title="Sectors">
                            <div className="row">
                                <div className="col-md-4 offset-8">
                                    <div className="d-flex align-items-center mb-3">
                                        <label className='me-2'>Search:</label><input type="search" className="ml-3 px-3 form-control" placeholder="" aria-controls="example" />
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Sector Name</th>
                                            <th>Stocks</th>
                                            <th>Market Cap</th>
                                            <th>Div. Yield</th>
                                            <th>PE Ratio</th>
                                            <th>Profit Margin</th>
                                            <th>1D Change</th>
                                            <th>1Y Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Healthcare</td><td>1,254</td><td>7,204.97B</td><td>1.14%</td><td>48.49</td><td>4.13%</td><td><div class="rg">0.40%</div></td><td><div class="rr">-18.18%</div></td> </tr>
                                        <tr><td>Financials</td><td>1,098</td><td>7,874.02B</td><td>25.99%</td><td>12.51</td><td>17.76%</td><td><div class="rg">0.38%</div></td><td><div class="rr">-1.16%</div></td> </tr>
                                        <tr><td>Technology</td><td>788</td><td>13.79T</td><td>1.18%</td><td>43.56</td><td>10.55%</td><td><div class="rr">-0.85%</div></td><td><div class="rr">-7.14%</div></td></tr>
                                        <tr><td>Industrials</td><td>647</td><td>4,527.81B</td><td>3.56%</td><td>20.52</td><td>7.94%</td><td><div class="rr">-0.32%</div></td><td><div class="rg">6.63%</div></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </Tab>
                        <Tab eventKey="industries" title="Industries">
                            <div className="row">
                                <div className="col-md-4 offset-8">
                                    <div className="d-flex align-items-center mb-3">
                                        <label className='me-2'>Search:</label><input type="search" className="ml-3 px-3 form-control" placeholder="" aria-controls="example" />
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Industry Name</th>
                                            <th>Stocks</th>
                                            <th>Market Cap</th>
                                            <th>Div. Yield</th>
                                            <th>PE Ratio</th>
                                            <th>Profit Margin</th>
                                            <th>1D Change</th>
                                            <th>1Y Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Biotechnology</td><td >711</td><td >1,208.14B</td><td >0.28%</td><td >-</td><td >-29.36%</td><td ><div class="rr">-0.27%</div></td><td ><div class="rr">-16.46%</div></td></tr>
                                        <tr><td>Banks - Regional</td><td >359</td><td >1,078.50B</td><td >88.32%</td><td >7.11</td><td >30.23%</td><td ><div class="rr">-0.29%</div></td><td ><div class="rr">-18.47%</div></td></tr>
                                        <tr><td>Shell Companies</td><td >333</td><td >66.68B</td><td >0.01%</td><td >57.66</td><td >26.09%</td><td ><div class="rr">-0.05%</div></td><td ><div class="rg">6.68%</div></td></tr>
                                        <tr><td>Software - Application</td><td >249</td><td >1,695.77B</td><td >0.64%</td><td >-</td><td >-4.52%</td><td ><div class="rr">-0.46%</div></td><td ><div class="rr">-11.25%</div></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </Tab>
                    </Tabs>
                    {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab" aria-controls="general" aria-selected="true">General</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="filters-tab" data-bs-toggle="tab" data-bs-target="#filters" type="button" role="tab" aria-controls="filters" aria-selected="false">Filters</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="performance-tab" data-bs-toggle="tab" data-bs-target="#performance" type="button" role="tab" aria-controls="performance" aria-selected="false">Performance</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="analysts-tab" data-bs-toggle="tab" data-bs-target="#analysts" type="button" role="tab" aria-controls="analysts" aria-selected="false">Analysts</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="dividends-tab" data-bs-toggle="tab" data-bs-target="#dividends" type="button" role="tab" aria-controls="dividends" aria-selected="false">Dividends</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="financials-tab" data-bs-toggle="tab" data-bs-target="#financials" type="button" role="tab" aria-controls="financials" aria-selected="false">Financials</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="valuation-tab" data-bs-toggle="tab" data-bs-target="#valuation" type="button" role="tab" aria-controls="valuation" aria-selected="false">Valuation</button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="general-tab">
                <table id="example" className="table table-striped" style={{width:'100%'}}>
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Office</th>
                          <th>Age</th>
                          <th>Start date</th>
                          <th>Salary</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>Tiger Nixon</td>
                          <td>System Architect</td>
                          <td>Edinburgh</td>
                          <td>61</td>
                          <td>2011-04-25</td>
                          <td>$320,800</td>
                      </tr>
                      <tr>
                          <td>Garrett Winters</td>
                          <td>Accountant</td>
                          <td>Tokyo</td>
                          <td>63</td>
                          <td>2011-07-25</td>
                          <td>$170,750</td>
                      </tr>
                      <tr>
                          <td>Ashton Cox</td>
                          <td>Junior Technical Author</td>
                          <td>San Francisco</td>
                          <td>66</td>
                          <td>2009-01-12</td>
                          <td>$86,000</td>
                      </tr>
                      <tr>
                          <td>Cedric Kelly</td>
                          <td>Senior Javascript Developer</td>
                          <td>Edinburgh</td>
                          <td>22</td>
                          <td>2012-03-29</td>
                          <td>$433,060</td>
                      </tr>
                      <tr>
                          <td>Airi Satou</td>
                          <td>Accountant</td>
                          <td>Tokyo</td>
                          <td>33</td>
                          <td>2008-11-28</td>
                          <td>$162,700</td>
                      </tr>
                      <tr>
                          <td>Brielle Williamson</td>
                          <td>Integration Specialist</td>
                          <td>New York</td>
                          <td>61</td>
                          <td>2012-12-02</td>
                          <td>$372,000</td>
                      </tr>
                      <tr>
                          <td>Herrod Chandler</td>
                          <td>Sales Assistant</td>
                          <td>San Francisco</td>
                          <td>59</td>
                          <td>2012-08-06</td>
                          <td>$137,500</td>
                      </tr>
                      <tr>
                          <td>Rhona Davidson</td>
                          <td>Integration Specialist</td>
                          <td>Tokyo</td>
                          <td>55</td>
                          <td>2010-10-14</td>
                          <td>$327,900</td>
                      </tr>
                      <tr>
                          <td>Colleen Hurst</td>
                          <td>Javascript Developer</td>
                          <td>San Francisco</td>
                          <td>39</td>
                          <td>2009-09-15</td>
                          <td>$205,500</td>
                      </tr>
                      <tr>
                          <td>Sonya Frost</td>
                          <td>Software Engineer</td>
                          <td>Edinburgh</td>
                          <td>23</td>
                          <td>2008-12-13</td>
                          <td>$103,600</td>
                      </tr>
                      <tr>
                          <td>Jena Gaines</td>
                          <td>Office Manager</td>
                          <td>London</td>
                          <td>30</td>
                          <td>2008-12-19</td>
                          <td>$90,560</td>
                      </tr>
                      <tr>
                          <td>Quinn Flynn</td>
                          <td>Support Lead</td>
                          <td>Edinburgh</td>
                          <td>22</td>
                          <td>2013-03-03</td>
                          <td>$342,000</td>
                      </tr>
                      <tr>
                          <td>Charde Marshall</td>
                          <td>Regional Director</td>
                          <td>San Francisco</td>
                          <td>36</td>
                          <td>2008-10-16</td>
                          <td>$470,600</td>
                      </tr>
                      <tr>
                          <td>Haley Kennedy</td>
                          <td>Senior Marketing Designer</td>
                          <td>London</td>
                          <td>43</td>
                          <td>2012-12-18</td>
                          <td>$313,500</td>
                      </tr>
                      <tr>
                          <td>Tatyana Fitzpatrick</td>
                          <td>Regional Director</td>
                          <td>London</td>
                          <td>19</td>
                          <td>2010-03-17</td>
                          <td>$385,750</td>
                      </tr>
                      <tr>
                          <td>Michael Silva</td>
                          <td>Marketing Designer</td>
                          <td>London</td>
                          <td>66</td>
                          <td>2012-11-27</td>
                          <td>$198,500</td>
                      </tr>
                      <tr>
                          <td>Paul Byrd</td>
                          <td>Chief Financial Officer (CFO)</td>
                          <td>New York</td>
                          <td>64</td>
                          <td>2010-06-09</td>
                          <td>$725,000</td>
                      </tr>
                      <tr>
                          <td>Gloria Little</td>
                          <td>Systems Administrator</td>
                          <td>New York</td>
                          <td>59</td>
                          <td>2009-04-10</td>
                          <td>$237,500</td>
                      </tr>
                      <tr>
                          <td>Bradley Greer</td>
                          <td>Software Engineer</td>
                          <td>London</td>
                          <td>41</td>
                          <td>2012-10-13</td>
                          <td>$132,000</td>
                      </tr>
                      <tr>
                          <td>Dai Rios</td>
                          <td>Personnel Lead</td>
                          <td>Edinburgh</td>
                          <td>35</td>
                          <td>2012-09-26</td>
                          <td>$217,500</td>
                      </tr>
                      <tr>
                          <td>Jenette Caldwell</td>
                          <td>Development Lead</td>
                          <td>New York</td>
                          <td>30</td>
                          <td>2011-09-03</td>
                          <td>$345,000</td>
                      </tr>
                      <tr>
                          <td>Yuri Berry</td>
                          <td>Chief Marketing Officer (CMO)</td>
                          <td>New York</td>
                          <td>40</td>
                          <td>2009-06-25</td>
                          <td>$675,000</td>
                      </tr>
                      <tr>
                          <td>Caesar Vance</td>
                          <td>Pre-Sales Support</td>
                          <td>New York</td>
                          <td>21</td>
                          <td>2011-12-12</td>
                          <td>$106,450</td>
                      </tr>
                      <tr>
                          <td>Doris Wilder</td>
                          <td>Sales Assistant</td>
                          <td>Sydney</td>
                          <td>23</td>
                          <td>2010-09-20</td>
                          <td>$85,600</td>
                      </tr>
                      <tr>
                          <td>Angelica Ramos</td>
                          <td>Chief Executive Officer (CEO)</td>
                          <td>London</td>
                          <td>47</td>
                          <td>2009-10-09</td>
                          <td>$1,200,000</td>
                      </tr>
                      <tr>
                          <td>Gavin Joyce</td>
                          <td>Developer</td>
                          <td>Edinburgh</td>
                          <td>42</td>
                          <td>2010-12-22</td>
                          <td>$92,575</td>
                      </tr>
                      <tr>
                          <td>Jennifer Chang</td>
                          <td>Regional Director</td>
                          <td>Singapore</td>
                          <td>28</td>
                          <td>2010-11-14</td>
                          <td>$357,650</td>
                      </tr>
                      <tr>
                          <td>Brenden Wagner</td>
                          <td>Software Engineer</td>
                          <td>San Francisco</td>
                          <td>28</td>
                          <td>2011-06-07</td>
                          <td>$206,850</td>
                      </tr>
                      <tr>
                          <td>Fiona Green</td>
                          <td>Chief Operating Officer (COO)</td>
                          <td>San Francisco</td>
                          <td>48</td>
                          <td>2010-03-11</td>
                          <td>$850,000</td>
                      </tr>
                      <tr>
                          <td>Shou Itou</td>
                          <td>Regional Marketing</td>
                          <td>Tokyo</td>
                          <td>20</td>
                          <td>2011-08-14</td>
                          <td>$163,000</td>
                      </tr>
                      <tr>
                          <td>Michelle House</td>
                          <td>Integration Specialist</td>
                          <td>Sydney</td>
                          <td>37</td>
                          <td>2011-06-02</td>
                          <td>$95,400</td>
                      </tr>
                      <tr>
                          <td>Suki Burks</td>
                          <td>Developer</td>
                          <td>London</td>
                          <td>53</td>
                          <td>2009-10-22</td>
                          <td>$114,500</td>
                      </tr>
                      <tr>
                          <td>Prescott Bartlett</td>
                          <td>Technical Author</td>
                          <td>London</td>
                          <td>27</td>
                          <td>2011-05-07</td>
                          <td>$145,000</td>
                      </tr>
                      <tr>
                          <td>Gavin Cortez</td>
                          <td>Team Leader</td>
                          <td>San Francisco</td>
                          <td>22</td>
                          <td>2008-10-26</td>
                          <td>$235,500</td>
                      </tr>
                      <tr>
                          <td>Martena Mccray</td>
                          <td>Post-Sales support</td>
                          <td>Edinburgh</td>
                          <td>46</td>
                          <td>2011-03-09</td>
                          <td>$324,050</td>
                      </tr>
                      <tr>
                          <td>Unity Butler</td>
                          <td>Marketing Designer</td>
                          <td>San Francisco</td>
                          <td>47</td>
                          <td>2009-12-09</td>
                          <td>$85,675</td>
                      </tr>
                      <tr>
                          <td>Howard Hatfield</td>
                          <td>Office Manager</td>
                          <td>San Francisco</td>
                          <td>51</td>
                          <td>2008-12-16</td>
                          <td>$164,500</td>
                      </tr>
                      <tr>
                          <td>Hope Fuentes</td>
                          <td>Secretary</td>
                          <td>San Francisco</td>
                          <td>41</td>
                          <td>2010-02-12</td>
                          <td>$109,850</td>
                      </tr>
                      <tr>
                          <td>Vivian Harrell</td>
                          <td>Financial Controller</td>
                          <td>San Francisco</td>
                          <td>62</td>
                          <td>2009-02-14</td>
                          <td>$452,500</td>
                      </tr>
                      <tr>
                          <td>Timothy Mooney</td>
                          <td>Office Manager</td>
                          <td>London</td>
                          <td>37</td>
                          <td>2008-12-11</td>
                          <td>$136,200</td>
                      </tr>
                      <tr>
                          <td>Jackson Bradshaw</td>
                          <td>Director</td>
                          <td>New York</td>
                          <td>65</td>
                          <td>2008-09-26</td>
                          <td>$645,750</td>
                      </tr>
                      <tr>
                          <td>Olivia Liang</td>
                          <td>Support Engineer</td>
                          <td>Singapore</td>
                          <td>64</td>
                          <td>2011-02-03</td>
                          <td>$234,500</td>
                      </tr>
                      <tr>
                          <td>Bruno Nash</td>
                          <td>Software Engineer</td>
                          <td>London</td>
                          <td>38</td>
                          <td>2011-05-03</td>
                          <td>$163,500</td>
                      </tr>
                      <tr>
                          <td>Sakura Yamamoto</td>
                          <td>Support Engineer</td>
                          <td>Tokyo</td>
                          <td>37</td>
                          <td>2009-08-19</td>
                          <td>$139,575</td>
                      </tr>
                      <tr>
                          <td>Thor Walton</td>
                          <td>Developer</td>
                          <td>New York</td>
                          <td>61</td>
                          <td>2013-08-11</td>
                          <td>$98,540</td>
                      </tr>
                      <tr>
                          <td>Finn Camacho</td>
                          <td>Support Engineer</td>
                          <td>San Francisco</td>
                          <td>47</td>
                          <td>2009-07-07</td>
                          <td>$87,500</td>
                      </tr>
                      <tr>
                          <td>Serge Baldwin</td>
                          <td>Data Coordinator</td>
                          <td>Singapore</td>
                          <td>64</td>
                          <td>2012-04-09</td>
                          <td>$138,575</td>
                      </tr>
                      <tr>
                          <td>Zenaida Frank</td>
                          <td>Software Engineer</td>
                          <td>New York</td>
                          <td>63</td>
                          <td>2010-01-04</td>
                          <td>$125,250</td>
                      </tr>
                      <tr>
                          <td>Zorita Serrano</td>
                          <td>Software Engineer</td>
                          <td>San Francisco</td>
                          <td>56</td>
                          <td>2012-06-01</td>
                          <td>$115,000</td>
                      </tr>
                      <tr>
                          <td>Jennifer Acosta</td>
                          <td>Junior Javascript Developer</td>
                          <td>Edinburgh</td>
                          <td>43</td>
                          <td>2013-02-01</td>
                          <td>$75,650</td>
                      </tr>
                      <tr>
                          <td>Cara Stevens</td>
                          <td>Sales Assistant</td>
                          <td>New York</td>
                          <td>46</td>
                          <td>2011-12-06</td>
                          <td>$145,600</td>
                      </tr>
                      <tr>
                          <td>Hermione Butler</td>
                          <td>Regional Director</td>
                          <td>London</td>
                          <td>47</td>
                          <td>2011-03-21</td>
                          <td>$356,250</td>
                      </tr>
                      <tr>
                          <td>Lael Greer</td>
                          <td>Systems Administrator</td>
                          <td>London</td>
                          <td>21</td>
                          <td>2009-02-27</td>
                          <td>$103,500</td>
                      </tr>
                      <tr>
                          <td>Jonas Alexander</td>
                          <td>Developer</td>
                          <td>San Francisco</td>
                          <td>30</td>
                          <td>2010-07-14</td>
                          <td>$86,500</td>
                      </tr>
                      <tr>
                          <td>Shad Decker</td>
                          <td>Regional Director</td>
                          <td>Edinburgh</td>
                          <td>51</td>
                          <td>2008-11-13</td>
                          <td>$183,000</td>
                      </tr>
                      <tr>
                          <td>Michael Bruce</td>
                          <td>Javascript Developer</td>
                          <td>Singapore</td>
                          <td>29</td>
                          <td>2011-06-27</td>
                          <td>$183,000</td>
                      </tr>
                      <tr>
                          <td>Donna Snider</td>
                          <td>Customer Support</td>
                          <td>New York</td>
                          <td>27</td>
                          <td>2011-01-25</td>
                          <td>$112,000</td>
                      </tr>
                  </tbody>
                  <tfoot>
                      <tr>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Office</th>
                          <th>Age</th>
                          <th>Start date</th>
                          <th>Salary</th>
                      </tr>
                  </tfoot>
                </table>
              </div>
              <div className="tab-pane fade" id="filters" role="tabpanel" aria-labelledby="filters-tab">
                hi...
              </div>
              <div className="tab-pane fade" id="performance" role="tabpanel" aria-labelledby="performance-tab">
                 tab 3
              </div>
              <div className="tab-pane fade" id="analysts" role="tabpanel" aria-labelledby="analysts-tab">
                tab 4
             </div>
             <div className="tab-pane fade" id="dividends" role="tabpanel" aria-labelledby="dividends-tab">
              tab 5
             </div>
             <div className="tab-pane fade" id="financials" role="tabpanel" aria-labelledby="financials-tab">
              tab 6
             </div>
             <div className="tab-pane fade" id="valuation" role="tabpanel" aria-labelledby="valuation-tab">
              tab 7
             </div>
          </div>           */}
                </div>
                <Footer />
            </div>
        </>
    )
}
