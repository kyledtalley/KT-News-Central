import fetch from "node-fetch";

async function getArticles(req, res) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?from=${fromDate.toISOString()}&sortBy=publishedAt&apiKey=7f53c715f0a4415581135966bae1c596`
        );
        const data = await response.json();
        if (data.status === "ok") {
            const articles = data.articles;
            res.json(articles);
        } else {
            res.status(500).json({ message: "Error fetching articles from API" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching articles",
            error: error,
        });
    }
}

export { getArticles };
