import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { registerUser, loginUser, getUserData } from "../controllers/userController.js"

const userRoutes = express.Router()

userRoutes.post("/register", registerUser)

userRoutes.post("/login", loginUser)

userRoutes.get("/data", authMiddleware, getUserData)

export default userRoutes
