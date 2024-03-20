import Favorite from "../models/Favorite.model.js"
import Article from "../models/Article.model.js"
import saveComment from "../service/commentService.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import mongoose from "mongoose"

export const getUserIdFromToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		return decoded.id
	} catch (error) {
		console.error("Error decoding token:", error)
		return null
	}
}

export const getFavoriteByArticleId = async (req, res) => {
	try {
		const { articleId } = req.params

		if (!mongoose.Types.ObjectId.isValid(articleId)) {
			return res.status(400).json({ message: "Invalid article ID." })
		}

		console.log("articleId from getFavoriteByArticleId: ", articleId)

		const favorite = await Favorite.findOne({
			article: articleId,
		}).populate("article")

		if (!favorite) {
			return res
				.status(404)
				.json({ message: "Favorite not found for given article ID." })
		}

		res.json(favorite)
	} catch (error) {
		console.error("Error fetching favorite by article ID:", error)
		res.status(500).json({ message: "Internal Server Error" })
	}
}

export const handleCommentPost = async (req, res) => {
	const { articleId } = req.params
	const { comment } = req.body

	try {
		const savedComment = await saveComment(comment, articleId)
		res.status(201).json({
			message: "Comment added successfully!",
			comment: savedComment,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Failed to add comment." })
	}
}

export const getFavoritesForUser = async (req, res) => {
	try {
		const favorites = await Favorite.find({ user: req.user.id }).populate(
			"article"
		)
		const response = favorites.map((favorite) => ({
			...favorite.toObject(),
			favoriteId: favorite._id,
		}))
		res.json(response)
	} catch (error) {
		console.error("Failed to fetch favorites:", error)
		res.status(500).send("Internal Server Error")
	}
}

export const findOrCreateArticleByUrl = async (articleData) => {
	const { url, title, description, urlToImage, publishedAt, source } =
		articleData
	const articleId = crypto.createHash("sha256").update(url).digest("hex")

	try {
		let article = await Article.findOne({ url })
		if (!article) {
			article = new Article({
				title,
				url,
				description,
				urlToImage,
				publishedAt,
				source,
			})
			await article.save()
		}
		return article
	} catch (error) {
		console.error("Error finding or creating article:", error)
		throw error
	}
}

export const addFavorite = async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1]
	const userId = getUserIdFromToken(token)
	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	const articleData = req.body
	if (!articleData.url) {
		return res.status(400).json({ message: "Article URL is required" })
	}

	try {
		const article = await findOrCreateArticleByUrl(articleData)

		const newFavorite = new Favorite({
			user: userId,
			article: article._id,
			articleId,
		})

		await newFavorite.save()
		res.status(201).json(newFavorite)
	} catch (error) {
		console.error("Failed to add favorite:", error)
		res.status(500).send("Internal Server Error")
	}
}

export const deleteFavorite = async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1]
	const userId = getUserIdFromToken(token)

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	const { articleId } = req.params

	try {
		const favorite = await Favorite.findOneAndDelete({
			articleId,
			user: userId,
		})

		if (!favorite) {
			return res.status(404).json({ message: "Favorite not found" })
		}

		res.json({ message: "Favorite removed successfully" })
	} catch (error) {
		console.error("Failed to remove favorite:", error)
		res.status(500).send("Internal server error")
	}
}
