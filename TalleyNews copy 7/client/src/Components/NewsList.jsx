import React from "react"
import NewsCard from "./NewsCard"
import "./NewsList.css"

const NewsList = ({ articles = [] }) => {
	const breakingNewsTimeframe = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

	const filteredArticles = articles.filter((article) => article.urlToImage) //if no image destroy article

	return (
		<div className="news-list">
			{filteredArticles.map((article, index) => {
				const breakingNewsThreshold = new Date(
					new Date().getTime() - breakingNewsTimeframe
				)
				const isBreakingNews =
					new Date(article.publishedAt) > breakingNewsThreshold

				const articleWithFlag = { ...article, isBreakingNews }

				const key = article.url || `article-${index}`;

				return <NewsCard key={key} article={articleWithFlag} />
			})}
		</div>
	)
}

export default NewsList
