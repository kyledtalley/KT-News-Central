import React, { useState } from 'react';
import axios from 'axios';
import '../style/Form.css';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        if (formData.password !== formData.confirmPassword) {
            setFormErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/user/register', formData);
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setFormErrors(error.response.data.errors);
            } else if (error.response && error.response.data.message) {
                setFormErrors({ general: error.response.data.message });
            } else {
                console.error(error.message || "An error occurred during registration.");
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                {formErrors.general && <div className="form-error">{formErrors.general}</div>}

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {formErrors.confirmPassword && <div className="form-error">{formErrors.confirmPassword}</div>}
                </div>

                <button type="submit" className="form-submit-btn">Register</button>
            </form>
        </div>
    );
}

export default RegistrationForm;
