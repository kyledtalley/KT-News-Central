import mongoose from "mongoose"
import crypto from "crypto"

const { Schema } = mongoose

const favoriteSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		article: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Article",
			required: true,
		},
		compositeKey: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

favoriteSchema.pre("save", function (next) {
	if (this.isNew || this.isModified("user") || this.isModified("article")) {
		this.compositeKey = crypto
			.createHash("sha256")
			.update(`${userId}_${articleId}`)
			.digest("hex")
	}
	next()
})

const Favorite = mongoose.model("Favorite", favoriteSchema)

export default Favorite
