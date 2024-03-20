import jwt from 'jsonwebtoken'

export const isTokenExpired = (token) => {
	try {
		const decoded = jwtDecode(token)
		const now = Date.now() / 1000
		return decoded.exp < now
	} catch (error) {
		console.error("Error decoding token:", error)
		return true
	}
}

export const getUserIdFromToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		return decoded.id
	} catch (error) {
		console.error("Error decoding token:", error)
		return null
	}
}
