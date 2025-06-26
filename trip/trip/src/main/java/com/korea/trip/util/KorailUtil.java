package com.korea.trip.util;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class KorailUtil {

	@Value("${korail.service-key}")
	private String serviceKey;

	private final RestTemplate restTemplate = new RestTemplate();

	private static final Map<String, String> STATION_CODES = Map.of("서울", "0001", "용산", "0002", "부산", "0020", "대전",
			"0010"
	// 필요한 만큼 추가
	);

	public List<String> fetchKorail(String departure, String arrival, String date) {

		String depCode = STATION_CODES.getOrDefault(departure, departure); // 혹시 코드가 들어와도 허용
		String arrCode = STATION_CODES.getOrDefault(arrival, arrival);


		String url = "https://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo" 
				+ "?serviceKey="+ serviceKey 
				+ "&numOfRows=5&pageNo=1&_type=json" 
				+ "&depPlaceId=" + depCode 
				+ "&arrPlaceId=" + arrCode
				+ "&depPlandTime=" + date; // ex: 20250630

		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

		System.out.println("응답: " + response.getBody());

		List<String> results = new ArrayList<>();
		try {
			ObjectMapper mapper = new ObjectMapper();

			JsonNode items = mapper.readTree(response.getBody()).path("response").path("body").path("items")
					.path("item");

			for (JsonNode item : items) {
				String trainType = item.get("traingradename").asText(); // KTX, 무궁화 등
				String time = item.get("depplandtime").asText().substring(8, 12); // HHMM
				results.add(trainType + " " + time);
			}
		} catch (Exception e) {
			throw new RuntimeException("열차 API 응답 처리 실패", e);
		}

		return results;
	}
}
