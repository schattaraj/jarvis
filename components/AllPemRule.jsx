import React, { useState } from "react";
import { Pagination } from "./Pagination";
import { fetchWithInterceptor, getSortIcon } from "../utils/utils";
import { useEffect } from "react";
import SliceData from "./SliceData";

const AllPemRule = ({
  limit,
  currentPage,
  setCurrentPage,
  tableData,
  filterData,
  setFilterData,
  handleDelete,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    async function run() {
      if (tableData.length > 0) {
        let items = [...tableData];
        if (sortConfig !== null) {
          items.sort((a, b) => {
            if (Number(a[sortConfig.key]) < Number(b[sortConfig.key])) {
              return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (Number(a[sortConfig.key]) > Number(b[sortConfig.key])) {
              return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
          });
        }
        let dataLimit = limit;
        let page = currentPage;
        if (dataLimit == "all") {
          dataLimit = tableData?.length;
          page = 1;
        }
        items = await SliceData(page, dataLimit, items);
        setFilterData(items);
      }
    }
    run();
  }, [currentPage, tableData, limit, sortConfig]);

  const handlePage = async (action) => {
    switch (action) {
      case "prev":
        setCurrentPage(currentPage - 1);
        break;
      case "next":
        setCurrentPage(currentPage + 1);
        break;
      default:
        setCurrentPage(currentPage);
        break;
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered mb-3">
          <thead>
            <tr>
              <th>Simple Rule</th>
              <th onClick={() => handleSort("rank")}>
                Rank {getSortIcon("rank", sortConfig)}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterData?.map((rowData, rowIndex) => {
              return (
                <tr key={rowIndex} style={{ overflowWrap: "break-word" }}>
                  <td>{rowData["simpleRule"]}</td>
                  <td>{rowData["rank"]}</td>
                  <td>
                    <button
                      className="px-4 btn btn-danger"
                      title="Delete"
                      onClick={() => handleDelete(rowData["idPemRule"])}
                    >
                      <i className="mdi mdi-delete"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tableData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={tableData}
          limit={limit}
          setCurrentPage={setCurrentPage}
          handlePage={handlePage}
        />
      )}
    </>
  );
};

export default AllPemRule;
