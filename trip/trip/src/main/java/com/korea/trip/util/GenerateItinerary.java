package com.korea.trip.util;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.korea.trip.dto.PlaceDto;
import com.korea.trip.dto.ScheduleResponse;

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

	public ScheduleResponse generate(String departure, String arrival, String date, String transportType) {
		// 1. 교통편 정보 조회 (열차/버스)
		List<String> transportOptions = List.of();
		if ("korail".equalsIgnoreCase(transportType)) {
			transportOptions = korailUtil.fetchKorail(departure, arrival, date);
		} else if ("bus".equalsIgnoreCase(transportType)) {
			transportOptions = busUtil.fetchBus(departure, arrival, date);
		}

		// 2. 이동 시간 계산 (예: 첫 교통편 기준)
		// TODO: 교통편 데이터 파싱해서 실제 소요시간 계산

		// 3. 장소 추천 조회 (목적지 인근)
		List<PlaceDto> places = kakaoPlaceUtil.searchRecommendedPlaces(arrival);

		// 4. 우선순위 정렬: 관광지 > 음식점 > 카페 > 그 외
		Map<String, Integer> priorityMap = Map.of("AT4", 1, "FD6", 2, "CE7", 3);

		places.sort(Comparator.comparingInt(p -> priorityMap.getOrDefault(p.getCategoryCode(), 99)));

		// 5. 일정 생성 로직 (단순 배치 예시)
		// TODO: 장소 수, 체류 시간, 이동 시간 고려해서 일정짜기

		// 6. ScheduleResponse 객체에 일정 데이터 채워서 반환
		ScheduleResponse response = new ScheduleResponse();
		response.setTitle(departure + "→" + arrival + " 여행 일정");
		response.setDate(date);
		response.setPlaces(places);

		return response;
	}
}
