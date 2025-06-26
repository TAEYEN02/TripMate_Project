package com.korea.trip.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

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
        return fetchBus(info.getDepPlaceNm(), info.getArrPlaceNm(), info.getDepPlandTime())
    }

    public List<BusInfo> fetchBus(String departureId, String arrivalId, String date) {
        String url = "http://apis.data.go.kr/1613000/ExpBusInfoService/getStrtpntAlocFndExpbusInfo"
                + "?serviceKey=" + serviceKey
                + "&numOfRows=5&pageNo=1&_type=json"
                + "&depTerminalId=" + departureId
                + "&arrTerminalId=" + arrivalId
                + "&depPlandTime=" + date + "0000";

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        List<String> results = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode items = mapper.readTree(response.getBody())
                    .path("response").path("body").path("items").path("item");

            for (JsonNode item : items) {
                String grade = item.get("busGradeName").asText(); // 일반/우등
                String time = item.get("depPlandTime").asText().substring(8, 12);
                results.add(grade + " " + time);
            }
        } catch (Exception e) {
            throw new RuntimeException("버스 API 응답 처리 실패", e);
        }

        return results;
    }
}
