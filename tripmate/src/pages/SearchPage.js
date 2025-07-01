import { useState } from "react";
import { searchPlace } from "../api/placeApi";
import PlaceCard from "../components/place/PlaceCard";

const SearchPage = () => {
    const [keyword, setKeyword] = useState('')
    const [places, setPlaces] = useState([])

    const handleSearch = async () => {
        const result = await searchPlace({keyword})
        setPlaces(result)
    }

    return (
        <div>
            <h2>장소 검색</h2>

            <input
                value={keyword}
                onChange={(e) => {
                    setKeyword(e.target.value)
                }}
                placeholder="장소를 입력하세요."
            />

            <button onClick={handleSearch}>검색</button>

            {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
            ))}
        </div>
    )
}

export default SearchPage;