import express from "express"
import mongoose from "mongoose"
import User from '../models/User.model.js'
import jwt from "jsonwebtoken" // Assuming you're using JWT for authentication

const Comment = mongoose.model("Comment")
const Article = mongoose.model("Article")

const commentRouter = express.Router()

commentRouter.post("/:articleId/comments", async (req, res) => {
	const { content } = req.body
	const { articleId } = req.params
	const token = req.headers.authorization?.split(" ")[1] // should be a bearer token

	// validate ze input
	if (!content) {
		return res
			.status(400)
			.json({ message: "Comment content cannot be empty" })
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findById(decodedToken.id)
		if (!user) {
			return res.status(404).json({ message: "User not found" })
		}

		const article = await Article.findById(articleId)
		if (!article) {
			return res.status(404).json({ message: "Article not found" })
		}

		const newComment = new Comment({
			user: user._id,
			article: article._id,
			content,
		})
		const savedComment = await newComment.save()



		res.status(201).json(savedComment)
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Invalid token" })
		}
		console.error("Error creating comment:", error)
		res.status(500).json({ message: "Error creating comment" })
	}
})

export default commentRouter
