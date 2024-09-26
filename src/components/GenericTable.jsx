import PropTypes from 'prop-types'; // Import prop-types for prop validation

const GenericTable = ({ headers, rows = [], renderRow }) => { // Default value for rows is an empty array
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
            <table className="table table-striped table-hover" aria-label="Generic Table">
                <thead className="thead-dark">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} scope="col">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
            </table>
        </div>
    );
};

GenericTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.array, // Define propTypes for rows
    renderRow: PropTypes.func.isRequired
};

// Removed GenericTable.defaultProps, using default parameter for rows instead.

export default GenericTable;
