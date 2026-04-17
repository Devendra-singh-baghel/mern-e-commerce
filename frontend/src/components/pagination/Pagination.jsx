import React, { useMemo } from 'react'
import "./Pagination.css"
import { useSelector } from 'react-redux'

/*
   Pagination Component
   ---------------------
   This component is responsible for rendering pagination controls
   based on the current page and total number of pages.
  
   It allows navigation to:
   - First page
   - Previous page
   - Specific page numbers (dynamic range)
   - Next page
   - Last page
 */

function Pagination({
    currentPage,
    onPageChange,
    activeClass = "active",
    nextPageText = "Next",
    prevPageText = "Prev",
    firstPageText = "1st",
    lastPageText = "Last"
}) {

    /*
       Accessing pagination-related data from Redux store
       - totalPages: Total number of available pages
       - products: Current page's data (used to check if pagination should render)
     */
    const { totalPages, products } = useSelector((state) => state.product);

    //If there are no products or totalPages is invalid, do not render pagination UI.
    if (!products || products.length === 0 || totalPages <= 1) {
        return null;
    }

    /*
       Generate Page Numbers
       -----------------------
       Why use useMemo?
       - Prevents recalculating page numbers on every render
       - Only recalculates when currentPage or totalPages changes
     
       Example:
       currentPage = 5, pageWindow = 2
       Output: [3, 4, 5, 6, 7]
     */
    const getPageNumbers = useMemo(() => {
        const pageNumbers = [];
        const pageWindow = 2;   //it determines how many pages to show before and after the current page.

        /*
           Loop to generate page numbers within valid range:
           - Ensures page number is not less than 1
           - Ensures page number does not exceed totalPages
         */
        for (let i = Math.max(1, currentPage - pageWindow); i <= Math.min(totalPages, currentPage + pageWindow); i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    }, [currentPage, totalPages])



    return (
        <div className="pagination">
            {/* Previous and First buttons */}
            {
                currentPage > 1 && (
                    <>
                        <button
                            className="pagination_btn"
                            onClick={() => onPageChange(1)}
                        >{firstPageText}
                        </button>

                        <button
                            className="pagination_btn"
                            onClick={() => onPageChange(currentPage - 1)}
                        >{prevPageText}
                        </button>
                    </>
                )
            }

            {/* Display Numbers */}
            {
                getPageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`pagination_btn ${currentPage === number ? activeClass : ""}`}
                        onClick={() => onPageChange(number)}
                    >{number}</button>
                ))
            }

            {/* Last and Next buttons */}
            {
                currentPage < totalPages && (
                    <>
                        <button
                            className="pagination_btn"
                            onClick={() => onPageChange(currentPage + 1)}
                        >{nextPageText}
                        </button>

                        <button
                            className="pagination_btn"
                            onClick={() => onPageChange(totalPages)}
                        >{lastPageText}
                        </button>
                    </>
                )
            }
        </div>
    )
}

export default Pagination
