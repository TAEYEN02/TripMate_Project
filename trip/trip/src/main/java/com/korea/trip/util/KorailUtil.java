package com.korea.trip.util;

import java.util.*;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.KorailInfo;
import com.korea.trip.dto.StationInfo;

import jakarta.annotation.PostConstruct;

@Component
public class KorailUtil {

    @Value("${korail.service-key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private Map<String, List<StationInfo>> cityStationMap = new HashMap<>();

    public Map<String, List<StationInfo>> getCityStationMap() {
        return cityStationMap;
    }

    @PostConstruct
    public void init() {
        cityStationMap = fetchCityStationMap();
        System.out.println("✅ 코레일 역 목록 로딩 완료: " + cityStationMap.size() + "개 도시");
        cityStationMap.forEach((city, stations) -> {
            System.out.println(city + " → 역 수: " + stations.size() + ", 역명들: " +
                stations.stream().map(StationInfo::getStationName).toList());
        });
    }

    public String simplifyCityName(String fullCityName) {
        return fullCityName.replace("광역시", "")
                           .replace("특별시", "")
                           .replace("도", "")
                           .trim();
    }
   

    public Map<String, List<StationInfo>> fetchCityStationMap() {
        Map<String, List<StationInfo>> map = new HashMap<>();
        String cityUrl = "https://apis.data.go.kr/1613000/TrainInfoService/getCtyCodeList"
                + "?serviceKey=" + serviceKey + "&_type=json";

        try {
            ResponseEntity<String> cityResponse = restTemplate.getForEntity(cityUrl, String.class);
            JsonNode cities = mapper.readTree(cityResponse.getBody())
                                    .path("response").path("body").path("items").path("item");

            if (cities.isArray()) {
                for (JsonNode cityNode : cities) {
                    String cityCode = cityNode.path("citycode").asText();
                    String rawCityName = cityNode.path("cityname").asText();
                    String simplifiedCity = simplifyCityName(rawCityName);

                    String stationUrl = "https://apis.data.go.kr/1613000/TrainInfoService/getCtyAcctoTrainSttnList"
                            + "?serviceKey=" + serviceKey + "&_type=json&cityCode=" + cityCode + "&numOfRows=100";

                    try {
                        ResponseEntity<String> response = restTemplate.getForEntity(stationUrl, String.class);
                        JsonNode stations = mapper.readTree(response.getBody())
                                                  .path("response").path("body").path("items").path("item");

                        List<StationInfo> list = new ArrayList<>();
                        if (stations.isArray()) {
                            for (JsonNode s : stations) {
                                String stationName = s.path("nodename").asText();
                                String stationCode = s.path("nodeid").asText();
                                list.add(new StationInfo(stationCode, stationName, "기타"));
                            }
                        } else if (stations.isObject()) {
                            String stationName = stations.path("nodename").asText();
                            String stationCode = stations.path("nodeid").asText();
                            list.add(new StationInfo(stationCode, stationName, "기타"));
                        }
                        map.put(simplifiedCity, list);
                    } catch (Exception e) {
                        System.err.println("🛑 [" + rawCityName + "] 역 조회 실패: " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("🛑 도시 코드 목록 로딩 실패: " + e.getMessage());
        }

        return map;
    }

    public List<StationInfo> getStationsByCityKeyword(String cityKeyword) {
        String simplified = simplifyCityName(cityKeyword);
        List<StationInfo> result = new ArrayList<>();
        for (Map.Entry<String, List<StationInfo>> entry : cityStationMap.entrySet()) {
            if (entry.getKey().contains(simplified)) {
                result.addAll(entry.getValue());
            } else {
                for (StationInfo s : entry.getValue()) {
                    if (s.getStationName().contains(simplified)) {
                        result.add(s);
                    }
                }
            }
        }
        return result;
    }

    public List<KorailInfo> fetchKorail(String depStationId, String arrStationId, String date, TimeRange timeRange) {
        List<KorailInfo> allFetched = new ArrayList<>();
        List<KorailInfo> results;

        String url = "https://apis.data.go.kr/1613000/TrainInfoService/getStrtpntAlocFndTrainInfo"
                + "?serviceKey=" + serviceKey
                + "&_type=json"
                + "&depPlaceId=" + depStationId
                + "&arrPlaceId=" + arrStationId
                + "&depPlandTime=" + date;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode items = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    KorailInfo korail = new KorailInfo(
                            item.path("traingradename").asText(),
                            item.path("trainno").asText(),
                            item.path("depplandtime").asText(),
                            item.path("arrplandtime").asText(),
                            item.path("depplacename").asText(),
                            item.path("arrplacename").asText(),
                            item.path("adultcharge").asInt()
                    );
                    allFetched.add(korail);
                }
            } else if (items.isObject()) {
                JsonNode item = items;
                KorailInfo korail = new KorailInfo(
                        item.path("traingradename").asText(),
                        item.path("trainno").asText(),
                        item.path("depplandtime").asText(),
                        item.path("arrplandtime").asText(),
                        item.path("depplacename").asText(),
                        item.path("arrplacename").asText(),
                        item.path("adultcharge").asInt()
                );
                allFetched.add(korail);
            }

            // 시간대 필터링
            if (timeRange != null) {
                results = allFetched.stream()
                        .filter(train -> timeRange.isInRange(train.getDepPlandTime()))
                        .toList();
            } else {
                results = allFetched;
            }

        } catch (Exception e) {
            System.err.println("🛑 열차 조회 실패: " + e.getMessage());
            return List.of(); // 실패 시 빈 리스트
        }

        return results;
    }
    
    public List<StationInfo> getMajorStationsByCityKeyword(String cityKeyword) {
        if (cityKeyword == null || cityKeyword.isEmpty()) {
            return List.of();
        }

        String simplified = simplifyCityName(cityKeyword);
        if (cityStationMap == null || cityStationMap.isEmpty()) {
            return List.of();
        }

        List<StationInfo> stations = cityStationMap.get(simplified);
        if (stations == null) {
            stations = List.of();
        }

        return stations;
    }

    // 비동기 호출
    @Async
    public CompletableFuture<List<KorailInfo>> fetchKorailAsync(String depStationId, String arrStationId, String date, TimeRange timeRange) {
        List<KorailInfo> result = fetchKorail(depStationId, arrStationId, date, timeRange);
        return CompletableFuture.completedFuture(result);
    }
}
