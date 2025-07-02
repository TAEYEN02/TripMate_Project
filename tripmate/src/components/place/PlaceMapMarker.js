import { useEffect } from "react";

const PlaceMapMarker = () => {
    useEffect(() => {
        if (!map || !window.kakao) return
    
        const { lat, lng } = place
        const markerPosition = new window.kakao.maps.LatLng(lat, lng)
    
        const marker = new window.kakao.maps.Marker({
          map,
          position: markerPosition,
          title: place.name,
        })
        
        return () => {
            marker.setMap(null)
        }
    }, [map, place])

    return null
}

export default PlaceMapMarker;