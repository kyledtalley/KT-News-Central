import express from "express"
import { getArticles } from "../controllers/newsController.js"

const newsRoutes = express.Router()


newsRoutes.get("/articles", getArticles)


export default newsRoutes
