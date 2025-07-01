package com.korea.trip.dto;

import lombok.Data;

@Data
public class PlaceDto {
    private String name;
    private String address;
    private String category;
    private String categoryCode;
    private double lat;
    private double lng;
    private String photoUrl;
//    
//    public double getDistance() {
//        // 기준점(도착지 중심)과의 거리 계산 예시 - 실제 기준점 위도경도는 외부에서 설정해야 함
//        // 여기서는 간단하게 0,0 기준 거리라고 가정 (실제 구현에 맞게 조정 필요)
//        double baseLat = 0;
//        double baseLng = 0;
//        return haversineDistance(baseLat, baseLng, this.lat, this.lng);
//    }
//
//    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
//        final int EARTH_RADIUS = 6371;
//        double dLat = Math.toRadians(lat2 - lat1);
//        double dLon = Math.toRadians(lon2 - lon1);
//        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
//                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
//                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//        return EARTH_RADIUS * c;
//    }

}
