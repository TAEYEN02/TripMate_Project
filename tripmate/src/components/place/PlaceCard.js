import { useNavigate } from "react-router-dom";

const PlaceCard = ({place}) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/place/${place.id}`)}
            style={{border: '1px solid gray', padding: 10, margin: 5}}
        >
            <h4>{place.name}</h4>
            <p>{place.category}</p>
            <p>{place.address}</p>
        </div>
    )
}

export default PlaceCard;