package com.korea.trip.util;

import java.util.*;

import jakarta.annotation.PostConstruct;

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
    private final ObjectMapper mapper = new ObjectMapper();

    private Map<String, String> stationCodeMap = new HashMap<>();

    @PostConstruct
    public void init() {
        stationCodeMap = fetchStationCodeMap();
    }
    
    /*코레일 열차 운행 정보 조회 API 호출*/
    public List<String> fetchKorail(String departureCode, String arrivalCode, String date) {
        List<String> result = new ArrayList<>();

        String url = "https://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo"
                + "?serviceKey=" + serviceKey
                + "&_type=json"
                + "&depPlaceId=" + departureCode
                + "&arrPlaceId=" + arrivalCode
                + "&depPlandTime=" + date + "0600"
                + "&trainGradeCode="; // 필요 시 등급 필터링 가능

        System.out.println("📤 [코레일 조회 요청]");
        System.out.println("➡ URL: " + url);
        System.out.println("➡ 출발지: " + departureCode + " / 도착지: " + arrivalCode + " / 날짜: " + date);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            System.out.println("코레일 원본 응답: " + response.getBody());
            JsonNode items = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String grade = item.path("trainGradeName").asText(); // KTX, ITX 등
                    String time = item.path("depPlandTime").asText().substring(8, 12); // HHmm
                    result.add(grade + " " + time);
                }
            } else if (items.isObject()) {
                String grade = items.path("trainGradeName").asText();
                String time = items.path("depPlandTime").asText().substring(8, 12);
                result.add(grade + " " + time);
            }

        } catch (Exception e) {
            System.err.println("🛑 코레일 API 응답 처리 실패: " + e.getMessage());
            e.printStackTrace();
        }

        return result;
    }
    

    /**
     * ✅ 전국 역 목록 수집
     */
    public Map<String, String> fetchStationCodeMap() {
        Map<String, String> result = new HashMap<>();
        String cityListUrl = "https://apis.data.go.kr/1613000/TrainInfoService/getCtyCodeList"
                           + "?serviceKey=" + serviceKey + "&_type=json";

        try {
            ResponseEntity<String> cityResponse = restTemplate.getForEntity(cityListUrl, String.class);
            JsonNode cities = mapper.readTree(cityResponse.getBody())
                    .path("response").path("body").path("items").path("item");

            List<String> cityCodes = new ArrayList<>();
            if (cities.isArray()) {
                for (JsonNode city : cities) {
                    String cityCode = city.path("citycode").asText();
                    cityCodes.add(cityCode);
                }
            }

            for (String cityCode : cityCodes) {
                String stationUrl = "https://apis.data.go.kr/1613000/TrainInfoService/getCtyAcctoTrainSttnList"
                        + "?serviceKey=" + serviceKey
                        + "&_type=json"
                        + "&cityCode=" + cityCode;

                try {
                    ResponseEntity<String> stationResponse = restTemplate.getForEntity(stationUrl, String.class);
                    JsonNode stations = mapper.readTree(stationResponse.getBody())
                            .path("response").path("body").path("items").path("item");

                    if (stations.isArray()) {
                        for (JsonNode station : stations) {
                            String stationName = station.path("nodename").asText(); // 수원
                            String stationCode = station.path("nodeid").asText();   // 0001
                            result.put(stationName, stationCode);
                        }
                    } else if (stations.isObject()) {
                        String stationName = stations.path("nodename").asText();
                        String stationCode = stations.path("nodeid").asText();
                        result.put(stationName, stationCode);
                    }

                } catch (Exception ex) {
                    System.err.println("🛑 [" + cityCode + "] 역 조회 실패: " + ex.getMessage());
                }
            }

            System.out.println("✅ 역 목록 로딩 완료: " + result.size() + "개");

        } catch (Exception e) {
            System.err.println("🛑 열차 도시코드 조회 실패: " + e.getMessage());
        }

        return result;
    }

    /**
     * 도시명 → 역 코드 변환
     */
    public String convertCityToStationCode(String cityName) {
        return stationCodeMap.getOrDefault(cityName, cityName); // 없으면 그대로
    }

    /**
     * 전체 역 목록 조회
     */
    public Map<String, String> getStationCodeMap() {
        return stationCodeMap;
    }
}
