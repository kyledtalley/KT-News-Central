import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style/Form.css";

function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/user/login",
                formData
            );
            handleLogin(response.data.token);
            navigate("/");
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="form-submit-btn">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
