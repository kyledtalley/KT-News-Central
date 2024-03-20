import React, { createContext, useState } from "react"

const CompositeKeyContext = createContext({
	compositeKey: null,
	setCompositeKey: (newCompositeKey) => {},
})

const CompositeKeyProvider = ({ children }) => {
	const [compositeKey, setCompositeKey] = useState(null)

	const updateCompositeKey = (newCompositeKey) => {
		setCompositeKey(newCompositeKey)
	}

	return (
		<CompositeKeyContext.Provider
			value={{ compositeKey, setCompositeKey: updateCompositeKey }}
		>
			{children}
		</CompositeKeyContext.Provider>
	)
}

export { CompositeKeyContext, CompositeKeyProvider }
