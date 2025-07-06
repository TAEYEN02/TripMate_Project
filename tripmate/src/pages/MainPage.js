import React from 'react';
import SearchBar from '../components/main/SearchBar';
import CategoryFilter from '../components/main/CategoryFilter';
import ItemGrid from '../components/main/ItemGrid';
import Pagination from '../components/main/Pagination';
import Footer from '../components/main/Footer';

function MainPage() {
  return (
    <div>
      <SearchBar />
      <CategoryFilter />
      <ItemGrid />
      <Pagination />
      <Footer />
    </div>
  );
}

export default MainPage;