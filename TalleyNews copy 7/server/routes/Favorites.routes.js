import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {
	addFavorite,
	// deleteFavorite,
	handleCommentPost,
	getFavoritesForUser,
	getFavoriteByArticleId,
} from "../controllers/favoritesController.js"

const favoriteRoutes = express.Router()
//Uses (/user/favorites)
favoriteRoutes.get("/", authMiddleware, getFavoritesForUser)
favoriteRoutes.post("/:articleId", authMiddleware, addFavorite)
favoriteRoutes.get("/articles/:articleId", getFavoriteByArticleId);

favoriteRoutes.post(
	"/:articleId/comments",
	authMiddleware,
	handleCommentPost
)
// favoriteRoutes.delete("/:articleId", authMiddleware, deleteFavorite)

export default favoriteRoutes
