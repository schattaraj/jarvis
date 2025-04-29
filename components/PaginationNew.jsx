import * as Icon from "react-icons/fa";
import { useState } from "react";
export const PaginationNew = ({
  currentPage,
  totalItems,
  limit,
  setCurrentPage,
  handlePage,
  totalPage,
}) => {
  const count = totalItems;
  if (limit == "all" || limit >= totalItems) {
    limit = totalItems;
    currentPage = 1;
  }
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, count);
  const totalPages = totalPage;
  const [startDisplayIndex, setStartDisplayIndex] = useState(0);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const renderPaginationButtons = () => {
    const pageNumbers = getPageNumbers();
    let displayedPages = [];
    if (totalPages <= 4) {
      displayedPages = pageNumbers;
    } else {
      if (startDisplayIndex + 3 >= totalPages) {
        // If remaining pages are less than or equal to 3, display the last 3 pages
        displayedPages = pageNumbers.slice(totalPages - 3, totalPages);
      } else {
        // Display the next 3 pages
        displayedPages = pageNumbers.slice(
          startDisplayIndex,
          startDisplayIndex + 3
        );
      }
    }

    return (
      <>
        {startDisplayIndex > 0 && (
          <>
            <button onClick={() => setStartDisplayIndex(startDisplayIndex - 3)}>
              {startDisplayIndex - 2}
            </button>
            <button disabled>...</button>
          </>
        )}

        {displayedPages.map((page) => (
          <button
            key={`page-${page}`}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}

        {startDisplayIndex + 3 < totalPages && (
          <>
            <button disabled>...</button>
            <button onClick={() => setStartDisplayIndex(startDisplayIndex + 3)}>
              {startDisplayIndex + 4}
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="pagination-area">
        <p>
          Showing {startIndex} to {endIndex} of {count} entries
        </p>
        <div className="pagination-items">
          <button
            onClick={() => {
              handlePage("prev");
            }}
            disabled={currentPage === 1}
          >
            <Icon.FaChevronLeft />{" "}
          </button>
          {/* {
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page)=>{
            return (<button onClick={()=>{setCurrentPage(page)}} key={'page'+page} className={currentPage == page ? 'active' : ''}>{page}</button>)
        })
      } */}
          {renderPaginationButtons()}
          <button
            onClick={() => {
              handlePage("next");
            }}
            disabled={currentPage === totalPages}
          >
            <Icon.FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
