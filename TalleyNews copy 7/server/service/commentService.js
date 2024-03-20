import axios from 'axios'

async function saveComment(commentData, articleId) {
    try {
        const response = await axios.post(
            `http://localhost:8000/articles/${articleId}/comments`,
            commentData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting comment:", error);
        throw new Error("Failed to submit comment: " + error.message);
    }
}

export default saveComment
