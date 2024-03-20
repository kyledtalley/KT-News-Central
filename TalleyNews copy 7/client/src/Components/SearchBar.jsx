import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(input);
        setInput('')
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search News..."
                value={input}
                onChange={handleInputChange}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
