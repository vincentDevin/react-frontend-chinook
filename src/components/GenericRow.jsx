// src/components/GenericRow.jsx
import PropTypes from 'prop-types';

const GenericRow = ({ item, isSelected, onRowClick, renderDetails }) => (
    <>
        <tr
            onClick={onRowClick}
            className={`cursor-pointer ${isSelected ? 'generic-row' : ''}`}>
            {Object.values(item).map((value, index) => (
                <td key={index}>{value}</td>
            ))}
        </tr>
        {isSelected && (
            <tr>
                <td colSpan={Object.keys(item).length}>
                    {renderDetails()} {/* Render additional details for selected row */}
                </td>
            </tr>
        )}
    </>
);

GenericRow.propTypes = {
    item: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    onRowClick: PropTypes.func.isRequired,
    renderDetails: PropTypes.func.isRequired,
};

export default GenericRow;
