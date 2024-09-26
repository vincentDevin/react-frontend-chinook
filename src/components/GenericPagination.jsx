/* eslint-disable react/prop-types */
// src/components/GenericPagination.js

const GenericPagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        // Do not render the pagination if there is only one page or no pages
        return null;
    }

    const maxPageNumbersToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    // Adjust startPage if endPage is reaching the last page
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
        startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    const visiblePageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePageNumbers.push(i);
    }

    return (
        <div className="mt-4 d-flex justify-content-center">
            <nav aria-label="Generic Pagination">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                            disabled={currentPage === 1}
                            aria-label="Previous Page"
                        >
                            Previous
                        </button>
                    </li>
                    {visiblePageNumbers.map((number) => (
                        <li
                            key={number}
                            className={`page-item ${currentPage === number ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(number);
                                }}
                                aria-current={currentPage === number ? 'page' : undefined}
                                aria-label={`Go to page ${number}`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                            disabled={currentPage === totalPages}
                            aria-label="Next Page"
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default GenericPagination;
