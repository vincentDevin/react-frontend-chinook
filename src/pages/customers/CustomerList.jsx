import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/entitiesApi';
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination'; // Import usePagination hook

const CustomerList = () => {
    const navigate = useNavigate();

    // Use the custom pagination hook with the customer API function
    const {
        items: customers = [], // Default to empty array if no data
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination(customerApi.getAll, 10, 'customers'); // Pass the API function, items per page, and data key

    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleShowModal = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCustomer(null);
    };

    const handleConfirmDelete = () => {
        if (selectedCustomer) {
            customerApi
                .delete(selectedCustomer.CustomerId) // Use CustomerId instead of id
                .then(() => {
                    handlePageChange(currentPage); // Refresh data after deleting a customer
                    handleCloseModal();
                })
                .catch((err) => {
                    console.error('Error deleting customer:', err.message);
                });
        }
    };

    const renderRow = (customer) => (
        <tr key={customer.CustomerId}>
            <td>{customer.FirstName}</td>
            <td>{customer.LastName}</td>
            <td>{customer.Email}</td>
            <td>{customer.City}</td>
            <td>{customer.Country}</td>
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary btn-md"
                        onClick={() => navigate(`/customers/${customer.CustomerId}`)}
                        aria-label={`Edit ${customer.FirstName} ${customer.LastName}`}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger btn-md"
                        onClick={() => handleShowModal(customer)}
                        aria-label={`Delete ${customer.FirstName} ${customer.LastName}`}
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="container mt-4" role="status">
                Loading customers...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Generic Actions Component */}
            <GenericActions
                onAdd={() => navigate('/customers/add')}
                selectedItem={selectedCustomer}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCloseModal}
                showModal={showModal}
                addLink="/customers/add"
            />

            {/* Generic Table Component */}
            <GenericTable
                headers={['First Name', 'Last Name', 'Email', 'City', 'Country', 'Actions']}
                rows={customers} // Use customers from the usePagination hook
                renderRow={renderRow}
            />

            {/* Generic Pagination Component */}
            <GenericPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default CustomerList;
