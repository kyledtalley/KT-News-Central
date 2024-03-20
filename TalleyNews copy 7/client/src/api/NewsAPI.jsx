import axios from "axios"

const USER_BASE_URL = "http://localhost:8000/user"
const API_BASE_URL = "http://localhost:8000/api"
const NEWS_API_BASE_URL = "https://newsapi.org/v2"
const API_KEY = "7f53c715f0a4415581135966bae1c596"

export const fetchTopNews = async () => {
	try {
		const response = await axios.get(
			`${NEWS_API_BASE_URL}/top-headlines?country=us&pageSize=100&sortBy=popularity&apiKey=${API_KEY}`
		)
		return response.data.articles
	} catch (error) {
		console.error("Error fetching top news:", error)
		return []
	}
}

export const fetchArticles = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/articles`)
		return response.data
	} catch (error) {
		console.error("Error fetching articles:", error)
		return []
	}
}

export const fetchUserData = async () => {
	const headers = {}

	// Retrieve ze token from localStorage
	const token = localStorage.getItem("token")

	// If ze token exists, add it to ze request headers
	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	try {
		const response = await axios.get(`${USER_BASE_URL}/data`, {
			headers,
		})
		return response.data
	} catch (error) {
		console.error("Error fetching user data:", error.response || error)
		throw error
	}
}
