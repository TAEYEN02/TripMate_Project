import { useEffect, useState } from "react";
import { getPlaceDetail } from "../api/placeApi";
import { getReviewsByPlace, createReview, deleteReview } from "../api/reviewApi";
import ReviewList from "../components/review/ReviewList";
import ReviewForm from "../components/review/ReviewForm";
import { useParams } from "react-router-dom";

const PlaceDetailPage = () => {
    const {placeId} = useParams()
    const [place, setPlace] = useState(null)
    const [reviews, setReviews] = useState([])
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchData = async () => {
            const placeInfo = await getPlaceDetail(placeId)
            const reviewsList = await getReviewsByPlace(placeId)
            setPlace(placeInfo)
            setReviews(reviewsList)
        }

        fetchData()
    }, [placeId])

    const handleReviewSubmit = async (data) => {
        await createReview({...data, placeId}, token)
        const updated = await getReviewsByPlace(placeId)
        setReviews(updated)
    }

    const handleReviewDelete = async (reviewId) => {
        await deleteReview(reviewId, token)
        const updated = await getReviewsByPlace(placeId)
        setReviews(updated)
    }

    if(!place) return <div>로딩 중...</div>

    return (
        <div>
            <h2>{place.name}</h2>
            <p>{place.category}</p>
            <p>{place.address}</p>

            <ReviewForm onSubmit={handleReviewSubmit}/>
            <ReviewList reviews={reviews} onSubmit={handleReviewDelete}/>
        </div>
    )
}

export default PlaceDetailPage;