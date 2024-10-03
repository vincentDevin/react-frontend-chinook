import PropTypes from 'prop-types'; // Import prop-types for prop validation

const GenericTable = ({ headers = [], rows = [], renderRow }) => {
    // Render the table body, showing either rows or a message if no data is available
    const renderTableBody = () => {
        if (rows.length > 0) {
            return rows.map(renderRow);
        } else {
            return (
                <tr>
                    <td colSpan={headers.length} className="text-center">
                        No data available.
                    </td>
                </tr>
            );
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover" aria-label="Generic Table" role="table">
                <thead className="thead-dark">
                    <tr>
                        {headers.length > 0
                            ? headers.map((header, index) => (
                                <th key={index} scope="col" className="fixed-width">
                                    {header}
                                </th>
                            ))
                            : (
                                <th colSpan="100%" scope="col" className="text-center">
                                    No headers available
                                </th>
                            )}
                    </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
            </table>
        </div>
    );
};

// Define propTypes for component props
GenericTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string), // Optional array of strings for headers
    rows: PropTypes.array, // Optional array for rows
    renderRow: PropTypes.func.isRequired, // Required function to render each row
};

export default GenericTable;
