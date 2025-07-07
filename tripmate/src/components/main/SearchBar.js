
import styled from 'styled-components';

const SearchBarBlock = styled.div`
     padding: 3rem 2rem;
     background: #e3f2fd;
     display: flex;
     justify-content: center;
      align-items: center;
    `;

const SearchInput = styled.input`
      width: 100%;
      max-width: 500px;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      border: 2px solid #007bff;
      font-size: 1.1rem;
      outline: none;
      transition: box-shadow 0.2s;
   
      &:focus {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      }
    `;

function SearchBar() {
  return (
    <SearchBarBlock>
      <SearchInput type="text" placeholder="어디로 떠나볼까요? 국내 여행지를 검색해보세요." />
    </SearchBarBlock>
  );
}

export default SearchBar;