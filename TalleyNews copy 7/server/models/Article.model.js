import mongoose from "mongoose"
import crypto from "crypto"

const { Schema } = mongoose

const articleSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: String,
		url: {
			type: String,
			required: true,
			unique: true,
		},
		urlToImage: String,
		publishedAt: Date,
		// content: String, //was truncated with 3.7k+ characters, didn't know how to make the server expect that so I removed the field
		source: {
			id: String,
			name: String,
		},
		articleId: {
			type: String,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
)
articleSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("url")) {
        this.articleId = crypto.createHash("sha256").update(this.url).digest("hex");
    }
    next();
});


const Article = mongoose.model("Article", articleSchema)

export default Article
