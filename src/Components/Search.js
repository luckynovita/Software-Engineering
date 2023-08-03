import React, { useState } from "react";

const Search = ({ items }) => {
  const [searchID, setSearchID] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const searchID= e.target.value;
    setSearchID(searchID);

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchID.toLowerCase())
    );
    setSearchResults(filteredItems);
  };

  return (
    <div>
      <input
        type="text"
        value={searchID}
        onChange={handleSearch}
        placeholder="Search items"
      />
      {/* <ul>
        {searchResults.map((item) => (
          <li key={item.id}>
            <p>ID: {item.id}</p>
            <p>Name: {item.name}</p>
            <p>Description: {item.description}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Search;
