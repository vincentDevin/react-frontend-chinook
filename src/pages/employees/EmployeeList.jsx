import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from '../../api/entitiesApi'; // Import the API functions for employees
import GenericActions from '../../components/GenericActions';
import GenericTable from '../../components/GenericTable';
import GenericPagination from '../../components/GenericPagination';
import usePagination from '../../hooks/usePagination';

const EmployeeList = () => {
    const navigate = useNavigate();

    const {
        items: employees = [], // Default to empty array if no data
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
        fetchData, // Expose fetchData to trigger data fetch manually
    } = usePagination(employeeApi.getAll, 10, 'employees', 'totalCount'); // Pass the API function, items per page, and data key

    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchData(currentPage); // Fetch data when the component mounts and when the current page changes
    }, [currentPage, fetchData]);

    const handleShowModal = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
    };

    const handleConfirmDelete = () => {
        if (selectedEmployee) {
            employeeApi
                .delete(selectedEmployee.EmployeeId)
                .then(() => {
                    fetchData(currentPage); // Fetch data again to refresh the list after deleting an employee
                    handleCloseModal();
                })
                .catch((err) => {
                    console.error('Error deleting employee:', err.message);
                });
        }
    };

    const renderRow = (employee) => (
        <tr key={employee.EmployeeId}>
            <td>{employee.FirstName}</td>
            <td>{employee.LastName}</td>
            <td>{employee.Title}</td>
            <td>{employee.Email}</td>
            <td>{employee.City}</td>
            <td>{employee.Country}</td>
            <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/employees/${employee.EmployeeId}`)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowModal(employee)}
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );

    // Show a loading spinner if data is still being loaded
    if (loading) {
        return (
            <div className="container mt-4" role="status">
                Loading employees...
            </div>
        );
    }

    // Show an error message if there was an error fetching data
    if (error) {
        return (
            <div className="container mt-4 text-danger" role="alert">
                Error: {error}
            </div>
        );
    }

    // Check if there are no employees and display a message
    if (employees.length === 0) {
        return (
            <div className="container mt-4">
                <p>No employees found.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <GenericActions
                onAdd={() => navigate('/employees/add')}
                selectedItem={selectedEmployee}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCloseModal}
                showModal={showModal}
                addLink="/employees/add"
            />

            <GenericTable
                headers={['First Name', 'Last Name', 'Title', 'Email', 'City', 'Country', 'Actions']}
                rows={employees} // Use employees from the usePagination hook
                renderRow={renderRow}
            />

            {totalPages > 1 && ( // Only show pagination if there are more than one page
                <GenericPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default EmployeeList;
