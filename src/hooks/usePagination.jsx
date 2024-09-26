import { useState, useEffect, useCallback } from 'react';

const usePagination = (apiFunction, itemsPerPage = 10, dataKey = 'items', countKey = 'totalCount') => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch data function with useCallback to avoid re-creation on every render
    const fetchData = useCallback((page) => {
        setLoading(true);
        setError(null); // Clear any previous error before making the request
        const offset = (page - 1) * itemsPerPage;

        // Call the API function with pagination parameters
        apiFunction({ limit: itemsPerPage, offset })
            .then((response) => {
                if (Array.isArray(response)) {
                    // If response is an array, set items directly and use length for pagination
                    setItems(response);
                    setTotalPages(1); // If it's an array, assume only 1 page
                } else {
                    // Otherwise, use the dataKey and countKey to extract data and total count
                    setItems(response[dataKey] || []);
                    setTotalPages(Math.ceil((response[countKey] || 0) / itemsPerPage));
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'An error occurred while fetching data');
                setLoading(false);
            });
    }, [apiFunction, itemsPerPage, dataKey, countKey]); // Dependencies

    useEffect(() => {
        fetchData(currentPage); // Fetch data whenever the current page changes
    }, [fetchData, currentPage]); // Add fetchData as a dependency

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return {
        items,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
        fetchData, // Optionally expose fetchData if needed
    };
};

export default usePagination;
