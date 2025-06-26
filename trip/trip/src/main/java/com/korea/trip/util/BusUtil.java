package com.korea.trip.util;

import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;

@Component
public class BusUtil {

    @Value("${bus.service-key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // 캐싱된 터미널 코드 맵 (key: 도시명, value: 터미널 코드)
    private Map<String, String> terminalCodeMap = new HashMap<>();

    /**
     * 🔄 애플리케이션 시작 시 터미널 목록 캐싱
     */
    @PostConstruct
    public void init() {
        terminalCodeMap = fetchTerminalCodeMap();
    }

    /**
     * 1️⃣ 전국 고속/시외버스터미널 목록 조회 후 정제
     */
    public Map<String, String> fetchTerminalCodeMap() {
        Map<String, String> map = new HashMap<>();

        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getExpBusTrminlList"
                   + "?serviceKey=" + serviceKey + "&_type=json"+ "&numOfRows=300&pageNo=1";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode itemNode = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            if (itemNode.isArray()) {
                for (JsonNode item : itemNode) {
                    String terminalId = item.path("terminalId").asText();
                    String terminalNm = item.path("terminalNm").asText();
                    String cityName = terminalNm.replaceAll("고속|시외|종합|터미널|버스터미널", "").trim();
                    map.put(cityName, terminalId);
                }
            } else if (itemNode.isObject()) {
                String terminalId = itemNode.path("terminalId").asText();
                String terminalNm = itemNode.path("terminalNm").asText();
                String cityName = terminalNm.replaceAll("고속|시외|종합|터미널|버스터미널", "").trim();
                map.put(cityName, terminalId);
            }

            System.out.println("✅ 버스터미널 목록 로딩 완료: " + map.size() + "개");

        } catch (Exception e) {
            System.err.println("🛑 버스터미널 목록 로딩 실패: " + e.getMessage());
        }

        return map;
    }
    /**
     * 2️⃣ 도시명을 터미널 코드로 변환
     */
    public String convertCityToTerminalCode(String cityName) {
        return terminalCodeMap.getOrDefault(cityName, cityName);
    }

    /**
     * 3️⃣ 버스 정보 조회 (코드 직접 입력)
     */
    public List<String> fetchBus(String departureId, String arrivalId, String date) {
        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo"
                + "?serviceKey=" + serviceKey
                + "&numOfRows=5&pageNo=1&_type=json"
                + "&depTerminalId=" + departureId
                + "&arrTerminalId=" + arrivalId
                + "&depPlandTime=" + date + "0600";

        System.out.println("📤 [버스 조회 요청]");
        System.out.println("➡ URL: " + url);
        System.out.println("➡ 출발지: " + departureId + " / 도착지: " + arrivalId + " / 날짜: " + date);

        List<String> results = new ArrayList<>();

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode items = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String grade = item.path("gradeNm").asText(); // 일반, 우등, 프리미엄 등
                    String time = item.path("depPlandTime").asText().substring(8, 12); // HHMM
                    results.add(grade + " " + time);
                }
            } else {
                results.add("🛑 조회된 버스 정보가 없습니다.");
            }

        } catch (Exception e) {
            results.add("🛑 API 요청 실패: " + e.getMessage());
        }

        return results;
    }

    /**
     * 4️⃣ 도시명 기반 버스 정보 조회
     */
    public List<String> fetchBusByCityName(String departureCity, String arrivalCity, String date) {
        String departureId = convertCityToTerminalCode(departureCity);
        String arrivalId = convertCityToTerminalCode(arrivalCity);

        return fetchBus(departureId, arrivalId, date);
    }
}
