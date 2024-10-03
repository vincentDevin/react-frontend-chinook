import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi } from '../../api/entitiesApi';

const CustomerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get customer id from route params if editing
    const [customer, setCustomer] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        City: '',
        Country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            customerApi.getById(id)
                .then((data) => setCustomer(data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const apiCall = id ? customerApi.update : customerApi.insert;
        apiCall(customer)
            .then(() => navigate('/customers'))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div className="container mt-4">
            <h2>{id ? 'Edit Customer' : 'Add Customer'}</h2>
            {error && <div className="text-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="FirstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        className="form-control"
                        value={customer.FirstName}
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
                        value={customer.LastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="Email"
                        name="Email"
                        className="form-control"
                        value={customer.Email}
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
                        value={customer.City}
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
                        value={customer.Country}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {id ? 'Update' : 'Add'} Customer
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/customers')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CustomerForm;
