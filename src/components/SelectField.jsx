/* eslint-disable react/prop-types */
const SelectField = ({ id, label, options, register, error, ...rest }) => (
    <div className="mb-3">
        <label htmlFor={id} className="form-label">
            {label}
        </label>
        <select
            id={id}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            {...register(id)}
            aria-invalid={error ? 'true' : 'false'}
            {...rest}
        >
            <option value="">Select {label}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
);

export default SelectField;
