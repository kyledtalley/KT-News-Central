import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+\@.+\..+/, "Please fill a valid email address"],
	},
	password: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				//Alien language
				return /^(?=.*\d).{6,}$/.test(v)
			},
			message: (props) =>
				`${props.value} is not a strong enough password.`,
		},
	},
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],


})


userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12)
	}
	next()
})

const User = mongoose.model("User", userSchema)

export default User
