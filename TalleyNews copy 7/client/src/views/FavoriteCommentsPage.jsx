import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import CommentForm from "./commentForm"
import axios from "axios"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import "../style/FavoriteCommentsPage.css"

function FavoriteCommentsPage() {
	const { currentUser } = useContext(AuthContext)
	const { articleId } = useParams()
	const [comments, setComments] = useState([])
	const [editingCommentId, setEditingCommentId] = useState(null)
	const [editInputValue, setEditInputValue] = useState("")

	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	const token = localStorage.getItem("token")

	const fetchComments = async () => {
		setIsLoading(true)
		try {
			const response = await axios.get(
				`http://localhost:8000/favorites/${articleId}/comments`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			console.log("Fetched Comments: ", response.data)
			setComments(response.data)
			console.log("Post Fetched Comments:", response.data)
		} catch (error) {
			console.error("Error fetching comments:", error)
			setError("Failed to load comments.")
		} finally {
			setIsLoading(false)
		}
	}

	const saveEditedComment = async (commentId) => {
		try {
			await axios.put(
				`http://localhost:8000/favorites/comments/${commentId}`,
				{ content: editInputValue },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			setComments(
				comments.map((comment) => {
					if (comment._id === commentId) {
						return { ...comment, content: editInputValue }
					}
					return comment
				})
			)

			setEditingCommentId(null)
			setEditInputValue("")
		} catch (error) {
			console.error("Error updating comment:", error)
		}
	}

	useEffect(() => {
		fetchComments()
	}, [articleId])

	const handleNewComment = async (commentData) => {
		setIsLoading(true)
		try {
			const response = await axios.post(
				`http://localhost:8000/favorites/${articleId}/comments`,
				commentData,
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			setComments((prevComments) => [...prevComments, response.data])
		} catch (error) {
			console.error("Error submitting comment:", error)
			setError("Error submitting comment.")
		} finally {
			setIsLoading(false)
		}
	}

	const handleDeleteComment = async (commentId) => {
		const token = localStorage.getItem("token")
		try {
			await axios.delete(
				`http://localhost:8000/favorites/comments/${commentId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			fetchComments()
		} catch (error) {
			console.error("Error deleting comment:", error)
		}
	}

	return (
		<div className="comments-section">
			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p className="error-message">{error}</p>
			) : (
				<>
					<h3>Comments</h3>
					{comments.length > 0 ? (
						<ul className="comment-list">
							{comments.map((comment) => (
								<li key={comment._id} className="comment-item">
									{editingCommentId === comment._id ? (
										<div>
											<input
												type="text"
												value={editInputValue}
												onChange={(e) =>
													setEditInputValue(
														e.target.value
													)
												}
											/>
											<button
												onClick={() =>
													saveEditedComment(
														comment._id
													)
												}
											>
												Save
											</button>
										</div>
									) : (
										<div>
											<span className="comment-content">
												{comment.content}
											</span>
											<div className="comment-metadata">
												<span className="comment-username">
													{comment.user.username}
												</span>
												<span className="comment-timestamp">
													{new Date(
														comment.createdAt
													).toLocaleString()}
												</span>
											</div>
											<button
												onClick={() => {
													setEditingCommentId(
														comment._id
													)
													setEditInputValue(
														comment.content
													)
												}}
											>
												Edit
											</button>
										</div>
									)}
									<button
										onClick={() =>
											handleDeleteComment(comment._id)
										}
									>
										Delete
									</button>
								</li>
							))}
						</ul>
					) : (
						<p>No comments yet.</p>
					)}
					<CommentForm
						articleId={articleId}
						onSubmit={handleNewComment}
					/>
				</>
			)}
		</div>
	)
}

export default FavoriteCommentsPage
