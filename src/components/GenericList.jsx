// src/components/GenericList.jsx
import PropTypes from 'prop-types';
import GenericTable from './GenericTable';
import GenericPagination from './GenericPagination';

const GenericList = ({
    items = [],
    headers,
    renderRow,
    currentPage,
    totalPages,
    onPageChange,
    loading,
    error,
    selectedItem,
    handleRowClick,
}) => {
    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4 text-danger">Error: {error}</div>;

    return (
        <>
            <GenericTable
                headers={headers}
                rows={items}
                renderRow={renderRow({ handleRowClick, selectedItem })} // Render rows with handler
            />

            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </>
    );
};

GenericList.propTypes = {
    items: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    selectedItem: PropTypes.object,
    handleRowClick: PropTypes.func.isRequired,
};

export default GenericList;
