import React, { useState, useEffect } from "react"
import NewsList from "./Components/NewsList"
import axios from "axios"
import Pagination from "./Components/Pagination"
import Header from "./Components/Header"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import RegistrationForm from "./views/registrationForm"
import LoginForm from "./views/loginForm"
import Favorite from "../../server/models/Favorite.model.js"
import { AuthProvider } from "./context/AuthContext"
import Favorites from "./Components/Favorites.jsx"
import {
	CompositeKeyContext,
	CompositeKeyProvider,
} from "./service/CompositeKeyContext.jsx"
import FavoriteCommentsPage from "./views/FavoriteCommentsPage.jsx"
import Background from "./assets/gggyrate.svg"

const NEWS_API_URL =
    "https://newsapi.org/v2/everything?q=*&language=en&sortBy=publishedAt&apiKey=7f53c715f0a4415581135966bae1c596";


function App() {
	const [compositeKey, setCompositeKey] = useState(null)
	const [articles, setArticles] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalArticles, setTotalArticles] = useState(0)
	const articlesPerPage = 10

	const fetchTopNews = async () => {
		try {
			const response = await axios.get(NEWS_API_URL)
			const fetchedArticles = response.data.articles
			setArticles(fetchedArticles)
			setTotalArticles(fetchedArticles.length)
		} catch (error) {
			console.error("Error fetching top news:", error)
		}
	}

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", "dark")
		fetchTopNews()
	}, [])

	const handleSearch = (query) => {
		const lowerCaseQuery = query.toLowerCase()
		const filteredArticles = articles.filter((article) =>
			article.title.toLowerCase().includes(lowerCaseQuery)
		)
		setArticles(filteredArticles)
		setTotalArticles(filteredArticles.length)
		setCurrentPage(1) // reset to the first page after ze search
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const currentArticles = articles.slice(
		(currentPage - 1) * articlesPerPage,
		currentPage * articlesPerPage
	)

	return (
		<div
			style={{
				backgroundImage: `url(${Background})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				minHeight: "100vh",
			}}
		>
			<Router>
				<AuthProvider>
					<CompositeKeyContext.Provider
						value={{ compositeKey, setCompositeKey }}
					>
						<Header onSearch={handleSearch} />
						<Routes>
							<Route
								path="/"
								element={
									<>
										<NewsList articles={currentArticles} />
										<Pagination
											articlesPerPage={articlesPerPage}
											totalArticles={totalArticles}
											paginate={handlePageChange}
											currentPage={currentPage}
										/>
									</>
								}
							/>

							<Route
								path="/register"
								element={<RegistrationForm />}
							/>
							<Route path="/login" element={<LoginForm />} />
							<Route
								path="/user/favorites"
								element={
									<>
										<Favorites FavoriteModel={Favorite} />
										<Pagination
											articlesPerPage={articlesPerPage}
											totalArticles={totalArticles}
											paginate={handlePageChange}
											currentPage={currentPage}
										/>
									</>
								}
							/>
							<Route
								path="/favorites/:articleId/comments"
								element={<FavoriteCommentsPage />}
							/>
						</Routes>
					</CompositeKeyContext.Provider>
				</AuthProvider>
			</Router>
		</div>
	)
}

export default App
