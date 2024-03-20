import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import SearchBar from "./SearchBar"
import logo from "../assets/KTNC-logo.png"
import "./Header.css"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
const Header = ({ onSearch, resetSearch }) => {
	const [theme, setTheme] = useState("dark")
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const { isLoggedIn, handleLogout } = useContext(AuthContext)
	const navigate = useNavigate()

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light"
		setTheme(newTheme)
		document.documentElement.setAttribute("data-theme", newTheme)
	}

	const logout = () => {
		handleLogout()
		navigate("/login")
	}

	return (
		<header className="header">
			<Link to="/" onClick={resetSearch}>
				<img
					src={logo}
					alt="KTNC Logo"
					style={{ width: "150px", height: "auto" }}
				/>
			</Link>
			<Link to="/" className="home-link" onClick={resetSearch}>
				Home
			</Link>
			<SearchBar onSearch={onSearch} />
			<div className="theme-switcher">
				<label className="switch" title="Toggle dark/light mode">
					<input
						type="checkbox"
						onChange={toggleTheme}
						checked={theme === "dark"}
					/>
					<span className="slider round"></span>
				</label>
			</div>
			<div className="user-dropdown">
				<button onClick={toggleDropdown} className="dropdown-toggle">
					Account
				</button>
				{isDropdownOpen && (
					<div className="dropdown-menu">
						<ul>
							{isLoggedIn ? (
								<>
									<li>
										<Link
											to="/user/favorites"
											onClick={() =>
												setIsDropdownOpen(false)
											}
										>
											Favorites
										</Link>
									</li>
									<li>
										<button onClick={logout}>Logout</button>
									</li>
								</>
							) : (
								<>
									<li>
										<Link
											to="/register"
											onClick={() =>
												setIsDropdownOpen(false)
											}
										>
											Register
										</Link>
									</li>
									<li>
										<Link
											to="/login"
											onClick={() =>
												setIsDropdownOpen(false)
											}
										>
											Login
										</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				)}
			</div>
		</header>
	)
}

export default Header
