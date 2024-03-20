import Article from "../models/Article.model.js"
import Favorite from "../models/Favorite.model.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const getUserIdFromToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		return decoded.id
	} catch (error) {
		console.error("Error decoding token:", error)
		return null
	}
}



const findOrCreateArticleByUrl = async (articleData) => {
	const { url, title, description, urlToImage } = articleData
	const articleId = crypto.createHash("sha256").update(url).digest("hex")

	try {
		let article = await Article.findOne({ articleId })
		if (!article && title && description) {
			article = await Article.create({
				articleId,
				url,
				title,
				description,
				urlToImage,
			})
		}
		return article
	} catch (error) {
		console.error("Error finding or creating article:", error)
		throw error
	}
}

export const saveArticle = async (req, res) => {
	const token = req.headers.authorization.split(" ")[1]
	const userId = getUserIdFromToken(token)

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	const { title, description, url, urlToImage } = req.body
	try {
		const newArticle = await Article.create({
			title,
			description,
			url,
			urlToImage,
			user: userId,
		})
		res.status(201).json(newArticle)
	} catch (error) {
		res.status(400).json({
			message: "Failed to save article",
			error: error.message,
		})
	}
}

export const getArticleByCompositeKey = async (req, res) => {
	try {
		const { compositeKey } = req.params
		const article = await Article.findOne({ compositeKey })
		console.log("Composite Key? : ", compositeKey)
		if (!article) {
			return res.status(404).json({ message: "Article not found" })
		}
		res.json(article)
	} catch (error) {
		console.error("Error fetching article:", error)
		res.status(500).send("Internal Server Error")
	}
}

export const favoriteArticle = async (req, res) => {
	const { articleId } = req.params

	const token = req.headers.authorization.split(" ")[1]
	const userId = getUserIdFromToken(token)

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	try {
		const article = await Article.findOne({ articleId })
		if (!article) {
			return res.status(404).json({ message: "Article not found" })
		}

		const newFavorite = await Favorite.create({
			user: userId,
			article: article._id,
		})
		res.status(201).json(newFavorite)
	} catch (error) {
		res.status(400).json({
			message: "Failed to favorite article",
			error: error.message,
		})
	}
}

export const unfavoriteArticle = async (req, res) => {
	const token = req.headers.authorization.split(" ")[1]
	const userId = getUserIdFromToken(token)

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	const articleUrl = decodeURIComponent(req.params.articleUrl)

	try {
		let article = await Article.findOne({ url: articleUrl })
		if (article) {
			await Favorite.findOneAndDelete({
				article: article._id,
				user: userId,
			})
			res.status(200).json({
				message: "Article unfavorited successfully",
			})
		} else {
			res.status(404).json({ message: "Article not found" })
		}
	} catch (error) {
		res.status(400).json({
			message: "Failed to unfavorite article",
			error: error.message,
		})
	}
}
