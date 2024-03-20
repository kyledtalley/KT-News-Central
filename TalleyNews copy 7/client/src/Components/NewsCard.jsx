import React from "react"
import { useNavigate } from "react-router-dom"
import "./NewsCard.css"

const NewsCard = ({
	article,
	onFavoriteChange = () => console.warn('onFavoriteChange not provided'),
	isFavorite,
	showCommentsButton,
	compositeKey,
}) => {
	console.log("NewsCard props", {
		article,
		onFavoriteChange,
		isFavorite,
		showCommentsButton,
		compositeKey,
	})
	const navigate = useNavigate()

	const {
		title = "No title available",
		description,
		url,
		urlToImage,
		publishedAt,
		source,
	} = article || {}

	const publishedDateTime = new Date(publishedAt).toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: true,
	})

	const handleFavoriteToggle = () => {
		console.log("handleFavoriteToggle called", { onFavoriteChange })
		onFavoriteChange(article._id, !isFavorite)
	}

	const handleViewComments = () => {
		navigate(`/favorites/${compositeKey}/comments`)
	}

	const handleReadMoreClick = () => {
		window.open(url, "_blank")
	}

	return (
		<div className="card">
			{urlToImage && (
				<img
					className="card-img-top"
					src={urlToImage}
					alt={title}
				/>
			)}
			<div className="card-body">
				<h5 className="card-title">{title}</h5>
				<p className="card-text">{description}</p>
				{source?.name && (
					<p className="article-source">Source: {source.name}</p>
				)}
				<p className="article-date">Published: {publishedDateTime}</p>
				<button className="btn-read-more" onClick={handleReadMoreClick}>
					Read more
				</button>
				<button
					onClick={handleFavoriteToggle}
					className={
						isFavorite ? "unfavorite-button" : "favorite-button"
					}
				>
					{isFavorite ? "Unfavorite" : "Favorite"}
				</button>
				{showCommentsButton && (
					<button
						onClick={handleViewComments}
						className="btn-comments"
					>
						View Comments
					</button>
				)}
			</div>
		</div>
	)
}

export default NewsCard
