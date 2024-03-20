import React, { useState } from "react"

const CommentForm = ({ articleId, onSubmit }) => {
	const [commentText, setCommentText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		setIsLoading(true);
		if (onSubmit) {
			onSubmit({ content: commentText }).finally(() => {
				setIsLoading(false);
				setCommentText("");
			});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				value={commentText}
				onChange={(e) => setCommentText(e.target.value)}
				placeholder="Leave a comment"
			/>
			<button type="submit" disabled={isLoading || !commentText.trim()}>
				{isLoading ? "Submitting..." : "Submit Comment"}
			</button>
		</form>
	);
};

export default CommentForm
