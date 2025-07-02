import axios from "axios";

export const searchPlace = async (params) => {
    const response = await axios.get('/place/search', {params})
    return response.data;
}

export const getPlaceDetail = async (placeId) => {
    const response = await axios.get(`/place/${placeId}`)
    return response.data;
}