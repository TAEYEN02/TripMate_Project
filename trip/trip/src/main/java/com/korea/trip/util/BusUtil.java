package com.korea.trip.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.trip.dto.BusInfo;

@Component
public class BusUtil {

    @Value("${bus.service-key}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Map<String, String> BUS_STATION_CODES = Map.of(
        "서울", "NAEK010",
        "대전", "NAEK300"
    );

    public List<BusInfo> fetchBus(BusInfo info) {
        return fetchBus(info.getDepPlaceNm(), info.getArrPlaceNm(), info.getDepPlandTime());
    }

    public List<BusInfo> fetchBus(String departure, String arrival, String date) {
        String depCode = BUS_STATION_CODES.getOrDefault(departure, departure);
        String arrCode = BUS_STATION_CODES.getOrDefault(arrival, arrival);
        String url = "http://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo"
                + "?serviceKey=" + serviceKey
                + "&numOfRows=5&pageNo=1&_type=json"
                + "&depTerminalId=" + depCode
                + "&arrTerminalId=" + arrCode
                + "&depPlandTime=" + date;

        System.out.println("최종 버스 API URL: " + url);
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println("응답: " + response.getBody());
        List<BusInfo> results = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode items = mapper.readTree(response.getBody()).path("response").path("body").path("items").path("item");
            if (items.isArray()){
                for (JsonNode item : items){
                    BusInfo resultInfo = new BusInfo();
                    resultInfo.setGradeNm(item.get("gradeNm").asText());
                    resultInfo.setRouteId(item.get("routeId").asText());
                    resultInfo.setDepPlaceNm(item.get("depPlaceNm").asText());
                    resultInfo.setDepPlandTime(item.get("depPlandTime").asText());
                    resultInfo.setArrPlaceNm(item.get("arrPlaceNm").asText());
                    resultInfo.setArrPlandTiem(item.get("arrPlandTime").asText());
                    resultInfo.setCharge(item.get("charge").asInt());
                    results.add(resultInfo);
                }
            } else if (!items.isMissingNode() && !items.isNull()){
                BusInfo resultInfo = new BusInfo();
                resultInfo.setGradeNm(items.get("gradeNm").asText());
                resultInfo.setRouteId(items.get("routeId").asText());
                resultInfo.setDepPlaceNm(items.get("depPlaceNm").asText());
                resultInfo.setDepPlandTime(items.get("depPlandTime").asText());
                resultInfo.setArrPlaceNm(items.get("arrPlaceNm").asText());
                resultInfo.setArrPlandTiem(items.get("arrPlandTime").asText());
                resultInfo.setCharge(items.get("charge").asInt());
                results.add(resultInfo);
            }
        } catch (Exception e) {
            throw new RuntimeException("버스 API 응답 처리 실패", e);
        }

        return results;
    }
}
