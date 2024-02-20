import * as Icon from "react-icons/fa";
import { useState } from "react";
export const Pagination = ({currentPage,totalItems,limit,setCurrentPage,handlePage}) => {
    const count = totalItems.length
    const startIndex = (currentPage - 1) * limit + 1;
    const endIndex = Math.min(currentPage * limit, count);
    const totalPages = Math.ceil(count / limit)
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
            displayedPages = pageNumbers.slice(startDisplayIndex, startDisplayIndex + 3);
        }
    }
    // If there are less than or equal to 4 pages, display all page numbers
    // if (totalPages <= 4) {
    //     return pageNumbers.map((page) => (
    //         <button
    //             key={`page-${page}`}
    //             onClick={() => setCurrentPage(page)}
    //             className={currentPage === page ? 'active' : ''}
    //         >
    //             {page}
    //         </button>
    //     ));
    // } else {
    //     // If there are more than 4 pages, show first 3 pages, then a dot button, then last page
    //     const displayedPages = pageNumbers.slice(0, 3);
    //     return (
    //         <>
    //             {displayedPages.map((page) => (
    //                 <button
    //                     key={`page-${page}`}
    //                     onClick={() => setCurrentPage(page)}
    //                     className={currentPage === page ? 'active' : ''}
    //                 >
    //                     {page}
    //                 </button>
    //             ))}
    //             <button disabled>...</button>
    //             <button
    //                 onClick={() => setCurrentPage(totalPages)}
    //                 className={currentPage === totalPages ? 'active' : ''}
    //             >
    //                 {totalPages}
    //             </button>
    //         </>
    //     );
    // }
    return (
        <>
            {startDisplayIndex > 0 && (
                <>
                    <button
                        onClick={() => setStartDisplayIndex(startDisplayIndex - 3)}
                    >
                        {startDisplayIndex - 2}
                    </button>
                    <button disabled>...</button>
                </>
            )}

            {displayedPages.map((page) => (
                <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}

            {startDisplayIndex + 3 < totalPages && (
                <>
                    <button disabled>...</button>
                    <button
                        onClick={() => setStartDisplayIndex(startDisplayIndex + 3)}
                    >
                        {startDisplayIndex + 4}
                    </button>
                </>
            )}
        </>
    )
};

  return (
    <div>
           <div className="pagination-area">
                            <p>
        Showing {startIndex} to {endIndex} of {count} entries
      </p> 
      <div className="pagination-items">
      <button onClick={()=>{handlePage('prev')}} disabled={currentPage === 1}><Icon.FaChevronLeft /> </button>
      {/* {
        Array.from({ length: totalPages }, (_, i) => i + 1).map((page)=>{
            return (<button onClick={()=>{setCurrentPage(page)}} key={'page'+page} className={currentPage == page ? 'active' : ''}>{page}</button>)
        })
      } */}
        {renderPaginationButtons()}
      <button onClick={()=>{handlePage('next')}} disabled={currentPage === totalPages}><Icon.FaChevronRight /></button>
      </div>
      </div>
    </div>
  )
}
