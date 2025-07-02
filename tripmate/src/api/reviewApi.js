import axios from "axios";

export const getReviewsByPlace = async (placeId) => {
    const response = await axios.get(`/review/place/${placeId}`)
    return response.data
}

export const createReview = async (reviewData, token) => {
    const response = await axios.post('/review', reviewData, {
        headers: {
            Authorization: `Bearer ${a3a1e8aa3dcbba77289fb7c87f3eed12}`
        }
    })
    return response.data
}

export const deleteReview = async (reviewId, token) => {
    const response = await axios.delete(`/review/${reviewId}`, {
        headers: {
            Authorization: `Bearer ${a3a1e8aa3dcbba77289fb7c87f3eed12}`
        }
    })
    return response.data
}