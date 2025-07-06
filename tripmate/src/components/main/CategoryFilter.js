import React from 'react';
import '../../css/CategoryFilter.css';

const categories = ['전체', '음식점', '데이트여행', '쇼핑', '문화/예술', '숙박'];

function CategoryFilter() {
  return (
    <div className="category-filter">
      {categories.map((cat, idx) => (
        <button key={idx}>{cat}</button>
      ))}
    </div>
  );
}

export default CategoryFilter;