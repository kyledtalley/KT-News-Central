import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import dbConnect from "./config/mongoose.config.js"
import userRoutes from "./routes/User.routes.js"
import articleRoutes from "./routes/Article.routes.js"
import newsRoutes from "./routes/news.routes.js"
import favoriteRoutes from "./routes/Favorites.routes.js"
import commentRoutes from "./routes/Comment.routes.js"
import { getFavoriteByArticleId } from "./controllers/favoritesController.js"

dotenv.config()

const app = express()
dbConnect()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.use("/user", userRoutes)
app.use("/api", newsRoutes)
app.use("/api/articles", articleRoutes)
app.use("/user/favorites", favoriteRoutes)
app.use("/favorites", commentRoutes);


const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
