import React, { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem("token")
		setIsLoggedIn(!!token)
	}, [])

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

	const handleLogout = () => {
		localStorage.removeItem("token")
		setIsLoggedIn(false)
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}
