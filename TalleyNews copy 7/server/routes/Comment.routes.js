import express from "express"
import Comment from "../models/Comment.model.js"
import mongoose from "mongoose"
import authMiddleware from "../middleware/authMiddleware.js"
const commentRoutes = express.Router()
commentRoutes.get("/:articleId/comments", async (req, res) => {
	const { articleId } = req.params

	if (!mongoose.Types.ObjectId.isValid(articleId)) {
		return res.status(400).json({ message: "Invalid articleId" })
	}

	try {
		const comments = await Comment.find({ article: articleId })
			.populate("user", "username")
			.exec()

		res.json(comments)
	} catch (error) {
		console.error("Error fetching comments:", error)
		res.status(500).json({ message: "Error fetching comments" })
	}
})

commentRoutes.post("/:articleId/comments", authMiddleware, async (req, res) => {
	const { articleId } = req.params
	const { content } = req.body
	const user = req.user.id

	console.log("comments POST route articleId:", articleId)
	console.log("comments POST route content", content)
	console.log("comments POST route user", user)

	if (!mongoose.Types.ObjectId.isValid(articleId)) {
		return res.status(400).json({ message: "Invalid articleId" })
	}

	try {
		const newComment = new Comment({
			article: articleId,
			content,
			user: user,
		})
		await newComment.save()
		res.status(201).json(newComment)
	} catch (error) {
		console.error("Error posting comment:", error)
		res.status(500).json({ message: "Error posting comment" })
	}
})

commentRoutes.delete(
	"/comments/:commentId",
	authMiddleware,
	async (req, res) => {
		const { commentId } = req.params
		const user = req.user.id

		try {
			const comment = await Comment.findById(commentId)

			if (!comment) {
				return res.status(404).json({ message: "Comment not found" })
			}

			if (comment.user.toString() !== user) {
				return res
					.status(403)
					.json({ message: "Unauthorized to delete this comment" })
			}

			await Comment.findByIdAndDelete(commentId)
			res.json({ message: "Comment deleted successfully" })
		} catch (error) {
			console.error("Error deleting comment:", error)
			res.status(500).json({ message: "Error deleting comment" })
		}
	}
)

commentRoutes.put("/comments/:commentId", authMiddleware, async (req, res) => {
	const { commentId } = req.params
	const { content } = req.body
	const userId = req.user.id

	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		return res.status(400).json({ message: "Invalid commentId" })
	}

	try {
		const comment = await Comment.findById(commentId)

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" })
		}

		if (comment.user.toString() !== userId) {
			return res
				.status(403)
				.json({ message: "Unauthorized to edit this comment" })
		}

		comment.content = content
		await comment.save()

		res.json(comment)
	} catch (error) {
		console.error("Error updating comment:", error)
		res.status(500).json({ message: "Error updating comment" })
	}
})

export default commentRoutes
