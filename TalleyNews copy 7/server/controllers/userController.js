import User from "../models/User.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
	const { username, email, password } = req.body

	try {
		const userExists = await User.findOne({ email })
		if (userExists) {
			return res.status(400).json({ message: "User already exists" })
		}

		const user = new User({ username, email, password })
		await user.save()

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		})

		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			token,
		})
	} catch (error) {
		res.status(400).json({
			message: "Registration failed",
			errors: error.message,
		})
	}
}

export const loginUser = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })
		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			})

			res.json({
				_id: user._id,
				username: user.username,
				email: user.email,
				token, //should really really really be a new token every time
			})
		} else {
			res.status(401).json({ message: "Invalid email or password" })
		}
	} catch (error) {
		res.status(500).json({
			message: "Error during login",
			error: error.message,
		})
	}
}

export const getUserData = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password") //NO PASSWORD FOR YOU.

		if (!user) {
			return res.status(404).json({ message: "User not found" })
		}

		res.json(user)
	} catch (error) {
		console.error(error)
		res.status(500).send("Server Error")
	}
}

