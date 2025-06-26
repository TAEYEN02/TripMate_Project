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
import com.korea.trip.dto.TrainInfo;

@Component
public class KorailUtil {

	@Value("${korail.service-key}")
	private String serviceKey;

	private final RestTemplate restTemplate = new RestTemplate();

	private static final Map<String, String> TRAIN_STATION_CODES = Map.of(
		"서울", "NAT010000",
		"대전", "NAT011668"
		// 필요한 만큼 추가
	);

	public List<TrainInfo> fetchKorail(TrainInfo info) {
		return fetchKorail(info.getDepPlaceName(), info.getArrPlaceName(), info.getDepPlandTime());
	}

	private List<TrainInfo> fetchKorail(String departure, String arrival, String date) {
		String depCode = TRAIN_STATION_CODES.getOrDefault(departure, departure);
		String arrCode = TRAIN_STATION_CODES.getOrDefault(arrival, arrival);
		String url = "https://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo"
				+ "?serviceKey="+ serviceKey
				+ "&numOfRows=100&pageNo=1&_type=json"
				+ "&depPlaceId=" + depCode
				+ "&arrPlaceId=" + arrCode
				+ "&depPlandTime=" + date;
		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
		System.out.println("응답: " + response.getBody());
		List<TrainInfo> results = new ArrayList<>();
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode items = mapper.readTree(response.getBody()).path("response").path("body").path("items").path("item");
			if (items.isArray()) {
				for (JsonNode item : items) {
					TrainInfo resultInfo = new TrainInfo();
					resultInfo.setTrainGradeName(item.get("traingradename").asText());
					resultInfo.setTrainNo(item.get("trainno").asText());
					resultInfo.setDepPlaceName(item.get("depplacename").asText());
					resultInfo.setArrPlaceName(item.get("arrplacename").asText());
					resultInfo.setDepPlandTime(item.get("depplandtime").asText());
					resultInfo.setArrPlandTime(item.get("arrplandtime").asText());
					resultInfo.setAdultCharge(item.get("adultcharge").asInt());
					results.add(resultInfo);
				}
			} else if (!items.isMissingNode() && !items.isNull()) {
				TrainInfo resultInfo = new TrainInfo();
				resultInfo.setTrainGradeName(items.get("traingradename").asText());
				resultInfo.setTrainNo(items.get("trainno").asText());
				resultInfo.setDepPlaceName(items.get("depplacename").asText());
				resultInfo.setArrPlaceName(items.get("arrplacename").asText());
				resultInfo.setDepPlandTime(items.get("depplandtime").asText());
				resultInfo.setArrPlandTime(items.get("arrplandtime").asText());
				resultInfo.setAdultCharge(items.get("adultcharge").asInt());
				results.add(resultInfo);
			}
		} catch (Exception e) {
			throw new RuntimeException("열차 API 응답 처리 실패", e);
		}
		return results;
	}
}
