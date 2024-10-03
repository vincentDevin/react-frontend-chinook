import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeApi } from '../../api/entitiesApi'; // Import the API functions for employees

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get employee id from route params if editing
    const [employee, setEmployee] = useState({
        FirstName: '',
        LastName: '',
        Title: '',
        Email: '',
        City: '',
        Country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            employeeApi.getById(id)
                .then((data) => setEmployee(data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const apiCall = id ? employeeApi.update : employeeApi.insert;
        apiCall(employee)
            .then(() => navigate('/employees'))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div className="container mt-4">
            <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
            {error && <div className="text-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="FirstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        className="form-control"
                        value={employee.FirstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="LastName" className="form-label">Last Name</label>
                    <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        className="form-control"
                        value={employee.LastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="Title"
                        name="Title"
                        className="form-control"
                        value={employee.Title}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="Email"
                        name="Email"
                        className="form-control"
                        value={employee.Email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="City" className="form-label">City</label>
                    <input
                        type="text"
                        id="City"
                        name="City"
                        className="form-control"
                        value={employee.City}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Country" className="form-label">Country</label>
                    <input
                        type="text"
                        id="Country"
                        name="Country"
                        className="form-control"
                        value={employee.Country}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {id ? 'Update' : 'Add'} Employee
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/employees')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EmployeeForm;
