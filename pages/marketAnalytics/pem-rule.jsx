import { useContext, useEffect, useState } from "react";
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import Loader from "../../components/loader";
import { Context } from "../../contexts/Context";
import parse from "html-react-parser";
import Breadcrumb from "../../components/Breadcrumb";
import { useRouter } from "next/router";
import AllPemRule from "../../components/AllPemRule";
import { fetchWithInterceptor, searchTable } from "../../utils/utils";
import Swal from "sweetalert2";
export default function PemRule() {
  const context = useContext(Context);
  const [columnNames, setColumnNames] = useState([]);
  const [portfolioNames, setPortfolioNames] = useState([]);
  const [selectedPortfolioId, setPortfolioId] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ruleViewState, setRuleViewState] = useState(false);

  const [limit, setLimit] = useState(25);
  const [ruleData, setRuleData] = useState([]);
  const [filterRuleData, setFilterRuleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const [rows, setRows] = useState([
    {
      parameter: "",
      operator: "-1",
      value: "",
      connector: "-1",
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { parameter: "", operator: "-1", value: "", connector: "-1" },
    ]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    if (index > 0) {
      const updatedRows = rows.filter((row, i) => i !== index);
      setRows(updatedRows);
    }
    // const updatedRows = [...rows];
    // updatedRows.splice(index, 1);
    // setRows(updatedRows);
  };

  const getSelectedParameters = () => {
    return rows.map((row) => row.parameter).filter((param) => param !== "");
  };

  const parameterOptions = [
    "Revenue (as a % of TAM)",
    "Organic Sales Growth Rate of Company (TTM)",
    "Organic Growth rate of TAM",
    "Valuation",
    "Revenue Generation Consistency",
    "Normalized ROIC",
    "Tailwinds",
    "Pricing Power",
    "Product/Service Quality",
    "Customer Retention",
    "Competitive Environment",
    "Value Proposition Savings/Efficiency",
    "Founder CEO",
  ];

  const handleClick = (elm) => {
    console.log("element", elm);
  };

  const options = {
    replace: (elememt) => {
      if (elememt.name === "a") {
        // console.log("replace",JSON.stringify(parse(elememt.children.join(''))))
        return (
          <a
            onClick={() => {
              handleClick(elememt.children[0].data);
            }}
            href="#"
          >
            {parse(elememt.children[0].data)}
          </a>
        );
      }
    },
  };
  useEffect(() => {}, []);

  const fetchRuleData = async () => {
    context.setLoaderState(true);
    try {
      const getRulesUrl = `/api/proxy?api=getAllPemRule`;
      const getAllRules = await fetchWithInterceptor(getRulesUrl, false);

      setRuleData(getAllRules);
      setFilterRuleData(getAllRules);
      context.setLoaderState(false);
    } catch (e) {
      console.log("error", e);
      context.setLoaderState(false);
    }
  };
  useEffect(() => {
    if (ruleViewState) {
      fetchRuleData();
    }
  }, [ruleViewState]);

  const changeLimit = (e) => {
    setLimit(e.target.value);
  };
  const filter = (e) => {
    const value = e.target.value;
    setFilterRuleData(searchTable(ruleData, value));
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      confirmButtonText: "Delete",
      showCancelButton: true,
      customClass: { confirmButton: "btn-danger" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          context.setLoaderState(true);
          //   const baseUrl = `/api/proxy?api=deletePemRule`;
          const formData = new FormData();
          formData.append("idPemRule", id);
          const baseUrl = `https://jharvis.com/JarvisV2/deletePemRule`;
          const response = await fetch(baseUrl, {
            method: "DELETE",
            body: formData,
          });
          const result = await response.json();

          Swal.fire({
            title: result.msg,
            confirmButtonColor: "var(--primary)",
          });
          console.log("response:", response);
          fetchRuleData();
          context.setLoaderState(false);
        } catch (error) {
          console.error("Request failed", error);
          context.setLoaderState(false);
        }
      }
    });
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
              </span>
              PEM Rule
            </h3>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <div className="dt-buttons mb-3">
              <button
                className="dt-button buttons-pdf buttons-html5 btn-primary"
                type="button"
                onClick={() => {
                  setRuleViewState(false);
                }}
              >
                <span>Create New Rule</span>
              </button>
              <button
                className="dt-button buttons-excel buttons-html5 btn-primary"
                type="button"
                onClick={() => {
                  setRuleViewState(true);
                }}
              >
                <span>View All Rule</span>
              </button>
            </div>

            {ruleViewState ? (
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center me-2 mb-0">
                  <label
                    style={{ textWrap: "nowrap" }}
                    className="text-success ms-2 me-2 mb-0"
                  >
                    Show :{" "}
                  </label>
                  <select
                    name="limit"
                    className="form-select w-auto"
                    onChange={changeLimit}
                    value={limit}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <label
                  htmlFor=""
                  style={{ textWrap: "nowrap" }}
                  className="text-success mb-0 me-2"
                >
                  Search :{" "}
                </label>
                <input
                  type="search"
                  class="form-control"
                  placeholder=""
                  aria-label="search"
                  aria-describedby="basic-addon2"
                  onChange={filter}
                />
              </div>
            ) : (
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddRow}
                >
                  <i className="mdi mdi-plus"></i> Add
                </button>
              </div>
            )}
          </div>

          {ruleViewState ? (
            <AllPemRule
              limit={limit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              tableData={ruleData}
              filterData={filterRuleData}
              setFilterData={setFilterRuleData}
              handleDelete={handleDelete}
            />
          ) : (
            <>
              {/* create PEM Starts */}
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
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          name="parameter"
                          className="form-select"
                          style={{ padding: "6px" }}
                          value={row.parameter}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="">Select</option>
                          {parameterOptions.map((option, i) => (
                            <option
                              key={i}
                              value={option}
                              disabled={getSelectedParameters().includes(
                                option
                              )}
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="operator"
                          className="form-select"
                          style={{ padding: "6px" }}
                          value={row.operator}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="-1">Select</option>
                          <option value="=">=</option>
                          <option value="<">&lt;</option>
                          <option value=">">&gt;</option>
                          <option value="<=">≤</option>
                          <option value=">=">≥</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          style={{ textAlign: "center", padding: "6px" }}
                          type="text"
                          name="value"
                          value={row.value}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </td>
                      <td>
                        <select
                          name="connector"
                          className="form-select"
                          style={{ textAlign: "center", padding: "6px" }}
                          value={row.connector}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="-1">--Select--</option>
                          <option value="and">AND</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <i className="mdi mdi-delete"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text">
                <h3>Simple Rules</h3>
                <textarea
                  name="simpleRule"
                  id="txtSimpleRule"
                  className="txtDropTarget"
                  readOnly=""
                  cols="80"
                  rows="4"
                ></textarea>
              </div>
              <div className="row mt-3">
                <div className="col-md-4" style={{ marginLeft: "" }}>
                  Rank :{" "}
                  <input
                    style={{ padding: "6px" }}
                    type="text"
                    id="rank"
                    name="rank"
                  />
                </div>
                <div className="col-md-4">
                  <button
                    type="button"
                    style={{ backgroundColor: "#357920", padding: "6px" }}
                    className="btn btn-primary btn-info btn-sm"
                  >
                    Submit
                  </button>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    style={{ backgroundColor: "#cd3434", padding: "6px" }}
                    className="btn btn-danger btn-info btn-sm"
                  >
                    Reset
                  </button>
                </div>
                &nbsp;&nbsp;
                <div></div>
              </div>
              {/* create PEM ends */}
            </>
          )}
        </div>
      </div>
    </>
  );
}
