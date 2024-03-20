import React from "react"
import "./Pagination.css"

const Pagination = ({
	articlesPerPage,
	totalArticles,
	paginate,
	currentPage,
}) => {
	const pageNumbers = []

	for (let i = 1; i <= Math.ceil(totalArticles / articlesPerPage); i++) {
		pageNumbers.push(i)
	}

	return (
		<nav>
			<ul className="pagination">
				{pageNumbers.map((number) => (
					<li
						key={number}
						className={`page-item ${
							currentPage === number ? "active" : ""
						}`}
					>
						<button
							onClick={() => paginate(number)}
							className="page-link"
						>
							{number}
						</button>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default Pagination
