import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import {AuthContext} from '../context/AuthContext.js'
function DropdownMenu() {
	const [isOpen, setIsOpen] = useState(false)
	const { isLoggedIn, handleLogout } = useContext(AuthContext)

	const toggleDropdown = () => setIsOpen(!isOpen)

	return (
		<div className="dropdown">
			<button onClick={toggleDropdown} className="dropdown-toggle">
				Menu
			</button>
			{isOpen && (
				<div className="dropdown-menu">
					{isLoggedIn ? (
						<>
							<Link
								to="/favorites"
								className="dropdown-item"
								onClick={toggleDropdown}
							>
								Favorites
							</Link>
							<button
								className="dropdown-item"
								onClick={handleLogout}
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/register"
								className="dropdown-item"
								onClick={toggleDropdown}
							>
								Register
							</Link>
							<Link
								to="/login"
								className="dropdown-item"
								onClick={toggleDropdown}
							>
								Login
							</Link>
						</>
					)}
				</div>
			)}
		</div>
	)
}

export default DropdownMenu
