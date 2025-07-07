
import React from 'react';
import SearchBar from '../components/main/SearchBar';
import CityGrid from '../components/main/CityGrid'; 
import Footer from '../components/main/Footer';

function MainPage() {
  return (
    <div>
      <SearchBar />
      <CityGrid />
    </div>
  );
}

export default MainPage;