package com.korea.trip.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.BusInfo;
import com.korea.trip.dto.TerminalInfo;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class BusUtil {

    @Value("${bus.service-key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private Map<String, List<TerminalInfo>> cityTerminalMap = new HashMap<>();

    public Map<String, List<TerminalInfo>> getCityTerminalMap() {
        return cityTerminalMap;
    }

    @PostConstruct
    public void init() {
        cityTerminalMap = fetchCityTerminalMap();
        System.out.println("✅ 버스터미널 목록 로딩 완료: " + cityTerminalMap.size() + "개 도시");
    }

    public Map<String, List<TerminalInfo>> fetchCityTerminalMap() {
        Map<String, List<TerminalInfo>> map = new HashMap<>();
        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getCtyCodeList"
                + "?serviceKey=" + serviceKey + "&_type=json";

        try {
            ResponseEntity<String> cityResponse = restTemplate.getForEntity(url, String.class);
            JsonNode cities = mapper.readTree(cityResponse.getBody())
                    .path("response").path("body").path("items").path("item");

            for (JsonNode city : cities) {
                String cityCode = city.path("citycode").asText();
                String cityName = city.path("cityname").asText();

                String terminalUrl = "https://apis.data.go.kr/1613000/ExpBusInfoService/getCtyAcctoBtsStaList"
                        + "?serviceKey=" + serviceKey + "&_type=json"
                        + "&cityCode=" + cityCode;

                try {
                    ResponseEntity<String> terminalResponse = restTemplate.getForEntity(terminalUrl, String.class);
                    JsonNode items = mapper.readTree(terminalResponse.getBody())
                            .path("response").path("body").path("items").path("item");

                    List<TerminalInfo> terminals = new ArrayList<>();
                    if (items.isArray()) {
                        for (JsonNode item : items) {
                            String id = item.path("terminalId").asText();
                            String name = item.path("terminalNm").asText();
                            terminals.add(new TerminalInfo(id, name,cityName));
                        }
                    } else if (items.isObject()) {
                        String id = items.path("terminalId").asText();
                        String name = items.path("terminalNm").asText();
                        terminals.add(new TerminalInfo(id, name,cityName));
                    }
                    map.put(cityName, terminals);
                } catch (Exception e) {
                    System.err.println("🛑 [" + cityName + "] 터미널 조회 실패: " + e.getMessage());
                }
            }

        } catch (Exception e) {
            System.err.println("🛑 도시 코드 목록 로딩 실패 (버스): " + e.getMessage());
        }

        return map;
    }
    
    
    
    public List<BusInfo> fetchBus(String depTerminalId, String arrTerminalId, String date, TimeRange timeRange) {
        List<BusInfo> allFetched = new ArrayList<>();
        List<BusInfo> results;

        String url = "https://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo"
                + "?serviceKey=" + serviceKey
                + "&_type=json"
                + "&depTerminalId=" + depTerminalId
                + "&arrTerminalId=" + arrTerminalId
                + "&depPlandTime=" + date;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode items = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    BusInfo bus = new BusInfo(
                        item.path("busGradeName").asText(),
                        item.path("busNo").asText(),
                        item.path("depPlandTime").asText(),
                        item.path("arrPlandTime").asText(),
                        item.path("depPlaceName").asText(),
                        item.path("arrPlaceName").asText(),
                        item.path("adultCharge").asInt()
                    );
                    allFetched.add(bus);
                }
            } else if (items.isObject()) {
                JsonNode item = items;
                BusInfo bus = new BusInfo(
                    item.path("busGradeName").asText(),
                    item.path("busNo").asText(),
                    item.path("depPlandTime").asText(),
                    item.path("arrPlandTime").asText(),
                    item.path("depPlaceName").asText(),
                    item.path("arrPlaceName").asText(),
                    item.path("adultCharge").asInt()
                );
                allFetched.add(bus);
            }

            if (timeRange != null) {
                results = allFetched.stream()
                    .filter(bus -> timeRange.isInRange(bus.getDepPlandTime()))
                    .toList();
            } else {
                results = allFetched;
            }

        } catch (Exception e) {
            System.err.println("🛑 버스 조회 실패: " + e.getMessage());
            return List.of();
        }

        return results;
    }


    public List<String> getTerminalIdsByCity(String cityName) {
        if (cityName == null || cityName.isEmpty()) {
            return List.of();
        }
        List<TerminalInfo> terminals = cityTerminalMap.get(cityName);
        if (terminals == null || terminals.isEmpty()) {
            return List.of();
        }
        return terminals.stream()
                .map(TerminalInfo::getTerminalId)
                .toList();
    }
}