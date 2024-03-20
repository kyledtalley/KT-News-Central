import React, { useState, useEffect } from "react"
import axios from "axios"
import NewsCard from "./NewsCard.jsx"
import "../style/Favorites.css"
import "../App.css"
import Pagination from "./Pagination.jsx"

const Favorites = () => {
	const [favorites, setFavorites] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const favoritesPerPage = 10

	useEffect(() => {
		const fetchFavorites = async () => {
			const token = localStorage.getItem("token")
			if (!token) return

			try {
				const { data } = await axios.get(
					"http://localhost:8000/user/favorites",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				)
				console.log("data from fetchFavorites call: ", data)

				const favoritesWithFullArticles = await Promise.all(
					data.map(async (favorite) => {
						const articleId =
							favorite.article && favorite.article._id
								? favorite.article._id
								: favorite.articleId
						if (favorite.articleId) {
							try {
								const articleResponse = await axios.get(
									`http://localhost:8000/user/favorites/articles/${favorite.articleId}`,
									{
										headers: {
											Authorization: `Bearer ${token}`,
										},
									}
								)
								return {
									...favorite,
									article: articleResponse.data,
								}
							} catch (error) {
								console.error(
									`Error fetching article for favorite ${favorite._id}:`,
									error
								)
								return null
							}
						}
						return favorite
					})
				)

				const validFavorites = favoritesWithFullArticles.filter(
					(favorite) => favorite !== null
				)
				const deduplicatedFavorites = Array.from(
					new Map(
						validFavorites.map((item) => [item.article._id, item])
					).values()
				)

				setFavorites(deduplicatedFavorites)
			} catch (error) {
				console.error("Error fetching favorites:", error)
			}
		}

		fetchFavorites()
	}, [])

	const handleFavoriteChange = (articleId, newIsFavorited) => {
		setFavorites((currentFavorites) =>
			currentFavorites.map((fav) =>
				fav.article._id === articleId
					? { ...fav, isFavorite: newIsFavorited }
					: fav
			)
		)
		console.log(
			`Article ID: ${articleId}, New Favorite State: ${newIsFavorited}`
		)
		console.log(typeof handleFavoriteChange)
	}

	return (
		<div className="favorites-list">
			<h2>My Favorites</h2>
			<div className="news-list">
				{favorites.map((favorite) => (
					<div key={favorite._id}>
						<NewsCard
							article={favorite.article}
							isFavorite={true}
							onFavoriteChange={handleFavoriteChange}
							showCommentsButton={true}
							compositeKey={favorite._id}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default Favorites
