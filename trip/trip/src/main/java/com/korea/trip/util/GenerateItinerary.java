package com.korea.trip.util;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.korea.trip.dto.MultiDayScheduleResponse;
import com.korea.trip.dto.PlaceDto;
import com.korea.trip.dto.ScheduleResponse;

@Component
public class GenerateItinerary {

    private final KakaoPlaceUtil kakaoPlaceUtil;
    private final BusUtil busUtil;
    private final KorailUtil korailUtil;

    public GenerateItinerary(KakaoPlaceUtil kakaoPlaceUtil, BusUtil busUtil, KorailUtil korailUtil) {
        this.kakaoPlaceUtil = kakaoPlaceUtil;
        this.busUtil = busUtil;
        this.korailUtil = korailUtil;
    }

    public ScheduleResponse generate(String departure, String arrival, String date, String transportType) {
        // 1. 교통편 호출 (현재는 데이터 활용 안 함)
        if ("korail".equalsIgnoreCase(transportType)) {
            korailUtil.fetchKorail(departure, arrival, date);
        } else if ("bus".equalsIgnoreCase(transportType)) {
            busUtil.fetchBus(departure, arrival, date);
        }

        // 2. 관광지(AT4) 먼저 검색
        List<PlaceDto> attractions = kakaoPlaceUtil.searchPlaces(arrival+"관광지", "AT4");
        if (attractions.isEmpty()) {
            return buildScheduleResponse(departure, arrival, date, List.of());
        }

        // 3. 기준점: 첫 번째 관광지
        PlaceDto base = attractions.get(0);
        double MAX_DISTANCE_KM = 20.0;

        // 4. 관광지 필터링
        List<PlaceDto> selectedAttractions = attractions.stream()
                .filter(p -> getDistance(base, p) <= MAX_DISTANCE_KM)
                .limit(10)
                .collect(Collectors.toList());

        // 5. 음식점(FD6) & 카페(CE7) 별도로 요청 후 필터링
        List<PlaceDto> selectedRestaurants = kakaoPlaceUtil.searchPlaces(arrival, "FD6").stream()
                .filter(p -> getDistance(base, p) <= MAX_DISTANCE_KM)
                .limit(10)
                .collect(Collectors.toList());

        List<PlaceDto> selectedCafes = kakaoPlaceUtil.searchPlaces(arrival, "CE7").stream()
                .filter(p -> getDistance(base, p) <= MAX_DISTANCE_KM)
                .limit(10)
                .collect(Collectors.toList());

        // 6. 장소 통합 및 정렬
        List<PlaceDto> all = new ArrayList<>();
        all.addAll(selectedAttractions);
        all.addAll(selectedRestaurants);
        all.addAll(selectedCafes);

        Map<String, Integer> priority = Map.of(
                "AT4", 1,
                "FD6", 2,
                "CE7", 3
        );

        all.sort(Comparator.comparingInt(p -> priority.getOrDefault(p.getCategoryCode(), 99)));

        // 7. 최종 일정 반환
        return buildScheduleResponse(departure, arrival, date, all);
    }

    private ScheduleResponse buildScheduleResponse(String departure, String arrival, String date, List<PlaceDto> places) {
        ScheduleResponse response = new ScheduleResponse();
        response.setTitle(departure + " → " + arrival + " 추천 장소");
        response.setDate(date);
        response.setPlaces(places);
        return response;
    }

    // 거리 계산 메서드 (Haversine)
    private double getDistance(PlaceDto p1, PlaceDto p2) {
        final int EARTH_RADIUS = 6371; // km 단위

        double lat1 = Math.toRadians(p1.getLat());
        double lng1 = Math.toRadians(p1.getLng());
        double lat2 = Math.toRadians(p2.getLat());
        double lng2 = Math.toRadians(p2.getLng());

        double dLat = lat2 - lat1;
        double dLng = lng2 - lng1;

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }
    
 // 하루 일정 추천 함수 (관광지2, 음식점3, 카페2)
    private List<PlaceDto> recommendDailyPlaces(String locationKeyword, int offset) {
        // offset은 중복 회피용 페이지/검색조건 인덱스로 활용 가능

        List<PlaceDto> places = new ArrayList<>();

        // 관광지 2개
        List<PlaceDto> attractions = kakaoPlaceUtil.searchPlaces(locationKeyword + " 관광지", "AT4");
        places.addAll(selectDistinctPlaces(attractions, 2, offset));

        // 음식점 3개
        List<PlaceDto> restaurants = kakaoPlaceUtil.searchPlaces(locationKeyword + " 맛집", "FD6");
        places.addAll(selectDistinctPlaces(restaurants, 3, offset));

        // 카페 2개
        List<PlaceDto> cafes = kakaoPlaceUtil.searchPlaces(locationKeyword + " 카페", "CE7");
        places.addAll(selectDistinctPlaces(cafes, 2, offset));

        return places;
    }

    // 중복없이 일정 개수만큼 장소 선택 (offset 활용해서 다른 장소 선별)
    private List<PlaceDto> selectDistinctPlaces(List<PlaceDto> places, int maxCount, int offset) {
        if (places == null || places.isEmpty()) return Collections.emptyList();

        int start = offset * maxCount;
        int size = places.size();
        List<PlaceDto> selected = new ArrayList<>();

        for (int i = 0; i < maxCount; i++) {
            int idx = (start + i) % size;  // 순환 인덱스
            selected.add(places.get(idx));
        }

        return selected;
    }

    // 다일정 생성 API (2박3일~최대10일까지)
    public MultiDayScheduleResponse generateMultiDaySchedule(String departure, String arrival, String startDateStr, int days) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        Map<String, List<PlaceDto>> dailyPlan = new LinkedHashMap<>();

        for (int i = 0; i < days; i++) {
            LocalDate currentDate = startDate.plusDays(i);
            List<PlaceDto> dayPlaces = recommendDailyPlaces(arrival, i);
            dailyPlan.put(currentDate.toString(), dayPlaces);
        }

        MultiDayScheduleResponse response = new MultiDayScheduleResponse();
        response.setTitle(departure + " → " + arrival + " " + days + "일 여행 일정");
        response.setDailyPlan(dailyPlan);

        return response;
    }
    
    
}
