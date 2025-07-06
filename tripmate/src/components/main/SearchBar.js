import React from 'react';
import '../../css/SearchBar.css';

function SearchBar() {
  return (
    <div className="search-bar">
      <h2>여행을 떠나자!</h2>
      <div className="input-group">
        <select>
          <option>전체</option>
        </select>
        <input type="text" placeholder="검색" />
        <button>검색</button>
      </div>
    </div>
  );
}

export default SearchBar;