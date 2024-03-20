import mongoose from "mongoose"

const { Schema } = mongoose

const commentSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		article: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Article",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
)

commentSchema.pre("save", async function (next) {
	next()
})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
