package com.korea.trip.util;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.BusInfo;
import com.korea.trip.dto.TerminalInfo;

import jakarta.annotation.PostConstruct;

@Component
public class BusUtil {

    @Value("${bus.service-key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private Map<String, List<TerminalInfo>> cityTerminalMap = new HashMap<>();

    @PostConstruct
    public void init() {
        cityTerminalMap = fetchTerminalMap();
        System.out.println("✅ 버스터미널 목록 로딩 완료: " + cityTerminalMap.size() + "개 도시");
        cityTerminalMap.forEach((city, list) -> {
            System.out.println(city + " → 터미널 수: " + list.size() + ", 터미널들: " + 
                list.stream().map(t -> t.getTerminalName()).collect(Collectors.toList()));
        });
    }

    public Map<String, List<TerminalInfo>> fetchTerminalMap() {
        Map<String, List<TerminalInfo>> map = new HashMap<>();

        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getExpBusTrminlList"
                + "?serviceKey=" + serviceKey + "&_type=json" + "&numOfRows=300&pageNo=1";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode items = mapper.readTree(response.getBody()).path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String terminalId = item.path("terminalId").asText();
                    String terminalNm = item.path("terminalNm").asText();

                    String city = extractCityFromTerminalName(terminalNm);
                    TerminalInfo terminalInfo = new TerminalInfo(terminalId, terminalNm, city);

                    map.computeIfAbsent(city, k -> new ArrayList<>()).add(terminalInfo);
                }
            } else if (items.isObject()) {
                String terminalId = items.path("terminalId").asText();
                String terminalNm = items.path("terminalNm").asText();

                String city = extractCityFromTerminalName(terminalNm);
                TerminalInfo terminalInfo = new TerminalInfo(terminalId, terminalNm, city);

                map.computeIfAbsent(city, k -> new ArrayList<>()).add(terminalInfo);
            }
        } catch (Exception e) {
            System.err.println("🛑 버스터미널 목록 로딩 실패: " + e.getMessage());
        }

        return map;
    }

    private String extractCityFromTerminalName(String terminalNm) {

        return "기타";
    }

    // 도시명 기준으로 터미널 ID 리스트 가져오기
    public List<String> getTerminalIdsByCity(String cityName) {

        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo"
                + "?serviceKey=" + serviceKey
                + "&numOfRows=100&pageNo=1&_type=json"
                + "&depTerminalId=" + depTerminalId
                + "&arrTerminalId=" + arrTerminalId
                + "&depPlandTime=" + date;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode items = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    BusInfo busInfo = new BusInfo(
                            item.path("gradeNm").asText(),
                            item.path("routeId").asText(),
                            item.path("depPlandTime").asText(),
                            item.path("arrPlandTime").asText(),
                            item.path("depPlaceNm").asText(),
                            item.path("arrPlaceNm").asText(),
                            item.path("charge").asInt()
                    );
                    results.add(busInfo);
                }
            } else if (items.isObject()) {
                BusInfo busInfo = new BusInfo(
                        items.path("gradeNm").asText(),
                        items.path("routeId").asText(),
                        items.path("depPlandTime").asText(),
                        items.path("arrPlandTime").asText(),
                        items.path("depPlaceNm").asText(),
                        items.path("arrPlaceNm").asText(),
                        items.path("charge").asInt()
                );
                results.add(busInfo);
            }
        } catch (Exception e) {
            System.err.println("🛑 버스 정보 조회 실패: " + e.getMessage());
        }

        return results;
    }

    // 도시명 기준으로 모든 조합 버스 조회 및 문자열 리스트 반환
    public List<String> fetchBusByCityName(String depCity, String arrCity, String date) {
        List<String> depIds = getTerminalIdsByCity(depCity);
        List<String> arrIds = getTerminalIdsByCity(arrCity);

        List<BusInfo> allBuses = new ArrayList<>();
        for (String depId : depIds) {
            for (String arrId : arrIds) {
                allBuses.addAll(fetchBus(depId, arrId, date));
            }
        }

        return allBuses.stream()
                .map(bus -> String.format("%s | %s → %s | %d원 | %s → %s",
                        bus.getGradeNm(),
                        bus.getDepPlaceNm(),
                        bus.getArrPlaceNm(),
                        bus.getCharge(),
                        bus.getDepPlandTime().substring(8, 12),
                        bus.getArrPlandTime().substring(8, 12)))
                .collect(Collectors.toList());
    }
}
