package com.korea.trip.util;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.korea.trip.dto.PlaceDto;
import com.korea.trip.dto.ScheduleResponse;
import com.korea.trip.dto.TerminalInfo;

@Component
public class GenerateItinerary {

    private final KakaoPlaceUtil kakaoPlaceUtil;
    private final KorailUtil korailUtil;
    private final BusUtil busUtil;

    public GenerateItinerary(KakaoPlaceUtil kakaoPlaceUtil, KorailUtil korailUtil, BusUtil busUtil) {
        this.kakaoPlaceUtil = kakaoPlaceUtil;
        this.korailUtil = korailUtil;
        this.busUtil = busUtil;
    }

    public ScheduleResponse generate(String departureCity, String arrivalCity, String date, String transportType) {
        List<?> transportOptions = List.of();

        // 1. 출발지와 도착지의 역 또는 터미널 ID 목록 조회
        List<String> depIds = List.of();
        List<String> arrIds = List.of();

        // 시간대 필터 (필요시 파라미터 추가해서 사용 가능)
        TimeRange timeRange = null;

        if ("korail".equalsIgnoreCase(transportType)) {
            depIds = korailUtil.getMajorStationsByCityKeyword(departureCity).stream()
                    .map(s -> s.getStationCode())
                    .toList();
            arrIds = korailUtil.getMajorStationsByCityKeyword(arrivalCity).stream()
                    .map(s -> s.getStationCode())
                    .toList();

            if (!depIds.isEmpty() && !arrIds.isEmpty()) {
                // 첫 번째 역 조합으로 열차 조회
                transportOptions = korailUtil.fetchKorail(depIds.get(0), arrIds.get(0), date, timeRange);
            }
        }  else if ("bus".equalsIgnoreCase(transportType)) {
            List<TerminalInfo> depTerminals = busUtil.getTerminalsByCityKeyword(departureCity);
            List<TerminalInfo> arrTerminals = busUtil.getTerminalsByCityKeyword(arrivalCity);

            if (!depTerminals.isEmpty() && !arrTerminals.isEmpty()) {
                transportOptions = busUtil.fetchBus(
                    depTerminals.get(0).getTerminalId(),
                    arrTerminals.get(0).getTerminalId(),
                    date
                );
            }
        }

        // 2. TODO: 조회된 교통편 정보 기반으로 실제 이동 시간 등 일정 생성 로직 추가

        // 3. 도착지 주변 추천 장소 검색
        List<PlaceDto> places = kakaoPlaceUtil.searchRecommendedPlaces(arrivalCity);

        // 4. 카테고리 우선순위에 따른 정렬
        Map<String, Integer> priorityMap = Map.of(
                "AT4", 1,  // 관광지
                "FD6", 2,  // 음식점
                "CE7", 3   // 카페
        );

        places.sort(Comparator.comparingInt(p -> priorityMap.getOrDefault(p.getCategoryCode(), 99)));

        // 5. 일정 생성 응답 세팅
        ScheduleResponse response = new ScheduleResponse();
        response.setTitle(departureCity + " → " + arrivalCity + " 여행 일정");
        response.setDate(date);
        response.setPlaces(places);

        return response;
    }
}
