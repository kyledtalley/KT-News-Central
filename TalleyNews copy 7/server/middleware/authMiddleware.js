import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.send("Access denied. No token provided or invalid format.")
	}

	const token = authHeader.split(" ")[1] // Extract ze token

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded
		next()
	} catch (error) {
		console.error("Token verification failed:", error)
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).send("Token expired.")
		} else if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).send("Invalid token.")
		} else {
			return res
				.status(500)
				.send("An error occurred while verifying the token.")
		}
	}
}

export default authMiddleware
